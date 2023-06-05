class FileNotFoundException(Exception):
    def __init__(self, message: str) -> None:
        self.message = message


class DatasetNotFoundException(FileNotFoundException):
    def __init__(self) -> None:
        super().__init__("Dataset not found")


class DataframeNotFoundException(FileNotFoundException):
    def __init__(self) -> None:
        super().__init__("Dataframe not found")


class ModelFileNotFoundException(FileNotFoundException):
    def __init__(self) -> None:
        super().__init__("Model not found")


class PredictionTemplateNotFoundException(FileNotFoundException):
    def __init__(self) -> None:
        super().__init__("Prediction template not found")


class PredictionDataNotFoundException(FileNotFoundException):
    def __init__(self) -> None:
        super().__init__("Prediction data not found")


class PredictionResultNotFoundException(FileNotFoundException):
    def __init__(self) -> None:
        super().__init__("Prediction result not found")
