from typing import List, Optional

from click import group
from lib.datetime import date_to_datetime
from src.schema.config import VSBaseModel
from datetime import date, datetime


# NOTE: firesotore
class Task(VSBaseModel):
    id: str
    name: str


class Candidate(VSBaseModel):
    date: date
    group: Optional[str]


class ScheduleGroup(VSBaseModel):
    id: str
    name: str
    tasks: list[Task]
    description: str


class ScheduleMaster(VSBaseModel):
    chouseisan_id: str
    title: str
    candidates: list[Candidate]
    groups: list[ScheduleGroup]

    def to_dto(self) -> "ScheduleMasterDto":
        candidates = [date_to_datetime(candidate.date) for candidate in self.candidates]

        group2candidates = {}
        for candidate in self.candidates:
            if candidate.group is None:
                continue

            group2candidates[candidate.group] = group2candidates.get(
                candidate.group, []
            ) + [date_to_datetime(candidate.date)]

        group2tasks = {}
        group2group_name = {}
        group2description = {}
        for group in self.groups:
            group2tasks[group.id] = [task.id for task in group.tasks]
            group2group_name[group.id] = group.name
            group2description[group.id] = group.description

        return ScheduleMasterDto(
            chouseisan_id=self.chouseisan_id,
            title=self.title,
            candidates=candidates,
            group2candidates=group2candidates,
            group2tasks=group2tasks,
            group2group_name=group2group_name,
            group2description=group2description,
        )


# NOTE: firesotore
#   firestore に保存できる構造
#   - 許されるのは一階層まで
#   - date は datetime に変換して保存する
class ScheduleMasterDto(VSBaseModel):
    chouseisan_id: str
    title: str
    candidates: list[datetime]
    group2candidates: dict[str, list[datetime]]
    group2tasks: dict[str, list[str]]
    group2group_name: dict[str, str]
    group2description: dict[str, str]

    def to_model(self, tasks: List[Task]) -> ScheduleMaster:
        group_ids = self.group2candidates.keys()
        groups = []
        for group_id in group_ids:
            group = ScheduleGroup(
                id=group_id,
                name=self.group2group_name[group_id],
                tasks=[task for task in tasks if task.id in self.group2tasks[group_id]],
                description=self.group2description[group_id],
            )
            groups.append(group)

        candidates = []
        for candidate in self.candidates:
            group = None
            for group_id, dates in self.group2candidates.items():
                if candidate in dates:
                    group = group_id
                    break
            candidate_date = candidate.date()
            candidates.append(Candidate(date=candidate_date, group=group))

        return ScheduleMaster(
            chouseisan_id=self.chouseisan_id,
            title=self.title,
            candidates=candidates,
            groups=groups,
        )
