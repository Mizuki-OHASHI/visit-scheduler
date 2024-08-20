from typing import Optional, List, Dict, Any
from src.dao.dao import Dao
from src.schema.user import AppUser


class AppUserDao(Dao):
    def __init__(self, db):
        col_name = "app_user"
        super().__init__(db, col_name)

    def create(self, app_user: AppUser) -> None:
        doc_ref = self.col_ref.document(app_user.id)
        doc_ref.set(app_user.model_dump(), merge=True)
        return

    def update(self, app_user: AppUser, feilds: List[str]) -> List[str]:
        """
        params:
            `fields`: list of fields to update (allowed fields: `display_name`, `role`)
        returns the fields that were updated
        """
        allowed_fields = set(["display_name", "role"])
        feilds_to_update = [field for field in feilds if field in allowed_fields]
        # if no fields to update
        if len(feilds) == 0:
            return []

        doc_ref = self.col_ref.document(app_user.id)
        obj_to_update = {field: getattr(app_user, field) for field in feilds_to_update}
        doc_ref.update(obj_to_update)
        return feilds_to_update

    def get_by_id(self, app_user_id: str) -> Optional[AppUser]:
        doc_ref = self.collection.document(app_user_id)
        doc = doc_ref.get()
        if doc.exists:
            return AppUser.model_validate(doc.to_dict())
        return None
