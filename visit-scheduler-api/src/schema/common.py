# Standard Library
from typing import List

# First Party Library
from schema.config import VSBaseModel


class Common(VSBaseModel):
    """共通情報"""

    task_list: List[str]
