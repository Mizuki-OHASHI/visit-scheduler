from typing import List
from fastapi import APIRouter, Response, status, Request
from google.cloud.firestore import Client

from lib.spreadsheet import get_member_from_spreadsheet
from src.lib.logger import logger
from src.lib.actor import get_actor_from_state
from src.dao.user import AppUserDao, VisitUserDao
from src.lib.visit_user import visit_users_diff
from src.schema.user import AppUser, AppUserBase, VisitUser
from datetime import datetime


router = APIRouter(tags=["visit_user"])
visit_user_dao = VisitUserDao()


@router.post(
    "/member/spreadsheet",
    description="メンバー情報をスプレッドシートから取得",
    response_model=List[VisitUser],
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

    return visit_users
