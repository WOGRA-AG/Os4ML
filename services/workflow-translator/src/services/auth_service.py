import base64
import json
from http import HTTPStatus

from fastapi import Header, HTTPException

from src.build.openapi_server.models.oidc_user import OIDCUser
from src.build.openapi_server.models.user import User


def _parse_oidc_token(usertoken: str = Header()) -> OIDCUser:
    if usertoken:
        encoded_payload: str = usertoken.split(".")[1]
        base64_bytes = encoded_payload.encode("ascii")
        message_bytes = base64.b64decode(
            base64_bytes + b"=" * (-len(base64_bytes) % 4)
        )
        payload: str = message_bytes.decode("ascii")
        kc_token = OIDCUser(**json.JSONDecoder().decode(payload))
        return kc_token


def _parse_user_from_oidc(
    oidc_user: OIDCUser, usertoken: str = Header()
) -> User:
    user: User = User(
        id=oidc_user.sub,
        email=oidc_user.email,
        first_name=oidc_user.given_name or "",
        last_name=oidc_user.family_name or "",
        raw_token=usertoken,
    )
    return user


def get_parsed_token(usertoken: str = Header()) -> User:
    if not usertoken:
        return User(id="default", email="", raw_token="")
    try:
        oidc_user: OIDCUser = _parse_oidc_token(usertoken)
        user: User = _parse_user_from_oidc(oidc_user, usertoken)
        return user
    except Exception:
        raise HTTPException(
            HTTPStatus.UNAUTHORIZED, "Invalid Authorization Header"
        )
