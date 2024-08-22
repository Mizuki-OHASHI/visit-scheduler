from typing import Optional
from venv import logger

from google.cloud.firestore import Client

from dao.dao import Dao
from lib.cache import LRUCache
from schema.schedule import ScheduleMaster, ScheduleMasterDto

schedule_master_cache = LRUCache(20, lambda v: isinstance(v, ScheduleMaster))


class ScheduleMasterDao(Dao):
    def __init__(self, db: Client = None):
        col_name = "schedule_master"
        super().__init__(col_name, db=db)

    def create(self, schedule_master: ScheduleMaster) -> None:
        doc_ref = self.col_ref.document(schedule_master.chouseisan_id)
        doc_ref.set(schedule_master.to_dto().model_dump(), merge=True)
        schedule_master_cache.set(schedule_master.chouseisan_id, schedule_master)
        return

    def get_by_id(self, chouseisan_id: str) -> Optional[ScheduleMaster]:
        cached_schedule_master = schedule_master_cache.get(chouseisan_id)
        if cached_schedule_master:
            return cached_schedule_master

        doc_ref = self.col_ref.document(chouseisan_id)
        doc = doc_ref.get()
        if doc.exists:
            schedule_master = ScheduleMasterDto.model_validate(doc.to_dict()).to_model(
                tasks=[]
            )
            schedule_master_cache.set(chouseisan_id, schedule_master)
            return schedule_master

        return None

    def get_all(self) -> list[ScheduleMaster]:
        scheduke_master_count = self.col_ref.count().get()[0][0].value
        if scheduke_master_count == schedule_master_cache.size():
            logger.info(
                "all schedule master data is cached (count: %d)", scheduke_master_count
            )
            return schedule_master_cache.list_values()

        try:
            schedule_master_ids = [doc.id for doc in self.col_ref.list_documents()]
        except Exception as e:
            logger.error("failed to get all schedule master data: %s", e)
            return []

        schedule_masters = []
        cached_count = 0
        for schedule_master_id in schedule_master_ids:
            schedule_master = schedule_master_cache.get(schedule_master_id)
            if schedule_master:
                schedule_masters.append(schedule_master)
                cached_count += 1
                continue
            master = self.get_by_id(schedule_master_id)
            if master:
                schedule_masters.append(master)
                schedule_master_cache.set(schedule_master_id, master)

        logger.info(
            "out of %d schedule master data, %d are cached",
            scheduke_master_count,
            cached_count,
        )
        return schedule_masters

    def update(self, schedule_master: ScheduleMaster) -> None:
        NotImplementedError("not implemented yet")
