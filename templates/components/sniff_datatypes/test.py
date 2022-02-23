import pandas as pd
import pytest

from main import sniff_series, ColumnDataType, sniff_column_datatypes_from_df, \
    create_list_entry, ColumnUsage, sniff_column_datatypes_to_json
import main
from datetime import datetime, timedelta


@pytest.mark.parametrize('series, expected', [
    (['four', 'words', 'are', 'enough'], ColumnDataType.TEXT),
    ([1, 2, -3, -4], ColumnDataType.NUMERICAL),
    ([1.1, 44.42345, -2345.3345, 1234.0], ColumnDataType.NUMERICAL),
    ([1, 7.7, -14.14, 87], ColumnDataType.NUMERICAL),
    ([1, 2.1], ColumnDataType.CATEGORY),
    ([0, 1, 1, 0, 1, 0, 1, 1], ColumnDataType.CATEGORY),
    (['asdf', 'asdf', 'asdf', 'asd', 'asd'], ColumnDataType.CATEGORY),
    ([datetime.now()], ColumnDataType.CATEGORY),
])
def test_sniff_series(series, expected, mocker):
    mocker.patch.object(main, 'MAX_NUM_CATEGORIES', 3)
    assert sniff_series(pd.Series(series)) == expected


def test_sniff_series_date(mocker):
    mocker.patch.object(main, 'MAX_NUM_CATEGORIES', 2)
    today = datetime.today()
    yesterday = today - timedelta(days=1)
    tomorrow = today + timedelta(days=1)
    series = pd.Series([today, yesterday, tomorrow])
    assert sniff_series(series) == ColumnDataType.DATE


@pytest.fixture
def dataframe():
    return pd.DataFrame({
        'word': ['abeded', 'ababab', 'FEEE'],
        'group': ['LO', 'LO', 'UP'],
        'count': [1, 3, 0],
    })


def test_sniff_column_datatypes_from_df(dataframe, mocker):
    mocker.patch.object(main, 'MAX_NUM_CATEGORIES', 2)
    columns = sniff_column_datatypes_from_df(dataframe)
    expected = [
        create_list_entry('word', ColumnDataType.TEXT, ColumnUsage.FEATURE),
        create_list_entry('group', ColumnDataType.CATEGORY,
                          ColumnUsage.FEATURE),
        create_list_entry('count', ColumnDataType.NUMERICAL,
                          ColumnUsage.LABEL),
    ]
    assert columns == expected


def test_sniff_column_datatypes_to_json(dataframe, mocker):
    mocker.patch.object(main, 'MAX_NUM_CATEGORIES', 2)
    json_ = sniff_column_datatypes_to_json(dataframe)
    expected = '[{"name": "word", "type": "text", "usage": "feature"}, ' \
               '{"name": "group", "type": "category", "usage": "feature"}, ' \
               '{"name": "count", "type": "numerical", "usage": "label"}]'
    assert json_ == expected
