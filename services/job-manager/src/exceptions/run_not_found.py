class RunNotFoundException(Exception):
    def __init__(self, run_id: str):
        self.message = f"Run with id {run_id} not found"
