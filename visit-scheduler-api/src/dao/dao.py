from abc import ABC, abstractmethod
from google.cloud.firestore import Client
from src.lib.firebase import get_db_client


class Dao(ABC):
    def __init__(self, db: Client, collection: str):
        self.db = db
        self.col = collection
        self.col_ref = self.db.collection(collection)

    @abstractmethod
    def get_by_id(self):
        NotImplementedError

    @abstractmethod
    def create(self):
        NotImplementedError

    @abstractmethod
    def update(self):
        NotImplementedError


def get_db() -> Client:
    db = get_db_client()
    return db
