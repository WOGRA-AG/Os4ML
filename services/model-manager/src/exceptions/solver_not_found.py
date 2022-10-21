class SolverNotFoundException(Exception):
    def __init__(self, solver_name: str):
        self.message = f"Solver with name {solver_name} not found"
