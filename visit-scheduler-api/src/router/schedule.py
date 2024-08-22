from typing import List

from fastapi import APIRouter, Response, status

from dao.schedule import ScheduleMasterDao
from dao.user import VisitUserDao
from lib.chouseisan import get_schedule_from_chouseisan
from schema.schedule import ScheduleMaster, ScheduleWithConfig, SyncChouseisanResult
from lib.visit_user import diff_visit_users_names
from schema.optimize_config import OptimizeConfig
from dao.optimize_config import OptimizeConfigDao
from lib.logger import logger

router = APIRouter(tags=["schedule"])

schedule_master_dao = ScheduleMasterDao()
visit_user_dao = VisitUserDao()
optimize_config_dao = OptimizeConfigDao()


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


@router.post(
    "/schedule/config/{chouseisan_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_model=None,
    description="スケジュール設定を更新する",
)
def upsert_schedule_config(
    chouseisan_id: str,
    schedule_optimize_config: OptimizeConfig,
):
    if chouseisan_id != schedule_optimize_config.chouseisan_id:
        return Response(
            status_code=status.HTTP_400_BAD_REQUEST,
            headers={"message": "chouseisan_id is inconsistent."},
        )

    schedule_master = schedule_master_dao.get_by_id(
        schedule_optimize_config.chouseisan_id
    )
    if schedule_master is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "schedule data with the given ID not found."},
        )

    # 候補日の一貫性を確認する
    master_candidates = set(schedule_master.candidates)
    config_candidates = set(schedule_optimize_config.candidate_list)
    if master_candidates != config_candidates:
        logger.error(
            "candidate dates are inconsistent. master: %s, config: %s",
            master_candidates,
            config_candidates,
        )

        return Response(
            status_code=status.HTTP_400_BAD_REQUEST,
            headers={"message": "candidate dates are inconsistent."},
        )

    optimize_config_dao.upsert(schedule_optimize_config)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/schedule/list",
    response_model=List[ScheduleMaster],
    description="スケジュール一覧を取得する",
)
def get_schedule_list():
    return schedule_master_dao.get_all()


@router.get(
    "/schedule/{chouseisan_id}",
    response_model=ScheduleWithConfig,
    description="スケジュールと設定を取得する",
)
def get_schedule(chouseisan_id: str):
    schedule_master = schedule_master_dao.get_by_id(chouseisan_id)
    if schedule_master is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "schedule data with the given ID not found."},
        )

    optimize_config = optimize_config_dao.get_by_id(chouseisan_id)

    return ScheduleWithConfig(
        schedule_master=schedule_master, optimize_config=optimize_config
    )
