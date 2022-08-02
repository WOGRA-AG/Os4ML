from exceptions.NotFoundException import NotFoundException


class DatabagNotFoundException(NotFoundException):
    def __init__(self, name=None, run_id=None):
        if name:
            message = f"Databag with name {name} not found"
        elif run_id:
            message = f"Databag with run_id {run_id} not found"
        else:
            message = f"Databag not found"
        super().__init__(message)
