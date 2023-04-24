import textwrap
from io import StringIO

import pandas as pd
import pytest

from load.dataframe import create_df
from models.file_type import FileType


@pytest.mark.parametrize(
    ("csv_text", "df_dict"),
    (
        (
            """\
            Name,Age
            Julius,28
            "Peter, Wogra",12
            """,
            {"Name": ["Julius", "Peter, Wogra"], "Age": [28, 12]},
        ),
        (
            """\
            Name;Age
            Julius;28
            Peter, Wogra;12
            """,
            {"Name": ["Julius", "Peter, Wogra"], "Age": [28, 12]},
        ),
        (
            """\
            Name:Age
            Julius:28
            Peter, Wogra:12
            """,
            {"Name": ["Julius", "Peter, Wogra"], "Age": [28, 12]},
        ),
        (
            """\
            Name\tAge
            Julius\t28
            Peter, Wogra\t12
            """,
            {"Name": ["Julius", "Peter, Wogra"], "Age": [28, 12]},
        ),
        (
            """\
            Name Age
            Julius 28
            "Peter, Wogra" 12
            """,
            {"Name": ["Julius", "Peter, Wogra"], "Age": [28, 12]},
        ),
    ),
)
def test_read_csv(csv_text, df_dict):
    csv_io = StringIO(textwrap.dedent(csv_text))
    df = create_df(FileType.CSV, csv_io)
    df_expected = pd.DataFrame(df_dict)
    pd.testing.assert_frame_equal(df, df_expected)
