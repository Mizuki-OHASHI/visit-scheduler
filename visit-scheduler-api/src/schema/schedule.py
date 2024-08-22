from datetime import date, datetime
from typing import List, Optional

from lib.datetime import date_to_datetime
from schema.config import VSBaseModel
from src.schema.optimize_config import OptimizeConfig


class ScheduleMaster(VSBaseModel):
    chouseisan_id: str
    title: str
    candidates: list[date]

    def to_dto(self) -> "ScheduleMasterDto":
        candidates = [date_to_datetime(candidate.date) for candidate in self.candidates]

        return ScheduleMasterDto(
            chouseisan_id=self.chouseisan_id,
            title=self.title,
            candidates=candidates,
        )


# NOTE: firesotore
#   firestore に保存できる構造
#   - date は datetime に変換して保存する
#   - タスク一覧は別で更新する必要がある
class ScheduleMasterDto(VSBaseModel):
    chouseisan_id: str
    title: str
    candidates: list[datetime]

    def to_model(self) -> ScheduleMaster:
        candidates = [candidate.date() for candidate in self.candidates]

        return ScheduleMaster(
            chouseisan_id=self.chouseisan_id,
            title=self.title,
            candidates=candidates,
        )


class SyncChouseisanResult(VSBaseModel):
    schedule_master: ScheduleMaster
    diff_visit_users: List[str]


class ScheduleWithConfig(VSBaseModel):
    schedule_master: ScheduleMaster
    optimize_config: Optional[OptimizeConfig]
