# Standard Library
from abc import ABC

# Third Party Library
from google.cloud.firestore import Client

# First Party Library
from lib.firebase import get_db_client


class Dao(ABC):
    def __init__(self, collection: str, db: Client = None):
        self.db = db if db else get_db_client()
        self.col = collection
        self.col_ref = self.db.collection(collection)

    # @abstractmethod
    # def get_by_id(self):
    #     NotImplementedError

    # @abstractmethod
    # def create(self):
    #     NotImplementedError

    # @abstractmethod
    # def update(self):
    #     NotImplementedError
