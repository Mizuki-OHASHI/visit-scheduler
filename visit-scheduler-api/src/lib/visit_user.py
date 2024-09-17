# Standard Library
from datetime import date
from typing import Dict, List, Optional, Tuple

# First Party Library
from lib.chouseisan import get_visit_user_schedule_from_chouseisan
from lib.logger import logger
from schema.schedule import ScheduleMaster
from schema.user import VisitUser, VisitUserSchedule


def visit_users_diff(
    old: List[VisitUser], new: List[VisitUser]
) -> Tuple[List[VisitUser], List[VisitUser], List[VisitUser]]:
    """DBのメンバー情報とスプレッドシートのメンバー情報の差分を取得する

    Returns: 新規追加されたメンバー, 更新されたメンバー, 更新なしのメンバー
    """

    grouped_new = group_by_entry_cohort(new)
    grouped_old = group_by_entry_cohort(old)

    entry_cohort = list(set(grouped_new.keys()) | set(grouped_old.keys()))

    added = []
    updated = []
    unchanged = []

    for cohort in entry_cohort:
        new_users = grouped_new.get(cohort, [])
        old_users = grouped_old.get(cohort, [])

        new_users_record = {user.name: user for user in new_users}
        old_users_record = {user.name: user for user in old_users}

        for name, new_user in new_users_record.items():
            old_user = old_users_record.get(name)

            if old_user is None:
                added.append(new_user)
            elif old_user == new_user:
                unchanged.append(old_user)
            else:
                new_user.id = old_user.id
                updated.append(new_user)

    return added, updated, unchanged


def group_by_entry_cohort(visit_users: List[VisitUser]) -> dict[int, List[VisitUser]]:
    """入会期でグループ化した VisitUser のリストを返す"""

    grouped = {}
    for user in visit_users:
        if user.entry_cohort not in grouped:
            grouped[user.entry_cohort] = []
        grouped[user.entry_cohort].append(user)

    return grouped


def diff_visit_users_names(
    visit_users_names: List[str], saved_visit_users: List[VisitUser]
) -> List[str]:
    """DB に保存されているメンバー名以外のメンバー名を返す"""

    saved_names = {user.name for user in saved_visit_users}

    return [name for name in visit_users_names if name not in saved_names]


def merge_visit_user_schedule(
    candidates: List[date],
    base: Dict[str, List[VisitUserSchedule]],
    new: Dict[str, List[VisitUserSchedule]],
) -> Dict[str, List[VisitUserSchedule]]:
    """
    - 新しいメンバーの日程を追加する
    - 同じ名前のメンバーがいる場合は, 基の情報のままにする
    - 新しい方の日程にしかない候補日は無視する
    """

    candidate_set = set(candidates)

    for name, schedules in new.items():
        if name not in base:
            filtered_schedules = [s for s in schedules if s.candidate in candidate_set]
            base[name] = filtered_schedules

    return base


def get_visit_user_schedule(
    scheule_master: ScheduleMaster,
) -> Optional[Dict[str, List[VisitUserSchedule]]]:
    if not isinstance(scheule_master, ScheduleMaster):
        raise TypeError("scheule_master must be an instance of ScheduleMaster")

    base_schedules = get_visit_user_schedule_from_chouseisan(
        scheule_master.chouseisan_id
    )
    if base_schedules is None:
        return None

    for merge_with in scheule_master.merge_with:
        merge_schedules = get_visit_user_schedule_from_chouseisan(merge_with)
        if merge_schedules is None:
            logger.warning(
                "failed to get visit user schedule from chouseisan: %s (while merging into %s)",
                merge_with,
                scheule_master.chouseisan_id,
            )
            continue

        base_schedules = merge_visit_user_schedule(
            scheule_master.candidates, base_schedules, merge_schedules
        )

    return base_schedules
