from src.model.column import Column


def test_from_json():
    json_dict = {
        "name": "age",
        "type": "int",
        "usage": "feature",
        "numEntries": 100,
    }
    expected_column = Column("age", "int", "feature", 100)
    assert Column.from_json(json_dict) == expected_column
