from typing import overload


@overload
def convert_to_camel_case(obj: str) -> str:
    ...


@overload
def convert_to_camel_case(
    obj: list[dict[str, object]]
) -> list[dict[str, object]]:
    ...


@overload
def convert_to_camel_case(obj: dict[str, object]) -> dict[str, object]:
    ...


def convert_to_camel_case(
    obj: str | list[dict[str, object]] | dict[str, object]
) -> str | list[dict[str, object]] | dict[str, object]:
    if isinstance(obj, str):
        first, *rest = obj.split("_")
        return "".join([first.lower(), *(word.title() for word in rest)])
    if isinstance(obj, list):
        return [convert_to_camel_case(item) for item in obj]
    if isinstance(obj, dict):
        return {
            convert_to_camel_case(key): convert_to_camel_case(value)
            if isinstance(value, dict)
            else value
            for key, value in obj.items()
        }
    return obj
