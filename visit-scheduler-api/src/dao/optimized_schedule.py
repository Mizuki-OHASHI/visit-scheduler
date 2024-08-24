from typing import Optional
from google.cloud.firestore import Client

from dao.dao import Dao
from lib.cache import LRUCache
from schema.schedule import OptimizedSchedule, OptimizedScheduleDto

optimized_schedule_cache = LRUCache(20, lambda v: isinstance(v, OptimizedSchedule))


class OptimizedScheduleDao(Dao):
    def __init__(self, db: Client = None):
        col_name = "optimized_schedule"
        super().__init__(col_name, db=db)

    def get_by_id(self, chouseisan_id: str) -> Optional[OptimizedSchedule]:
        cached_optimized_schedule = optimized_schedule_cache.get(chouseisan_id)
        if cached_optimized_schedule:
            return cached_optimized_schedule

        doc_ref = self.col_ref.document(chouseisan_id)
        doc = doc_ref.get()
        if doc.exists:
            optimized_schedule = OptimizedScheduleDto.model_validate(
                doc.to_dict()
            ).to_model()
            optimized_schedule_cache.set(chouseisan_id, optimized_schedule)
            return optimized_schedule

        return None

    def upsert(self, optimized_schedule: OptimizedSchedule) -> None:
        doc_ref = self.col_ref.document(optimized_schedule.chouseisan_id)
        doc_ref.set(optimized_schedule.to_dto().model_dump())
        optimized_schedule_cache.set(
            optimized_schedule.chouseisan_id, optimized_schedule
        )
        return
