from datetime import datetime
from typing import IO

from build.model_manager_client.model.solution import Solution
from config import DATE_FORMAT_STR, USER_TOKEN
from model_manager.init_api_client import init_model_manager_client
from models.status_message import StatusMessage


def get_solution_by_name(solution_name: str) -> Solution:
    model_manager = init_model_manager_client()
    return model_manager.get_solution_by_name(
        solution_name, usertoken=USER_TOKEN
    )


def update_solution(solution: Solution, solution_name: str) -> None:
    model_manager = init_model_manager_client()
    model_manager.update_solution_by_name(
        solution_name, solution=solution, usertoken=USER_TOKEN
    )


def update_solution_status(
    solution_name: str, status: StatusMessage
) -> Solution:
    model_manager = init_model_manager_client()
    solution = model_manager.get_solution_by_name(
        solution_name, usertoken=USER_TOKEN
    )
    solution.status = status.value
    model_manager.update_solution_by_name(
        solution_name, solution=solution, usertoken=USER_TOKEN
    )
    return solution


def update_solution_error_status(
    solution_name: str, status: StatusMessage
) -> None:
    model_manager = init_model_manager_client()
    solution = model_manager.get_solution_by_name(
        solution_name, usertoken=USER_TOKEN
    )
    solution.status = status.value
    solution.completion_time = datetime.utcnow().strftime(DATE_FORMAT_STR)
    model_manager.update_solution_by_name(
        solution_name, solution=solution, usertoken=USER_TOKEN
    )


def upload_model(model: IO[bytes], solution_name: str) -> None:
    model_manager = init_model_manager_client()
    model_manager.upload_model(solution_name, body=model, usertoken=USER_TOKEN)
