class SolutionNotFoundException(Exception):
    def __init__(self, solution_name: str):
        self.message = f"Solution with name {solution_name} not found"
