class ResourceNotFoundException(Exception):
    def __init__(self, message: str):
        self.message = message


class DatabagNotFoundException(ResourceNotFoundException):
    def __init__(self, databag_id: str):
        super().__init__(f"Databag with id {databag_id} not found")


class SolutionNotFoundException(ResourceNotFoundException):
    def __init__(self, solution_id: str):
        super().__init__(f"Solution with id {solution_id} not found")


class SolverNotFoundException(ResourceNotFoundException):
    def __init__(self, solver_name: str):
        super().__init__(f"Solver with name {solver_name} not found")


class PredictionNotFoundException(ResourceNotFoundException):
    def __init__(self, prediction_id: str):
        super().__init__(f"Prediction with id {prediction_id} not found")


class ModelNotFoundException(ResourceNotFoundException):
    def __init__(self, model_name: str, id_: str):
        super().__init__(f"{model_name} with id {id_} not found")


class TransferLearningModelNotFoundException(ResourceNotFoundException):
    def __init__(self, id: str):
        super().__init__(f"Transfer Learning Model with id {id} not found")
