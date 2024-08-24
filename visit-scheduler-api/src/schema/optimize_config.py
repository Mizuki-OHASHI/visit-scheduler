import re
from datetime import date
from typing import List, Optional, Tuple

from schema.config import VSBaseModel


class OptimizeConfigByCandidate(VSBaseModel):
    """候補日ごとの最適化設定

    - candidate: 候補日
    - group: グループ名
    - tasks: タスク
        - (文字列, 人数) のリスト
    - irregular_member_count_constraint: 変則メンバー数制約
        - 人数制約: 正の整数値
    """

    candidate: date
    group: Optional[str]
    tasks: List[Tuple[str, int]]
    irregular_member_count_constraint: Optional[int]

    def __str__(self):
        group_str = self.group if self.group is not None else "null"
        member_count_constraint_str = (
            str(self.irregular_member_count_constraint)
            if self.irregular_member_count_constraint is not None
            else "null"
        )
        tasks_str = ",".join([f"{t[0]}:{t[1]}" for t in self.tasks])
        candidate_str = self.candidate.strftime("%Y-%m-%d")

        return ";".join(
            [
                candidate_str,
                group_str,
                tasks_str,
                member_count_constraint_str,
            ]
        )


def to_ptimizeConfigByCandidate(text: str) -> OptimizeConfigByCandidate:
    """正規表現でパースする

    入力例: "2021-08-01;A;task1:2,task2:3;5"
    """

    # 正規表現でパースできるかを確認する 2024-09-01;null;;0
    pattern = re.compile(r"(\d{4}-\d{2}-\d{2});((.+)|null);((.+):\d)*;((\d+)|null)")
    if not pattern.match(text):
        raise ValueError(f"invalid format: {text}")

    candidate_str, group_str, tasks, member_count_str = text.split(";")
    year, month, day = map(int, candidate_str.split("-"))
    candidate = date(year, month, day)

    tasks = [tuple(t.split(":")) for t in tasks.split(",") if t]

    group = group_str if group_str != "null" else None
    member_count = int(member_count_str) if member_count_str != "null" else None

    return OptimizeConfigByCandidate(
        candidate=candidate,
        group=group,
        tasks=tasks,
        irregular_member_count_constraint=member_count,
    )


class OptimizeConfig(VSBaseModel):
    """最適化設定

    - entry_cohort_constraint: 入会期制約
        - List[Tuple[入会期, 比較演算子, 人数]]
        - 比較演算子 (==, <=, >=) + 正の整数値
        - 例: [[[8,9], "==", 3], [[10], >=, 2]] は、8、9 期合わせて 3 人、10 期 2 人以上を表す
    - driver_level_constraint: 運転レベル制約
        - 車一台あたりのメンバーの運転レベル (0-3) の総和がこの値以上であることを表す
        - 車の台数は メンバー数 / 7 を切り上げた値で計算される
    - basic_member_count_constraint: 基本メンバー数制約
        - 正の整数値
    - gender_consideration: 性別考慮
        - 入会期のリスト
        - このリストに含まれる入会期のメンバーが他の同性メンバーが含まれることを要請する
        - 例えば、[10] のとき、10 期の女性が1人、あとは男性、のような状況が排除される
    - candidate_constraints: 候補日ごとの最適化設定
    """

    chouseisan_id: str
    entry_cohort_constraint: List[Tuple[List[int], str, int]]
    driver_level_constraint: int
    basic_member_count_constraint: int
    gender_consideration: List[int]
    candidate_constraints: List[OptimizeConfigByCandidate]

    @property
    def candidate_list(self) -> List[date]:
        return [c.candidate for c in self.candidate_constraints]

    def to_dto(self) -> "OptimizeConfigDto":
        return OptimizeConfigDto(
            candidate_constraints=[str(c) for c in self.candidate_constraints],
            entry_cohort_constraint=[
                encode_entry_cohort_constraint(*e) for e in self.entry_cohort_constraint
            ],
            **self.model_dump(
                exclude={"candidate_constraints", "entry_cohort_constraint"}
            ),
        )


def decode_entry_cohort_constraint(text: str) -> Tuple[List[int], str, int]:
    pattern = re.compile(r"(\d+,)*\d+[<=>]=\d+")
    if not pattern.match(text):
        raise ValueError(f"invalid format: {text}")

    if "<=" in text:
        operator = "<="
    elif ">=" in text:
        operator = ">="
    else:
        operator = "=="

    cohorts_str, count_str = text.split(operator)

    cohorts = [int(c) for c in cohorts_str.split(",")]
    count = int(count_str)

    return cohorts, operator, count


def encode_entry_cohort_constraint(
    cohorts: List[int], operator: str, count: int
) -> str:
    cohorts_str = ",".join(map(str, cohorts))
    return "".join([cohorts_str, operator, str(count)])


class OptimizeConfigDto(VSBaseModel):
    """Firesotre に保存するための最適化設定

    - date -> datetime
    - 高階のデータ構造を文字列に変換する
    """

    chouseisan_id: str
    entry_cohort_constraint: List[str]
    driver_level_constraint: int
    basic_member_count_constraint: int
    gender_consideration: List[int]
    candidate_constraints: List[str]

    def to_model(self) -> OptimizeConfig:
        return OptimizeConfig(
            candidate_constraints=[
                to_ptimizeConfigByCandidate(c) for c in self.candidate_constraints
            ],
            entry_cohort_constraint=[
                decode_entry_cohort_constraint(e) for e in self.entry_cohort_constraint
            ],
            **self.model_dump(
                exclude={"candidate_constraints", "entry_cohort_constraint"}
            ),
        )
