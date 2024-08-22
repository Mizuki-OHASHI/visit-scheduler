from collections import OrderedDict
from typing import Any, Callable, Optional
from src.lib.logger import logger


class LRUCache:
    """Least Recently Used Cache

    - 参照・更新があった場合に、そのキーを最新の位置に移動する
    """

    def __init__(
        self, capacity: int, validation: Optional[Callable[[Any], bool]] = None
    ):
        self.capacity = capacity
        self.cache = OrderedDict()
        self.validation = validation

    def get(self, key: str):
        if key not in self.cache:
            return None
        self.cache.move_to_end(key)
        return self.cache[key]

    def set(self, key: str, value):
        if self.validation and not self.validation(value):
            logger.error("invalid value: %s", value)
            return
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)

    def size(self):
        return len(self.cache)

    def list_values(self):
        return list(self.cache.values())
