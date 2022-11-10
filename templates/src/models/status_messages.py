import enum


class DoneMessages(enum, str):
    SOLVER_DONE = "pipeline.done.solver_done"
    DATABAG_DONE = "pipeline.done.databag_done"


class RunningMessages(enum, str):
    UPLOADING_DATA = "pipeline.running.uploading_data"
    INSPECTING_DATATYPES = "pipeline.running.inspecting_datatypes"
    CREATING_DATABAG = "pipeline.running.creating_databag"
    SOLUTION_CREATED = "pipeline.running.Solution_created"
    SOLVER_RUNNING = "pipeline.running.solver_running"


class ErrorMessages(enum, str):
    DEFAULT = "pipeline.error.default"
    DATABAG_NOT_ACCESSIBLE = "pipeline.error.databag_not_accessible"
    DATABAG_COULD_NOT_BE_CREATED = "pipeline.error.databag_could_not_be_created"
    DATASET_NOT_FOUND = "pipeline.error.dataset_not_found"
    DATASET_FORMAT_UNKNOWN = "pipeline.error.dataset_format_unknown"
    DATASET_COULD_NOT_BE_READ = "pipeline.error.dataset_could_not_be_read"
    METRICS_NOT_RETRIEVABLE = "pipeline.error.metrics_not_retrievable"
    TRAINING_FAILED = "pipeline.error.training_failed"
    FILE_TYPE_UNKNOWN = "pipeline.error.file_type_unknown"
