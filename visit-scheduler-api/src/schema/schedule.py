from ast import Dict
from datetime import date, datetime
from typing import List, Optional, Dict

from lib.datetime import date_to_datetime
from schema.config import VSBaseModel
from schema.enum import VSOptimizationStatus
from src.schema.optimize_config import OptimizeConfig


class ScheduleMaster(VSBaseModel):
    chouseisan_id: str
    title: str
    candidates: list[date]

    def to_dto(self) -> "ScheduleMasterDto":
        candidates = [date_to_datetime(candidate) for candidate in self.candidates]

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


class PickedDateWithMember(VSBaseModel):
    date: date
    member: List[str]  # visit_user_id


class OptimizedSchedule(VSBaseModel):
    chouseisan_id: str
    schedule: List[PickedDateWithMember]

    def to_dto(self) -> "OptimizedScheduleDto":
        schedule = {}
        for date_with_member in self.schedule:
            str_date = date_with_member.date.strftime("%Y-%m-%d")
            schedule[str_date] = date_with_member.member

        return OptimizedScheduleDto(chouseisan_id=self.chouseisan_id, schedule=schedule)


class OptimizedScheduleDto(VSBaseModel):
    chouseisan_id: str
    schedule: Dict[str, List[str]]

    def to_model(self) -> OptimizedSchedule:
        schedule = []
        for str_date in self.schedule:
            date = datetime.strptime(str_date, "%Y-%m-%d").date()
            schedule.append(
                PickedDateWithMember(date=date, member=self.schedule[str_date])
            )

        return OptimizedSchedule(chouseisan_id=self.chouseisan_id, schedule=schedule)


class ScheduleWithConfig(VSBaseModel):
    schedule_master: ScheduleMaster
    optimize_config: Optional[OptimizeConfig]
    optimized_schedule: Optional[OptimizedSchedule]


class OptimizationResult(VSBaseModel):
    chouseisan_id: str
    status: VSOptimizationStatus
    optimized_schedule: Optional[OptimizedSchedule]
