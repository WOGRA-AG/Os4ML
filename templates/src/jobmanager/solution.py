from datetime import datetime
from os import getenv

from build.jobmanager.model.solution import Solution
from model.error_msg_key import ErrorMsgKey
from util.date import DATE_FORMAT_STR
from util.init_jobmanager_client import init_jobmanager_client

USER_TOKEN: str = getenv("OS4ML_ACCESS_TOKEN", "")


def status_update(
    solution_name: str, new_status: str, os4ml_namespace: str
) -> Solution:
    jobmanager = init_jobmanager_client(os4ml_namespace)
    solution = jobmanager.get_solution(
        solution_name=solution_name, usertoken=USER_TOKEN
    )
    solution.status = new_status
    jobmanager.put_solution(
        solution.name, solution=solution, usertoken=USER_TOKEN
    )
    return solution


def error_status_update(
    solution_name: str, error_msg_key: ErrorMsgKey, os4ml_namespace: str
) -> None:
    jobmanager = init_jobmanager_client(os4ml_namespace)
    solution = jobmanager.get_solution(solution_name, usertoken=USER_TOKEN)
    solution.status = "error"
    solution.error_msg_key = error_msg_key.value
    solution.completion_time = datetime.utcnow().strftime(DATE_FORMAT_STR)
    jobmanager.put_solution(
        solution.name, solution=solution, usertoken=USER_TOKEN
    )


def get_solution(solution_name: str, os4ml_namespace: str) -> Solution:
    jobmanager = init_jobmanager_client(os4ml_namespace)
    return jobmanager.get_solution(solution_name, usertoken=USER_TOKEN)


def put_solution(
    solution: Solution, solution_name: str, os4ml_namespace: str
) -> None:
    jobmanager = init_jobmanager_client(os4ml_namespace)
    jobmanager.put_solution(
        solution_name, solution=solution, usertoken=USER_TOKEN
    )
