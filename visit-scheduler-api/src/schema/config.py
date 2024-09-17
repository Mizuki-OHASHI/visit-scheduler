# Third Party Library
from pydantic import BaseModel, ConfigDict


class VSBaseModel(BaseModel):
    model_config = ConfigDict(from_attributes=True, use_enum_values=True)
