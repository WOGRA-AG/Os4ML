class DatabagNotFoundException(Exception):
    def __init__(self, databag_id: str):
        self.message = f"Databag with id {databag_id} not found"
