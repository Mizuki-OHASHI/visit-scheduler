# Standard Library
from enum import Enum

############ App User Role ############


class AppUserRole(Enum):
    dev = "dev"
    admin = "admin"
    user = "user"

    def __str__(self) -> str:
        return self.value


############ Driver Level ############


class DriverLevel(Enum):
    unable = "unable"
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"

    def __str__(self) -> str:
        return self.value

    @property
    def int(self) -> int:
        return {
            DriverLevel.unable: 0,
            DriverLevel.beginner: 1,
            DriverLevel.intermediate: 2,
            DriverLevel.advanced: 3,
        }[self]


############ Gender ############


class Gender(Enum):
    female = "female"
    male = "male"
    other = "other"

    def __str__(self) -> str:
        return self.value


############ Schedule Status ############


class ScheduleStatus(Enum):
    preferred = "preferred"
    available = "available"
    unavailable = "unavailable"

    def __str__(self) -> str:
        return self.value


############ Optimization Status ############


class VSOptimizationStatus(Enum):
    optimal = "optimal"
    infeasible = "infeasible"
    failed = "failed"

    def __str__(self) -> str:
        return self.value
