from typing import List
from mip import Model
import numpy as np

from schema.schedule import ScheduleWithConfig
from schema.user import VisitUser, VisitUserSchedule


class VisitOptimizer(Model):
    def preprocess(
        self,
        schedule: ScheduleWithConfig,
        visit_users: List[VisitUser],
        visit_user_schedule: List[VisitUserSchedule],
    ):
        self.schedule = schedule
        self.visit_users = visit_users
        self.visit_user_schedule = visit_user_schedule

        # 変数の追加
        self.X = np.array([self.add_var(name=f"X_{i}", var_type="B") for i in range()])
