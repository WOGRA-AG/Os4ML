from typing import Protocol, runtime_checkable

from models.status_message import StatusMessage


@runtime_checkable
class HasErrorStatus(Protocol):
    error_status: StatusMessage
