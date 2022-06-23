import enum


class ColumnUsage(str, enum.Enum):
    LABEL = "label"
    FEATURE = "feature"
