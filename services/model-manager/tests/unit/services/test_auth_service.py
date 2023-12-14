import pytest

from src.services.auth_service import get_parsed_token, mock_token_with_user_id


@pytest.mark.parametrize(
    "user_id",
    ("1234", "asdf-aasdf-13403094", "1ec49f20-888b-46fb-83e7-d102e65aebde"),
)
def test_mock_token_with_user_id(user_id: str) -> None:
    mock_token = mock_token_with_user_id(user_id)
    assert get_parsed_token(mock_token).id == user_id
