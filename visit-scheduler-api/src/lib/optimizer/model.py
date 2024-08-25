from datetime import date
from typing import Dict, List

import numpy as np
from mip import Model, minimize, xsum

from lib.logger import logger
from schema.enum import DriverLevel, Gender, ScheduleStatus
from schema.optimize_config import OptimizeConfigByCandidate
from schema.schedule import OptimizedSchedule, PickedDateWithMember, ScheduleWithConfig
from schema.user import VisitUser, VisitUserSchedule


class VisitOptimizer(Model):
    def preprocess(
        self,
        schedule: ScheduleWithConfig,
        visit_users: List[VisitUser],
        visit_user_schedule: Dict[str, List[VisitUserSchedule]],  # key: visit_user.name
    ):
        """前処理

        - 入力変数を扱いやすい形式に変換
        - 変数の追加
        """

        config = schedule.optimize_config
        if config is None:
            raise ValueError("optimize_config is None")
        self.config = config

        self.visit_users = visit_users
        self.visit_user_schedule = visit_user_schedule

        # グループに属しない候補日をフィルタリング
        filtered_candidates: List[OptimizeConfigByCandidate] = []
        for candidate in schedule.optimize_config.candidate_constraints:
            if candidate.group is not None:
                filtered_candidates.append(candidate)
        self.candidates = filtered_candidates

        # candidate -> index のマッピング
        self.candidate_index_map = {
            candidate.candidate: i for i, candidate in enumerate(filtered_candidates)
        }

        # 候補日グループ -> 候補日のマッピング
        candidate_group_map: Dict[str, List[OptimizeConfigByCandidate]] = {}
        for candidate in filtered_candidates:
            if candidate.group is None:
                raise ValueError("critical error: group is None")
            if candidate.group not in candidate_group_map:
                candidate_group_map[candidate.group] = []
            candidate_group_map[candidate.group].append(candidate)
        self.candidate_group_map = candidate_group_map

        # 訪問人数のリスト
        visit_user_count = []
        for candidate in filtered_candidates:
            if candidate.irregular_member_count_constraint is not None:
                visit_user_count.append(candidate.irregular_member_count_constraint)
            else:
                visit_user_count.append(
                    schedule.optimize_config.basic_member_count_constraint
                )
        self.visit_user_count = visit_user_count

        # 候補日と訪問者のスケジュールステータスのマトリックス
        visit_user_schedule_status_matrix = np.zeros(
            (len(visit_users), len(filtered_candidates)), dtype=int
        )
        for i, visit_user in enumerate(visit_users):
            user_schedule = visit_user_schedule.get(visit_user.name, None)
            if user_schedule is not None:
                for j, candidate in enumerate(filtered_candidates):
                    # user_schedule の中から candidate に対応するスケジュールを取得
                    for user_schedule_item in user_schedule:
                        if user_schedule_item.candidate == candidate.candidate:
                            if (
                                user_schedule_item.status
                                == ScheduleStatus.preferred.value
                            ):
                                visit_user_schedule_status_matrix[i, j] = 2
                            elif (
                                user_schedule_item.status
                                == ScheduleStatus.available.value
                            ):
                                visit_user_schedule_status_matrix[i, j] = 1
                            break
        # [i, j] = 2 if visit_user[i] prefers candidate[j]
        # [i, j] = 1 if visit_user[i] is available on candidate[j]
        # [i, j] = 0 otherwise
        self.status_matrix = visit_user_schedule_status_matrix

        # 変数の追加

        # X[i, j] = 1 if visit_user[i] is assigned to candidate[j]
        self.X = np.zeros((len(self.visit_users), len(self.candidates)), dtype=object)
        for i in range(len(self.visit_users)):
            for j in range(len(self.candidates)):
                # 訪問者が候補日に対応している場合のみ変数を追加
                if self.status_matrix[i, j] > 0:
                    self.X[i, j] = self.add_var(
                        name=f"x_{i}_{j}",
                        var_type="B",
                    )

        # y[j] = 1 if candidate[j] is selected
        self.y = np.ones(len(self.candidates), dtype=object)
        for group in candidate_group_map:
            group_size = len(candidate_group_map[group])
            # グループ内の候補日が複数の場合は、グループ内で選択される候補日を変数とする
            if group_size > 1:
                for i in range(group_size):
                    candidate_idx = self.candidate_index_map[
                        candidate_group_map[group][i].candidate
                    ]
                    self.y[candidate_idx] = self.add_var(
                        name=f"y_{candidate_idx}",
                        var_type="B",
                    )

        # a[i] = 1 if visit_user[i] is assigned to at least one candidate
        self.a = self.add_var_tensor((len(self.visit_users),), name="a", var_type="B")

        # b[j] = 1 if candidate[j] needs additinal driver of level 3
        self.b = self.add_var_tensor(
            (len(filtered_candidates),), name="b", var_type="B"
        )

        # f[j] = 1 if at least one female visit_user is assigned to candidate[j]
        self.f = self.add_var_tensor(
            (len(filtered_candidates),), name="f", var_type="B"
        )

        # m[j] = 1 if at least one male visit_user is assigned to candidate[j]
        self.m = self.add_var_tensor(
            (len(filtered_candidates),), name="m", var_type="B"
        )

    def _cons_select_one(self):
        """各グループごとに1つだけ選択される"""
        for group in self.candidate_group_map:
            if len(self.candidate_group_map[group]) > 1:
                self += (
                    xsum(
                        self.y[self.candidate_index_map[candidate.candidate]]
                        for candidate in self.candidate_group_map[group]
                    )
                    == 1
                )

    def _cons_driver(self):
        """運転レベルの総和"""
        for j in range(len(self.candidates)):
            vehicle_num = np.ceil(self.visit_user_count[j] / 7)
            required_total_driver_level = (
                vehicle_num * self.config.driver_level_constraint
            )
            self += (
                xsum(
                    self.X[i, j] * DriverLevel(self.visit_users[i].driver_level).int
                    for i in range(len(self.visit_users))
                )
                >= required_total_driver_level * self.y[j] - 3 * self.b[j]
            )

    def _cons_visiter(self):
        """訪問者数"""
        for j in range(len(self.candidates)):
            self += (
                xsum(self.X[i, j] for i in range(len(self.visit_users)))
                == self.visit_user_count[j] * self.y[j] - self.b[j]
            )

    def _cons_visit_time(self):
        """変数 a と X の関係"""
        for i in range(len(self.visit_users)):
            self += xsum(self.X[i, j] for j in range(len(self.candidates))) >= self.a[i]

    def _cons_visiter_by_entry_cohort(self):
        """入会期別の人数"""

        # 入会期ごとにメンバーをグループ化
        visit_user_by_entry_cohort = {}
        for i, visit_user in enumerate(self.visit_users):
            if visit_user.entry_cohort not in visit_user_by_entry_cohort:
                visit_user_by_entry_cohort[visit_user.entry_cohort] = []
            visit_user_by_entry_cohort[visit_user.entry_cohort].append(i)

        for [cohorts, ope, num] in self.config.entry_cohort_constraint:
            target_users = []
            for cohorts_key in cohorts:
                if cohorts_key in visit_user_by_entry_cohort:
                    target_users.extend(visit_user_by_entry_cohort[cohorts_key])
            for j in range(len(self.candidates)):
                if ope == "==":
                    self += xsum(self.X[i, j] for i in target_users) == num * self.y[j]
                elif ope == ">=":
                    self += xsum(self.X[i, j] for i in target_users) >= num * self.y[j]
                elif ope == "<=":
                    self += xsum(self.X[i, j] for i in target_users) <= num * self.y[j]
                else:
                    raise ValueError("invalid operator {}".format(ope))

    def _cons_task(self):
        """タスクの割り当て"""

        # タスクごとにメンバーをグループ化
        visit_user_by_task = {}
        for i, visit_user in enumerate(self.visit_users):
            for task in visit_user.responsible_tasks:
                if task not in visit_user_by_task:
                    visit_user_by_task[task] = []
                visit_user_by_task[task].append(i)

        for j, candidate in enumerate(self.candidates):
            for task, num in candidate.tasks:
                if task not in visit_user_by_task:
                    continue
                self += (
                    xsum(self.X[i, j] for i in visit_user_by_task[task])
                    >= num * self.y[j]
                )

    def _cons_gender(self):
        """X と f, m の関係"""

        # 性別ごとにメンバーをグループ化
        female, male, target_female, target_male = [], [], [], []
        for i, visit_user in enumerate(self.visit_users):
            if visit_user.gender == Gender.female.value:
                female.append(i)
                if visit_user.entry_cohort in self.config.gender_consideration:
                    target_female.append(i)
            elif visit_user.gender == Gender.male.value:
                male.append(i)
                if visit_user.entry_cohort in self.config.gender_consideration:
                    target_male.append(i)

        # 1人でもいる場合に f, m を 1 にする
        for j in range(len(self.candidates)):
            self += (
                xsum(self.X[i, j] for i in target_female)
                >= self.visit_user_count[j] * self.f[j]
            )
            self += (
                xsum(self.X[i, j] for i in target_male)
                >= self.visit_user_count[j] * self.m[j]
            )

        # 1人でもいる場合は2名以上確保する
        for j in range(len(self.candidates)):
            self += xsum(self.X[i, j] for i in female) >= 2 * self.f[j]
            self += xsum(self.X[i, j] for i in male) >= 2 * self.m[j]

    def add_constraints(self):
        """制約の追加"""
        self._cons_select_one()
        self._cons_driver()
        self._cons_visiter()
        self._cons_visit_time()
        self._cons_visiter_by_entry_cohort()
        self._cons_task()
        if len(self.config.gender_consideration) > 0:
            self._cons_gender()

    def set_objective(self):
        """目的関数の設定"""
        min_candidate = date(9999, 12, 31)
        for candidate in self.candidates:
            if candidate.candidate < min_candidate:
                min_candidate = candidate.candidate

        self.objective = minimize(
            # 10_000
            # * xsum(
            #     self.y[j] for j in range(len(self.candidates))
            # )  # 候補日の数は最小限 (同じグループ内で複数選択されてはいけないことをここで表現)
            -10
            * xsum(
                self.status_matrix[i, j] ** 3 * self.X[i, j]
                for i in range(len(self.visit_users))
                for j in range(len(self.candidates))
            )  # prefered な候補日に対しては優先的に割り当てる (3乗しているのは、優先度を高めるため)
            - xsum(
                (self.candidates[j].candidate - self.visit_users[i].last_visit).days
                // 7
                * self.X[i, j]
                for i in range(len(self.visit_users))
                for j in range(len(self.candidates))
            )  # 最後の訪問からの経過週数が多いほど優先度を高める
            + xsum(
                (self.candidates[j].candidate - min_candidate).days * self.y[j]
                for j in range(len(self.candidates))
            )  # 最も早い候補日を選択する
            - 100
            * xsum(
                self.a[i] for i in range(len(self.visit_users))
            )  # 未割り当ての訪問者を最小限にする
            + 1_000
            * xsum(
                self.b[j] for j in range(len(self.candidates))
            )  # 運転手の追加 (助っ人) を最小限にする
        )

    def decode(self):
        """結果のデコード"""

        def get_optimal(obj) -> int:
            try:
                return int(obj.x)
            except:
                if isinstance(obj, int):
                    return obj
                raise ValueError("invalid type {}".format(type(obj)))

        optimal_X = np.zeros((len(self.visit_users), len(self.candidates)), dtype=int)
        for i in range(len(self.visit_users)):
            for j in range(len(self.candidates)):
                optimal_X[i, j] = get_optimal(self.X[i, j])

        optimal_y = np.zeros(len(self.candidates), dtype=int)
        for j in range(len(self.candidates)):
            optimal_y[j] = get_optimal(self.y[j])

        objective_value = self.objective_value

        logger.info("objective value: {}".format(objective_value))

        optimized_schedule = []

        for j, y in enumerate(optimal_y):
            if y == 0:
                continue

            member = [
                self.visit_users[i].id
                for i in range(len(self.visit_users))
                if optimal_X[i, j] == 1
            ]

            picked_date_with_member = PickedDateWithMember(
                date=self.candidates[j].candidate,
                member=member,
            )

            optimized_schedule.append(picked_date_with_member)

        return OptimizedSchedule(
            chouseisan_id=self.config.chouseisan_id, schedule=optimized_schedule
        )
