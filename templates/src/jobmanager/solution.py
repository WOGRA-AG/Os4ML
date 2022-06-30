from datetime import datetime
from typing import Dict

import requests

from src.jobmanager.urls import get_solution_url, put_solution_url
from src.util.date import FORMAT_STR


def status_update(
    solution_name: str, new_status: str, os4ml_namespace: str
) -> None:
    solution = get_solution(solution_name, os4ml_namespace)
    solution["status"] = new_status
    put_solution(solution, solution_name, os4ml_namespace)


def error_status_update(solution_name: str, os4ml_namespace: str) -> None:
    solution = get_solution(solution_name, os4ml_namespace)
    solution["status"] = "error"
    solution["completionTime"] = datetime.utcnow().strftime(FORMAT_STR)
    put_solution(solution, solution_name, os4ml_namespace)


def get_solution(solution_name: str, os4ml_namespace: str) -> Dict:
    url = get_solution_url(solution_name, os4ml_namespace)
    return requests.get(url).json()


def put_solution(
    solution: Dict, solution_name: str, os4ml_namespace: str
) -> None:
    url = put_solution_url(solution_name, os4ml_namespace)
    requests.put(url, json=solution)
