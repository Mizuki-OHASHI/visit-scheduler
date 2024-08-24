from typing import Dict, List

from lib.logger import logger
from lib.optimizer.model import VisitOptimizer
from schema.enum import VSOptimizationStatus
from schema.schedule import OptimizationResult, ScheduleWithConfig
from schema.user import VisitUser, VisitUserSchedule
from mip import OptimizationStatus


def run_visit_schedule_optimizer(
    schedule: ScheduleWithConfig,
    visit_users: List[VisitUser],
    visit_user_schedule: Dict[str, List[VisitUserSchedule]],
) -> OptimizationResult:
    optimizer = VisitOptimizer(name="visit_schedule_optimizer")
    optimizer.preprocess(schedule, visit_users, visit_user_schedule)
    optimizer.add_constraints()
    optimizer.set_objective()
    status = optimizer.optimize()
    if status.value == OptimizationStatus.OPTIMAL.value:
        return OptimizationResult(
            chouseisan_id=schedule.schedule_master.chouseisan_id,
            optimized_schedule=optimizer.decode(),
            status=VSOptimizationStatus.optimal,
        )
    elif status.value == OptimizationStatus.INFEASIBLE.value:
        return OptimizationResult(
            chouseisan_id=schedule.schedule_master.chouseisan_id,
            optimized_schedule=None,
            status=VSOptimizationStatus.infeasible,
        )
    else:
        logger.error("optimization failed with status: %s", status.name)
        return OptimizationResult(
            chouseisan_id=schedule.schedule_master.chouseisan_id,
            optimized_schedule=None,
            status=VSOptimizationStatus.failed,
        )
