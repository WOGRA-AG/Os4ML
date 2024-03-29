from datetime import datetime
from typing import IO

from build.model_manager_client.model.solution import Solution
from config import DATE_FORMAT_STR, USER_TOKEN
from model_manager.init_api_client import model_manager
from models.status_message import StatusMessage
from util.download import download_file
from util.upload import put_file_to_url


def get_solution_by_id(solution_id: str) -> Solution:
    return model_manager.get_solution_by_id(solution_id, usertoken=USER_TOKEN)


def update_solution(solution: Solution, completed=False) -> Solution:
    if completed:
        solution.completion_time = datetime.utcnow().strftime(DATE_FORMAT_STR)
    model_manager.update_solution_by_id(
        solution.id, solution=solution, usertoken=USER_TOKEN
    )
    return solution


def update_solution_status(
    solution_id: str, status: StatusMessage, completed=False
) -> Solution:
    solution = model_manager.get_solution_by_id(
        solution_id, usertoken=USER_TOKEN
    )
    solution.status = status.value
    return update_solution(solution, completed=completed)


def update_solution_error_status(
    solution_id: str, status: StatusMessage
) -> None:
    solution = model_manager.get_solution_by_id(
        solution_id, usertoken=USER_TOKEN
    )
    solution.status = status.value
    update_solution(solution, completed=True)


def upload_model(model: IO[bytes], solution_id: str) -> None:
    url = model_manager.create_model_put_url(solution_id, usertoken=USER_TOKEN)
    put_file_to_url(url, model)


def download_model(model: IO[bytes], solution_id: str) -> None:
    url = model_manager.get_model_get_url(solution_id, usertoken=USER_TOKEN)
    download_file(url, model)


def upload_prediction_template(
    template: IO[bytes], solution_id: str, file_name: str
) -> None:
    solution = model_manager.get_solution_by_id(
        solution_id, usertoken=USER_TOKEN
    )
    solution.prediction_template_file_name = file_name
    update_solution(solution)
    url = model_manager.create_prediction_template_put_url(
        solution_id, usertoken=USER_TOKEN
    )
    put_file_to_url(url, template)
