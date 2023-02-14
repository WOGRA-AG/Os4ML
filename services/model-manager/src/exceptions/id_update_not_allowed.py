class IdUpdateNotAllowedException(Exception):
    def __init__(self, message: str) -> None:
        self.message = message


class SolutionIdUpdateNotAllowedException(IdUpdateNotAllowedException):
    def __init__(self) -> None:
        super().__init__("An update of the id of a solution is not allowed.")


class DatabagIdUpdateNotAllowedException(IdUpdateNotAllowedException):
    def __init__(self) -> None:
        super().__init__("An update of the id of a databag is not allowed.")


class PredictionIdUpdateNotAllowedExeption(IdUpdateNotAllowedException):
    def __init__(self) -> None:
        super().__init__("An update of the id of a prediction is not allowed.")


class ModelIdUpdateNotAllowedException(IdUpdateNotAllowedException):
    def __init__(self, model_name: str):
        super().__init__(
            f"An update of the id of a {model_name} is not allowed."
        )
