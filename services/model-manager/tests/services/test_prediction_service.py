import base64
from datetime import datetime
from typing import Any
from unittest.mock import Mock

import pytest
from pytest_mock import MockerFixture

from src.build.objectstore_client.models import JsonResponse
from src.build.openapi_server.models.prediction import Prediction
from src.build.openapi_server.models.solution import Solution
from src.exceptions import (
    IdUpdateNotAllowedException,
    ModelNotFoundException,
    ResourceNotFoundException,
)
from src.services import DATE_FORMAT_STR
from src.services.prediction_service import PredictionSerivce
from src.services.solution_service import SolutionService


def test_get_file_name(
    prediction_service: PredictionSerivce, mocker: MockerFixture
):
    solution = mocker.Mock(id="solution_id", databag_id="databag_id")
    prediction = mocker.Mock(id="prediction_id")
    file_name = prediction_service.get_file_name(
        prediction, "file.csv", solution=solution
    )
    assert file_name == "databag_id/solution_id/prediction_id/file.csv"


def test_get_file_name_without_solution(
    prediction_service: PredictionSerivce,
    solution_service: SolutionService,
    mocker: MockerFixture,
):
    solution = Solution(id="solution_id", databag_id="databag_id")
    prediction = Prediction(id="prediction_id")
    mocker.patch.object(
        solution_service, "get_solution_by_id", return_value=solution
    )
    file_name = prediction_service.get_file_name(prediction, "file.csv")
    assert file_name == "databag_id/solution_id/prediction_id/file.csv"


def test_config_file_name(prediction_service: PredictionSerivce):
    assert prediction_service.config_file_name == "prediction.json"


def test_model_name(prediction_service: PredictionSerivce):
    assert prediction_service.model_name == "Prediction"


def test_build_model(
    prediction_service: PredictionSerivce,
    prediction_dict: dict[str, Any],
):
    prediction = prediction_service.build_model(prediction_dict)
    assert prediction.id == "prediction_id"
    assert prediction.name == "prediction"
    assert prediction.solution_id == "solution_id"
    assert prediction.run_id == "run_id"


def test_create_prediction(
    prediction_service: PredictionSerivce,
    mocker: MockerFixture,
):
    prediction = Prediction(name="prediction", solution_id="solution_id")

    mocker.patch.object(prediction_service, "_persist_model")
    notify_mock = mocker.patch.object(
        prediction_service, "_notify_model_update"
    )

    prediction = prediction_service.create_prediction(prediction, usertoken="")

    assert prediction.id is not None
    assert (
        datetime.strptime(prediction.creation_time, DATE_FORMAT_STR).date()
        == datetime.today().date()
    )

    notify_mock.assert_called_once()


def test_get_predictions(
    prediction_service: PredictionSerivce,
    solution_service: SolutionService,
    solution: Solution,
    objectstore: Mock,
    mocker: MockerFixture,
):
    objectstore.get_objects_with_prefix = mocker.Mock(
        return_value=[
            "file.txt",
            "pred1/prediction.json",
            "pred2/prediction.json",
            "other/file.csv",
        ]
    )
    pred1_str = '{"id": "prediction_id", "name": null, "status": null, "creation_time": null, "completion_time": null, "solution_id": "solution_id", "run_id": null}'
    pred2_str = '{"id": "prediction2_id", "solution_id": "solution2_id"}'
    pred1 = JsonResponse(
        json_content=base64.encodebytes(pred1_str.encode()).decode()
    )
    pred2 = JsonResponse(
        json_content=base64.encodebytes(pred2_str.encode()).decode()
    )
    objectstore.get_json_object_by_name = mocker.Mock(
        side_effect=[pred1, pred2]
    )

    mocker.patch.object(
        solution_service, "get_solution_by_id", returl_value=solution
    )

    pred1, pred2 = prediction_service.get_predictions(usertoken="")

    assert pred1.id == "prediction_id"
    assert pred1.solution_id == "solution_id"
    assert pred1.run_id is None
    assert pred2.id == "prediction2_id"
    assert pred2.solution_id == "solution2_id"
    assert pred2.run_id is None


def test_get_prediction_by_id(
    prediction_service: PredictionSerivce,
    solution_service: SolutionService,
    solution: Solution,
    objectstore: Mock,
    mocker: MockerFixture,
):
    objectstore.get_objects_with_prefix.return_value = [
        "file.txt",
        "pred1/prediction.json",
        "pred2/prediction.json",
        "other/file.csv",
    ]
    pred1_str = '{"id": "prediction_id", "name": null, "status": null, "creation_time": null, "completion_time": null, "solution_id": "solution_id", "run_id": null}'
    pred2_str = '{"id": "prediction2_id", "solution_id": "solution2_id"}'
    pred1 = JsonResponse(
        json_content=base64.encodebytes(pred1_str.encode()).decode()
    )
    pred2 = JsonResponse(
        json_content=base64.encodebytes(pred2_str.encode()).decode()
    )
    objectstore.get_json_object_by_name.side_effect = [pred1, pred2]

    mocker.patch.object(
        solution_service, "get_solution_by_id", return_value=solution
    )

    pred = prediction_service.get_prediction_by_id(
        "prediction_id", usertoken=""
    )

    assert pred.id == "prediction_id"
    assert pred.solution_id == "solution_id"


def test_get_prediction_by_id_raises_not_found(
    prediction_service: PredictionSerivce,
    objectstore: Mock,
    mocker: MockerFixture,
):
    objectstore.get_objects_with_prefix = mocker.Mock(
        return_value=[
            "file.txt",
            "pred1/prediction.json",
            "pred2/prediction.json",
            "other/file.csv",
        ]
    )
    pred1_str = '{"id": "prediction_id", "name": null, "status": null, "creation_time": null, "completion_time": null, "solution_id": "solution_id", "run_id": null}'
    pred2_str = '{"id": "prediction2_id", "solution_id": "solution2_id"}'
    pred1 = JsonResponse(
        json_content=base64.encodebytes(pred1_str.encode()).decode()
    )
    pred2 = JsonResponse(
        json_content=base64.encodebytes(pred2_str.encode()).decode()
    )
    objectstore.get_json_object_by_name = mocker.Mock(
        side_effect=[pred1, pred2]
    )

    with pytest.raises(ResourceNotFoundException):
        prediction_service.get_prediction_by_id("does_not_exist", usertoken="")


def test_update_prediction_by_id(
    prediction_service: PredictionSerivce,
    mocker: MockerFixture,
    prediction: Prediction,
):
    persist_mock = mocker.patch.object(prediction_service, "_persist_model")
    notify_mock = mocker.patch.object(
        prediction_service, "_notify_model_update"
    )

    prediction.name = "updated"
    updated_prediction = prediction_service.update_prediction_by_id(
        "prediction_id", prediction, usertoken=""
    )

    assert updated_prediction.name == "updated"
    persist_mock.assert_called_once()
    notify_mock.assert_called_once()


def test_update_prediction_by_id_id_update(
    prediction_service: PredictionSerivce,
    prediction: Prediction,
):
    with pytest.raises(IdUpdateNotAllowedException):
        prediction_service.update_prediction_by_id(
            "id_updated", prediction, usertoken=""
        )


def test_delete_prediction_by_id(
    prediction_service: PredictionSerivce,
    objectstore: Mock,
    mocker: MockerFixture,
    prediction: Prediction,
):
    mocker.patch.object(
        prediction_service, "get_model_by_id", return_value=prediction
    )

    terminate_run = mocker.patch.object(
        prediction_service, "terminate_run_for_model"
    )

    mocker.patch.object(prediction_service, "get_file_name", return_value="")

    notify_mock = mocker.patch.object(
        prediction_service, "_notify_model_update"
    )

    prediction_service.delete_prediction_by_id("prediction_id", usertoken="")

    terminate_run.assert_called_once_with(prediction, usertoken="")
    objectstore.delete_objects_with_prefix.assert_called_once()
    notify_mock.assert_called_once()


def test_delete_prediction_by_id_not_found(
    prediction_service: PredictionSerivce,
    mocker: MockerFixture,
):

    mocker.patch.object(
        prediction_service,
        "get_model_by_id",
        side_effect=ModelNotFoundException("", ""),
    )

    prediction_service.delete_prediction_by_id("does_not_exist", usertoken="")


def test_create_prediction_data_put_url(
    prediction_service: PredictionSerivce,
    objectstore: Mock,
    mocker: MockerFixture,
):
    prediction = Prediction(data_file_name="data.csv")
    mocker.patch.object(
        prediction_service, "get_prediction_by_id", return_value=prediction
    )
    file_name_mock = mocker.patch.object(
        prediction_service, "get_file_name", return_value="file/name/data.csv"
    )
    objectstore.get_presigned_put_url.return_value = "url"

    url = prediction_service.create_prediction_data_put_url(
        "solution_id", usertoken=""
    )

    assert url == "url"
    file_name_mock.assert_called_with(prediction, "data.csv", usertoken="")
    objectstore.get_presigned_put_url.assert_called_once()


def test_create_prediction_result_put_url(
    prediction_service: PredictionSerivce,
    objectstore: Mock,
    mocker: MockerFixture,
):
    mocker.patch.object(
        prediction_service, "get_model_by_id", return_value=None
    )

    file_name_mock = mocker.patch.object(
        prediction_service, "get_file_name", return_value="file/name/test"
    )

    objectstore.get_presigned_put_url.return_value = "url"

    url = prediction_service.create_prediction_result_put_url(
        "prediction_id", usertoken=""
    )

    assert url == "url"
    file_name_mock.assert_called_once_with(
        None, "prediction_result.csv", usertoken=""
    )
