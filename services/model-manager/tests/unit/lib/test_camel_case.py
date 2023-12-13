import pytest

from src.lib.camel_case import convert_to_camel_case


@pytest.mark.parametrize(
    "obj, expected",
    [
        ("snake_case", "snakeCase"),
        ({"key_str": 1}, {"keyStr": 1}),
        (["snake_case", "snaky_case"], ["snakeCase", "snakyCase"]),
    ],
)
def test_convert_to_camel_case(obj, expected):
    assert convert_to_camel_case(obj) == expected
