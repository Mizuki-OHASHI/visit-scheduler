from typing import List

from fastapi import APIRouter, Response, status

from dao.schedule import ScheduleMasterDao
from dao.user import VisitUserDao
from lib.chouseisan import get_schedule_from_chouseisan
from schema.schedule import ScheduleMaster, SyncChouseisanResult
from src.lib.visit_user import diff_visit_users_names

router = APIRouter(tags=["schedule"])

schedule_master_dao = ScheduleMasterDao()
visit_user_dao = VisitUserDao()


@router.post(
    "/schedule/chouseisan",
    response_model=SyncChouseisanResult,
    description="調整さんのスケジュールと同期する",
)
def sync_chouseisan_schedule(chouseisan_id: str):
    result = get_schedule_from_chouseisan(chouseisan_id)
    if result is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "chouseisan data with the given ID not found."},
        )

    schedule_master, visit_users_schedule = result

    schedule_master_dao.create(schedule_master)

    visit_users = visit_user_dao.get_all()
    diff_visit_users = diff_visit_users_names(visit_users_schedule.keys(), visit_users)

    result = SyncChouseisanResult(
        schedule_master=schedule_master, diff_visit_users=diff_visit_users
    )
    return result


@router.get(
    "/schedule/list",
    response_model=List[ScheduleMaster],
    description="スケジュール一覧を取得する",
)
def get_schedule_list():
    return schedule_master_dao.get_all()
