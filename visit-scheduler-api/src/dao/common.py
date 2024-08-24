from google.cloud.firestore import Client

from dao.dao import Dao
from schema.common import Common


class CommonDao(Dao):
    def __init__(self, db: Client = None):
        col_name = "common"
        super().__init__(col_name, db)
        self.doc_id = "common"
        self.doc_ref = self.col_ref.document(self.doc_id)

    def get_common(self):
        doc = self.doc_ref.get()
        if not doc.exists:
            return Common(task_list=[])
        common = Common.model_validate(doc.to_dict())
        return common

    def upsert_common(self, task_list: list[str] = None):
        base_common = self.get_common()
        if task_list is not None:
            base_common.task_list = task_list
            self.doc_ref.set(base_common.model_dump())
        return
