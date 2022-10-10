from util.uri import extract_filename_from_uri, is_uri


def test_is_uri_pos():
    uri = "https://www.wogra.com/test/data.csv"
    assert is_uri(uri)


def test_is_uri_neg():
    assert not is_uri("test.csv")


def test_extract_filename_from_uri():
    uri = "https://www.somewebsite.org/books/data.csv"
    assert extract_filename_from_uri(uri) == "data.csv"
