from router.common import router as common_router
from router.schedule import router as schedule_router
from router.user import router as user_router
from router.visit_user import router as visit_user_router

router_list = [user_router, schedule_router, visit_user_router, common_router]
