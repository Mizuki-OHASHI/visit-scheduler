from typing import List

from fastapi import APIRouter, Response, status

from dao.user import VisitUserDao
from lib.logger import logger
from lib.spreadsheet import get_member_from_spreadsheet
from lib.visit_user import visit_users_diff
from schema.user import SyncVisitUserResult, VisitUser

router = APIRouter(tags=["visit_user"])
visit_user_dao = VisitUserDao()


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
