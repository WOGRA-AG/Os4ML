from src.util.uri import extract_filename_from_uri, is_shepard_uri, is_uri


def test_is_uri_pos():
    uri = "https://www.wogra.com/test/data.csv"
    assert is_uri(uri)


def test_is_uri_neg():
    assert not is_uri("test.csv")


def test_is_shepard_uri_pos():
    shepard_uri = "https://shepard-instance.de/shepard/api/data.csv"
    assert is_shepard_uri(shepard_uri)


def test_is_shepard_uri_no_uri():
    assert not is_shepard_uri("test.csv")


def test_is_shepard_uri_non_shepard_uri():
    uri = "https://www.wogra.com/test/data.csv"
    assert not is_shepard_uri(uri)


def test_extract_filename_from_uri():
    uri = "https://www.somewebsite.org/books/data.csv"
    assert extract_filename_from_uri(uri) == "data.csv"
