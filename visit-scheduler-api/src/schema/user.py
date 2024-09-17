# Standard Library
from datetime import date, datetime
from typing import List, Optional

# Third Party Library
from pandas import to_datetime

# First Party Library
from schema.config import VSBaseModel
from schema.enum import AppUserRole, DriverLevel, Gender, ScheduleStatus

############ App User ############


class AppUserBase(VSBaseModel):
    user_name: str
    display_name: str
    email: str
    role: AppUserRole


class AppUser(AppUserBase):
    id: str
    created_at: datetime


############ Visit User ############


class VisitUserBase(VSBaseModel):
    name: str
    last_visit: date
    entry_cohort: int
    gender: Gender
    driver_level: DriverLevel
    responsible_tasks: List[str]
    app_user_id: Optional[str]


class VisitUser(VisitUserBase):
    id: str
    created_at: datetime

    def __eq__(self, other) -> bool:
        if not isinstance(other, VisitUser):
            return False
        return (
            self.name == other.name
            and self.last_visit == other.last_visit
            and self.entry_cohort == other.entry_cohort
            and self.gender == other.gender
            and self.driver_level == other.driver_level
            and self.responsible_tasks == other.responsible_tasks
        )

    def to_dto(self) -> "VisitUserDto":
        return VisitUserDto(
            last_visit=to_datetime(self.last_visit),
            **self.model_dump(exclude=["last_visit"])
        )


class VisitUserDto(VisitUser):
    last_visit: datetime

    def to_model(self) -> VisitUser:
        return VisitUser(
            last_visit=self.last_visit.date(), **self.model_dump(exclude=["last_visit"])
        )


class VisitUserSchedule(VSBaseModel):
    candidate: date
    status: ScheduleStatus


class VisitUserWithSchedule(VisitUser):
    schedules: List[VisitUserSchedule]


class SyncVisitUserResult(VSBaseModel):
    added: int
    updated: int
