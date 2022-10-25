class TemplateNotFoundException(Exception):
    def __init__(self, name: str, path: str):
        self.message = (
            f"PipelineTemplate with name {name} not found at path: {path}"
        )
