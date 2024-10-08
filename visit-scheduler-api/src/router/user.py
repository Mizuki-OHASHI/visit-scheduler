# Standard Library
from datetime import datetime

# Third Party Library
from fastapi import APIRouter, Request, Response, status

# First Party Library
from dao.user import AppUserDao
from lib.actor import get_actor_from_state
from schema.user import AppUser, AppUserBase

router = APIRouter(tags=["user"])
app_user_dao = AppUserDao()


@router.post(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
    description="新規ユーザー登録",
    response_model=None,
)
def create_app_user(request: Request, app_user: AppUserBase):
    try:
        uid = request.state.uid
    except AttributeError:
        return Response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            headers={"message": "uid is not set."},
        )

    app_user_with_id = AppUser(
        id=uid, created_at=datetime.now(), **app_user.model_dump()
    )
    app_user_dao.create(app_user_with_id)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=AppUser, description="ユーザー情報取得")
def get_app_user(request: Request):
    try:
        app_user = get_actor_from_state(request)
    except Exception as e:
        return Response(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            headers={"message": str(e)},
        )
    return app_user
