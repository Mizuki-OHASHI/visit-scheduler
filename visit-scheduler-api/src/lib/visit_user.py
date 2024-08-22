from typing import List, Tuple

from schema.user import VisitUser


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
