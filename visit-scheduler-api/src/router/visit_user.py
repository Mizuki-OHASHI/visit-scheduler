# Standard Library
from typing import List

# Third Party Library
from fastapi import APIRouter, Response, status

# First Party Library
from dao.common import CommonDao
from dao.user import VisitUserDao
from lib.logger import logger
from lib.spreadsheet import get_member_from_spreadsheet
from lib.task import diff_task_list
from lib.visit_user import visit_users_diff
from schema.user import SyncVisitUserResult, VisitUser

router = APIRouter(tags=["visit_user"])
visit_user_dao = VisitUserDao()
common_dao = CommonDao()


@router.post(
    "/member/spreadsheet",
    description="メンバー情報をスプレッドシートから取得",
    response_model=SyncVisitUserResult,
)
def sync_member_from_spreadsheet(
    spreadsheet_id: str,
):
    visit_users = get_member_from_spreadsheet(spreadsheet_id)

    if visit_users is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "spreadsheet data with the given ID not found."},
        )

    current_visit_users = visit_user_dao.get_all()
    added, updated, unchanged = visit_users_diff(current_visit_users, visit_users)

    visit_user_dao.create_many(added)
    for user in updated:
        visit_user_dao.update(user)

    logger.info(
        "sync_member_from_spreadsheet: %d added, %d updated, %d unchanged",
        len(added),
        len(updated),
        len(unchanged),
    )

    task_list = common_dao.get_common().task_list
    new_task_list = diff_task_list(task_list, added + updated)
    if len(new_task_list) > 0:
        task_list.extend(new_task_list)
        common_dao.upsert_common(task_list=task_list)

    result = SyncVisitUserResult(
        added=len(added),
        updated=len(updated),
    )

    return result


@router.get(
    "/member",
    response_model=List[VisitUser],
    description="メンバー情報取得",
)
def get_members():
    return visit_user_dao.get_all()
