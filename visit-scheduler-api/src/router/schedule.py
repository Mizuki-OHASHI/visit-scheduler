from random import randint
from typing import List

from fastapi import APIRouter, Response, status, Request
from google.cloud.firestore import Client
import requests

from dao.schedule import ScheduleMasterDao
from schema.schedule import ScheduleMaster
from src.lib.chouseisan import get_schedule_from_chouseisan
from src.lib.actor import get_actor_from_state
from src.dao.user import AppUserDao
from src.schema.user import AppUser, AppUserBase
from datetime import datetime


router = APIRouter(tags=["schedule"])

schedule_master_dao = ScheduleMasterDao()


@router.post(
    "/schedule/chouseisan",
    response_model=ScheduleMaster,
    description="調整さんのスケジュールと同期する",
)
def sync_chouseisan_schedule(chouseisan_id: str):
    schedule_master = get_schedule_from_chouseisan(chouseisan_id)
    if schedule_master is None:
        return Response(
            status_code=status.HTTP_404_NOT_FOUND,
            headers={"message": "chouseisan data with the given ID not found."},
        )

    schedule_master_dao.create(schedule_master)
    return schedule_master
