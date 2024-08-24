from typing import Optional

from dao.dao import Dao
from lib.cache import LRUCache
from lib.logger import logger
from schema.optimize_config import OptimizeConfig, OptimizeConfigDto

optimize_config_cache = LRUCache(20, lambda v: isinstance(v, OptimizeConfig))


class OptimizeConfigDao(Dao):
    def __init__(self, db=None):
        col_name = "optimize_config"
        super().__init__(col_name, db)

    def get_by_id(self, chouseisan_id) -> Optional[OptimizeConfig]:
        cached_optimize_config = optimize_config_cache.get(chouseisan_id)
        if cached_optimize_config:
            return cached_optimize_config

        doc_ref = self.col_ref.document(chouseisan_id)
        doc = doc_ref.get()
        if doc.exists:
            optimize_config = OptimizeConfigDto.model_validate(doc.to_dict()).to_model()
            optimize_config_cache.set(chouseisan_id, optimize_config)
            return optimize_config

        return None

    def get_all(self) -> list[OptimizeConfig]:
        optimize_config_count = self.col_ref.count().get()[0][0].value
        if optimize_config_count == optimize_config_cache.size():
            logger.info(
                "all optimize config data is cached (count: %d)", optimize_config_count
            )
            return optimize_config_cache.list_values()

        try:
            optimize_config_ids = [doc.id for doc in self.col_ref.list_documents()]
        except Exception as e:
            logger.error("failed to get all optimize config data: %s", e)
            return []

        optimize_configs = []
        cached_count = 0
        for optimize_config_id in optimize_config_ids:
            optimize_config = optimize_config_cache.get(optimize_config_id)
            if optimize_config:
                optimize_configs.append(optimize_config)
                cached_count += 1
                continue
            config = self.get_by_id(optimize_config_id)
            if config:
                optimize_configs.append(config)
                optimize_config_cache.set(optimize_config_id, config)

        return optimize_configs

    def upsert(self, optimize_config: OptimizeConfig):
        doc_ref = self.col_ref.document(optimize_config.chouseisan_id)
        doc_ref.set(optimize_config.to_dto().model_dump(), merge=True)
        optimize_config_cache.set(optimize_config.chouseisan_id, optimize_config)
        return
