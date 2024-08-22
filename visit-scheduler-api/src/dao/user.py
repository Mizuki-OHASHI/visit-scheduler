from typing import Optional, List
from google.cloud.firestore import Client

from lib.cache import LRUCache
from dao.dao import Dao
from schema.user import AppUser, VisitUser, VisitUserDto
from lib.logger import logger

app_user_cache = LRUCache(10, lambda v: isinstance(v, AppUser))


class AppUserDao(Dao):
    def __init__(self, db: Client = None):
        col_name = "app_user"
        super().__init__(col_name, db=db)

    def create(self, app_user: AppUser) -> None:
        doc_ref = self.col_ref.document(app_user.id)
        doc_ref.set(app_user.model_dump(), merge=True)
        app_user_cache.set(app_user.id, app_user)
        return

    def update(self, app_user: AppUser, feilds: List[str]) -> List[str]:
        """許可されたフィールドを更新する

        params:
            `fields`: 更新するフィールド (更新可能なフィールド: `display_name`, `role`)
        return:
            更新したフィールドのリスト
        """

        allowed_fields = set(["display_name", "role"])
        feilds_to_update = [field for field in feilds if field in allowed_fields]
        if len(feilds) == 0:
            return []

        doc_ref = self.col_ref.document(app_user.id)
        obj_to_update = {field: getattr(app_user, field) for field in feilds_to_update}
        doc_ref.update(obj_to_update)
        app_user_cache.set(app_user.id, app_user)
        return feilds_to_update

    def get_by_id(self, app_user_id: str) -> Optional[AppUser]:
        cached_user = app_user_cache.get(app_user_id)
        if cached_user:
            return cached_user

        doc_ref = self.col_ref.document(app_user_id)
        doc = doc_ref.get()
        if doc.exists:
            user = AppUser.model_validate(doc.to_dict())
            app_user_cache.set(app_user_id, user)
            return user

        return None


visit_user_cache = LRUCache(200, lambda v: isinstance(v, VisitUser))

allowed_fields_ls = [
    "name",
    "last_visit",
    "entry_cohort",
    "gender",
    "driver_level",
    "responsible_tasks",
    "app_user_id",
]


class VisitUserDao(Dao):
    def __init__(self, db=None):
        col_name = "visit_user"
        super().__init__(col_name, db=db)

    def create(self, visit_user: VisitUser) -> None:
        doc_ref = self.col_ref.document(visit_user.id)
        doc_ref.set(visit_user.to_dto().model_dump(), merge=True)
        visit_user_cache.set(visit_user.id, visit_user)
        return

    def create_many(self, visit_users: List[VisitUser]) -> None:
        if len(visit_users) == 0:
            return
        for visit_user in visit_users:
            self.create(visit_user)

        logger.info("created %d visit users", len(visit_users))
        return

    def update(
        self, visit_user: VisitUser, feilds: List[str] = allowed_fields_ls
    ) -> List[str]:
        """許可されたフィールドを更新する

        params:
            `fields`: 更新するフィールド (更新可能なフィールド: `display_name`, `role`)
        return:
            更新したフィールドのリスト
        """
        logger.debug("updating visit user: %s", visit_user.id)

        allowed_fields = set(allowed_fields_ls)
        feilds_to_update = [field for field in feilds if field in allowed_fields]
        if len(feilds) == 0:
            return []

        doc_ref = self.col_ref.document(visit_user.id)
        obj_to_update = {
            field: getattr(visit_user.to_dto(), field) for field in feilds_to_update
        }
        doc_ref.update(obj_to_update)
        visit_user_cache.set(visit_user.id, visit_user)

        return feilds_to_update

    def get_by_id(self, visit_user_id: str) -> Optional[VisitUser]:
        cached_user = visit_user_cache.get(visit_user_id)
        if cached_user:
            return cached_user

        doc_ref = self.col_ref.document(visit_user_id)
        doc = doc_ref.get()
        if doc.exists:
            user = VisitUserDto.model_validate(doc.to_dict()).to_model()
            visit_user_cache.set(visit_user_id, user)
            return user

        return None

    def get_all(self) -> List[VisitUser]:
        # TODO: 公式ドキュメントと異なるので要調査
        visit_user_count = self.col_ref.count().get()[0][0].value
        if visit_user_count == visit_user_cache.size():
            logger.info("all visit users are cached (count: %d)", visit_user_count)
            return visit_user_cache.list_values()

        try:
            visit_user_ids = [doc.id for doc in self.col_ref.list_documents()]
        except Exception as e:
            logger.error("failed to fetch visit user ids: %s", e)
            return []

        visit_users = []
        cached_user_count = 0
        for visit_user_id in visit_user_ids:
            cached_user = visit_user_cache.get(visit_user_id)
            if cached_user:
                visit_users.append(cached_user)
                cached_user_count += 1
                continue
            user = self.get_by_id(visit_user_id)
            if user:
                visit_users.append(user)
                visit_user_cache.set(visit_user_id, user)

        logger.info(
            "out of %d visit users, %d are cached", visit_user_count, cached_user_count
        )
        return visit_users
