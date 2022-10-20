class MalformedTemplateException(Exception):
    def __init__(self, name: str = None, err: str = None):
        self.message = f"Error while parsing PipelineTemplate with name {name}. Thrown exception is: {err}"
