from typing import Optional
from google.cloud.firestore import Client

from dao.dao import Dao
from lib.cache import LRUCache
from schema.schedule import ScheduleMaster, ScheduleMasterDto

schedule_master_cache = LRUCache(10, lambda v: isinstance(v, ScheduleMaster))


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
            schedule_master = ScheduleMasterDto.model_validate(doc.to_dict()).to_model()
            schedule_master_cache.set(chouseisan_id, schedule_master)
            return schedule_master

        return None

    def update(self, schedule_master: ScheduleMaster) -> None:
        NotImplementedError("not implemented yet")
