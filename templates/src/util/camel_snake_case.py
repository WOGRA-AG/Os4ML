def camel_to_snake(camel: str):
    """Converts a camelCase str to a snake_case str."""
    return "".join("_" + c.lower() if c.isupper() else c for c in camel)
