# Third Party Library
from fastapi import APIRouter, Request, Response, logger, status

# First Party Library
from dao.common import CommonDao
from dao.optimize_config import OptimizeConfigDao
from dao.user import VisitUserDao
from lib.actor import get_actor_from_state
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
def clear_cache():
    NotImplementedError("Not implemented yet")
