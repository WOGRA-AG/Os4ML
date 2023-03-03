import enum


class StatusMessage(str, enum.Enum):
    # done
    SOLVER_DONE = "message.pipeline.done.solver_done"
    DATABAG_DONE = "message.pipeline.done.databag_done"

    # running
    LOADING_DATA = "message.pipeline.running.loading_data"
    INSPECTING_DATATYPES = "message.pipeline.running.inspecting_datatypes"
    SOLUTION_CREATED = "message.pipeline.running.Solution_created"
    SOLVER_RUNNING = "message.pipeline.running.solver_running"

    # error
    DEFAULT = "message.pipeline.error.default"
    DATABAG_NOT_ACCESSIBLE = "message.pipeline.error.databag_not_accessible"
    DATABAG_COULD_NOT_BE_CREATED = (
        "message.pipeline.error.databag_could_not_be_created"
    )
    DATASET_NOT_FOUND = "message.pipeline.error.dataset_not_found"
    DATASET_FORMAT_UNKNOWN = "message.pipeline.error.dataset_format_unknown"
    DATASET_COULD_NOT_BE_READ = (
        "message.pipeline.error.dataset_could_not_be_read"
    )
    DATASET_COULD_NOT_BE_LOADED = (
        "message.pipeline.error.dataset_could_not_be_loaded"
    )
    METRICS_NOT_RETRIEVABLE = "message.pipeline.error.metrics_not_retrievable"
    TRAINING_FAILED = "message.pipeline.error.training_failed"
    FILE_TYPE_UNKNOWN = "message.pipeline.error.file_type_unknown"
    RESOURCE_NOT_FOUND = "message.pipeline.error.resource_not_found"
    PREDICTION_TEMPLATE_COULD_NOT_BE_CREATED = (
        "message.pipeline.error.prediction_template_could_not_be_created"
    )
