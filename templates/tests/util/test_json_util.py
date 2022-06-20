from src.util.json_util import snake_case_json_dumps


def test_snake_case_json_dumps():
    dict_ = {
        "camelCase": 1,
        "snake_case": 2,
    }
    expected_json = '{"camel_case": 1, "snake_case": 2}'
    assert snake_case_json_dumps(dict_) == expected_json
