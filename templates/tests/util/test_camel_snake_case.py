from src.util.camel_snake_case import camel_to_snake


def test_camel_to_snake():
    camel_str = "thisIsACamelCaseStr"
    expected_snake_case_str = "this_is_a_camel_case_str"
    assert camel_to_snake(camel_str) == expected_snake_case_str
