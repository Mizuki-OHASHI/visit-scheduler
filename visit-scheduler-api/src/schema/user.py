from datetime import date, datetime
from enum import Enum
from typing import List, Optional

from src.schema.enum import AppUserRole, DriverLevel, Gender, ScheduleStatus
from src.schema.config import VSBaseModel

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


class VisitUserSchedule(VSBaseModel):
    schdule_id: str
    status: ScheduleStatus
    remarks: Optional[str]


class VisitUserWithSchedule(VisitUser):
    schedules: List[VisitUserSchedule]
