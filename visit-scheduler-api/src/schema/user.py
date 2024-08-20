from datetime import date, datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from src.schema.enum import AppUserRole, DriverLevel, Gender, ScheduleStatus


############ App User ############


class AppUserBase(BaseModel):
    user_name: str
    display_name: str
    email: str
    role: AppUserRole


class AppUser(AppUserBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


############ Visit User ############


class VisitUserProfile(BaseModel):
    name: str
    last_visit: date
    entry_cohort: int
    gender: Gender
    driver_level: DriverLevel
    responsible_tasks: List[str]


class VisitUserSchedule(BaseModel):
    schdule_id: str
    status: ScheduleStatus
    remarks: Optional[str]


class VisitUserBase(BaseModel):
    profile: VisitUserProfile
    schedules: List[VisitUserSchedule]
    app_user_id: Optional[str]


class VisitUser(VisitUserBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
