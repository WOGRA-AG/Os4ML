import enum


class ColumnDataType(str, enum.Enum):
    NUMERICAL = "numerical"
    DATE = "date"
    CATEGORY = "category"
    TEXT = "text"
    IMAGE = "image"
