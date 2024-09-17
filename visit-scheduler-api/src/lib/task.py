# Standard Library
from typing import List

# First Party Library
from schema.user import VisitUser


def diff_task_list(
    current_task_list: List[str], visit_users: List[VisitUser]
) -> List[str]:
    """DBのタスクリストとスプレッドシートのタスクリストの差分を取得する

    Returns: 新規追加されたタスク
    """

    new_task_set = set()
    for user in visit_users:
        new_task_set.update(user.responsible_tasks)

    current_tast_set = set(current_task_list)

    return list(new_task_set - current_tast_set)
