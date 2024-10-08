# Standard Library
from typing import List

# Third Party Library
from fastapi import APIRouter, Response, status

# First Party Library
from dao.optimize_config import OptimizeConfigDao
from dao.optimized_schedule import OptimizedScheduleDao
from dao.schedule import ScheduleMasterDao
from dao.user import VisitUserDao
from lib.chouseisan import get_schedule_from_chouseisan
from lib.logger import logger
from lib.optimizer.main import run_visit_schedule_optimizer
from lib.visit_user import diff_visit_users_names, get_visit_user_schedule
from schema.optimize_config import OptimizeConfig
from schema.schedule import (
    OptimizationResult,
    OptimizedSchedule,
    ScheduleMaster,
    ScheduleWithConfig,
    SyncChouseisanResult,
)
from schema.user import VisitUserWithSchedule

router = APIRouter(tags=["schedule"])

schedule_master_dao = ScheduleMasterDao()
visit_user_dao = VisitUserDao()
optimize_config_dao = OptimizeConfigDao()
optimized_schedule_dao = OptimizedScheduleDao()


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

    existing_schedule_master = schedule_master_dao.get_by_id(chouseisan_id)
    if existing_schedule_master is not None:
        schedule_master.merge_with = existing_schedule_master.merge_with

    schedule_master_dao.upsert(schedule_master)

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
    description="スケジュールと設定, 調整済みの予定を取得する",
)
def get_schedule(chouseisan_id: str):
    schedule_master = schedule_master_dao.get_by_id(chouseisan_id)
    if schedule_master is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "schedule data with the given ID not found."},
        )

    optimize_config = optimize_config_dao.get_by_id(chouseisan_id)

    optimized_schedule = optimized_schedule_dao.get_by_id(chouseisan_id)

    return ScheduleWithConfig(
        schedule_master=schedule_master,
        optimize_config=optimize_config,
        optimized_schedule=optimized_schedule,
    )


@router.post(
    "/schedule/optimize/{chouseisan_id}",
    response_model=OptimizationResult,
    description="スケジュールを最適化する",
)
def optimize_schedule(chouseisan_id: str):
    schedule_master = schedule_master_dao.get_by_id(chouseisan_id)
    if schedule_master is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "schedule data with the given ID not found."},
        )

    optimize_config = optimize_config_dao.get_by_id(chouseisan_id)
    if optimize_config is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "optimize config with the given ID not found."},
        )

    visit_users = visit_user_dao.get_all()

    visit_user_schedule = get_visit_user_schedule(schedule_master)
    if visit_user_schedule is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "visit user schedule with the given ID not found."},
        )

    schedule_with_config = ScheduleWithConfig(
        schedule_master=schedule_master,
        optimize_config=optimize_config,
        optimized_schedule=None,
    )

    result = run_visit_schedule_optimizer(
        schedule_with_config, visit_users, visit_user_schedule
    )

    if result.optimized_schedule is not None:
        optimized_schedule_dao.upsert(result.optimized_schedule)

    return result


@router.put(
    "/schedule/manual/{chouseisan_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_model=None,
    description="手動で訪問メンバーを更新する",
)
def update_manual_schedule(chouseisan_id: str, manual_schedule: OptimizedSchedule):
    if chouseisan_id != manual_schedule.chouseisan_id:
        return Response(
            status_code=status.HTTP_400_BAD_REQUEST,
            headers={"message": "chouseisan_id is inconsistent."},
        )

    optimized_schedule_dao.upsert(manual_schedule)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/schedule/member/{chouseisan_id}",
    response_model=List[VisitUserWithSchedule],
    description="メンバーの日程情報取得",
)
def get_member_schedule(chouseisan_id: str):
    schedule_master = schedule_master_dao.get_by_id(chouseisan_id)
    if schedule_master is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "schedule data with the given ID not found."},
        )

    visit_user_schedule = get_visit_user_schedule(schedule_master)
    if visit_user_schedule is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={
                "message": "visit user schedule data with the given ID not found."
            },
        )

    visit_users = visit_user_dao.get_all()

    visit_users_with_schedule = [
        VisitUserWithSchedule(
            schedules=visit_user_schedule.get(user.name, []), **user.model_dump()
        )
        for user in visit_users
    ]

    return visit_users_with_schedule


@router.post(
    "/schedule/merge/{chouseisan_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_model=None,
)
def merge_schedule(chouseisan_id: str, merge_with: str):
    schedule_master = schedule_master_dao.get_by_id(chouseisan_id)
    if schedule_master is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "base schedule data with the given ID not found."},
        )
    if merge_with in schedule_master.merge_with:
        return Response(
            status_code=status.HTTP_400_BAD_REQUEST,
            headers={"message": "schedule data is already merged."},
        )

    schedule_master_with = schedule_master_dao.get_by_id(merge_with)
    if schedule_master_with is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "merge schedule data with the given ID not found."},
        )

    schedule_master.merge_with.append(merge_with)
    schedule_master_dao.upsert(schedule_master)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete(
    "/schedule/merge/{chouseisan_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_model=None,
)
def unmerge_schedule(chouseisan_id: str, merge_with: str):
    schedule_master = schedule_master_dao.get_by_id(chouseisan_id)
    if schedule_master is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "base schedule data with the given ID not found."},
        )
    if merge_with not in schedule_master.merge_with:
        return Response(
            status_code=status.HTTP_400_BAD_REQUEST,
            headers={"message": "schedule data is not merged."},
        )

    schedule_master.merge_with.remove(merge_with)
    schedule_master_dao.upsert(schedule_master)

    return Response(status_code=status.HTTP_204_NO_CONTENT)
