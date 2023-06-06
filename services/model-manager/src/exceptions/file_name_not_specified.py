class FileNameNotSpecifiedException(Exception):
    def __init__(self, message: str) -> None:
        self.message = message


class DatasetFileNameNotSpecifiedException(FileNameNotSpecifiedException):
    def __init__(self) -> None:
        super().__init__("Dataset file name not specified")


class PredictionTemplateFileNameNotSpecifiedException(
    FileNameNotSpecifiedException
):
    def __init__(self) -> None:
        super().__init__("Prediction template file name not specified")


class PredictionDataFileNameNotSpecifiedException(
    FileNameNotSpecifiedException
):
    def __init__(self) -> None:
        super().__init__("Prediction data file name not specified")
