from random import randint
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status, Request
from google.cloud.firestore import Client

from src.dao.user import AppUserDao
from src.schema.user import AppUser, AppUserBase
from src.dao.dao import get_db
from datetime import datetime


router = APIRouter(tags=["user"])


@router.post(
    "/app_user", status_code=status.HTTP_204_NO_CONTENT, description="新規ユーザー登録"
)
def create_app_user(
    request: Request, app_user: AppUserBase, db: Client = Depends(get_db)
):
    try:
        uid = request.state.uid
    except AttributeError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    app_user_dao = AppUserDao(db)
    app_user_with_id = AppUser(
        id=uid, created_at=datetime.now(), **app_user.model_dump()
    )
    app_user_dao.create(app_user_with_id)

    return Response(status_code=status.HTTP_204_NO_CONTENT)
