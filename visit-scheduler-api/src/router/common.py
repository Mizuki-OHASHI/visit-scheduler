# Third Party Library
from fastapi import APIRouter, Request, Response, logger, status

# First Party Library
from dao.common import CommonDao
from dao.optimize_config import OptimizeConfigDao, clear_optimize_config_cache
from dao.optimized_schedule import clear_optimized_schedule_cache
from dao.schedule import clear_schedule_master_cache
from dao.user import VisitUserDao, clear_app_user_cache, clear_visit_user_cache
from lib.actor import get_actor_from_state
from lib.chouseisan import clear_visit_user_schedule_cache
from lib.logger import logger
from schema.common import Common
from schema.enum import AppUserRole

router = APIRouter(tags=["common"])

common_dao = CommonDao()
visit_user_dao = VisitUserDao()
optimize_config_dao = OptimizeConfigDao()


@router.get("/common", response_model=Common, description="共通情報を取得する")
def get_common():
    return common_dao.get_common()


@router.post(
    "/common/refresh",
    status_code=status.HTTP_204_NO_CONTENT,
    description="共通情報を更新する (dev 権限が必要)",
)
def refresh_common(request: Request):
    actor = get_actor_from_state(request)
    if actor.role != AppUserRole.dev.value:
        return Response(
            status_code=status.HTTP_403_FORBIDDEN,
            headers={"message": "permission denied"},
        )

    visit_users = visit_user_dao.get_all()
    task_set = set()
    for user in visit_users:
        task_set.update(user.responsible_tasks)

    optimize_config = optimize_config_dao.get_all()
    for config in optimize_config:
        for candidate_config in config.candidate_constraints:
            task_set.update([task for task, _ in candidate_config.tasks])

    common_dao.upsert_common(task_list=list(task_set))
    logger.info("common data is refreshed (task_list: %d)", len(task_set))

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/cache/clear",
    status_code=status.HTTP_204_NO_CONTENT,
    description="キャッシュをクリアする (dev 権限が必要)",
)
def clear_cache(request: Request, visit_user: int = 0):
    actor = get_actor_from_state(request)
    if actor.role != AppUserRole.dev.value:
        return Response(
            status_code=status.HTTP_403_FORBIDDEN,
            headers={"message": "permission denied"},
        )

    clear_schedule_master_cache()
    clear_optimize_config_cache()
    clear_optimized_schedule_cache()
    clear_app_user_cache()
    if visit_user == 1:
        clear_visit_user_cache()
    clear_visit_user_schedule_cache()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
