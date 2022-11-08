import logging
import subprocess
import tempfile

from kfp.v2.dsl import Dataset, Output

from model_manager.databags import get_databag_by_id, get_dataset_download_url
from util.download import download_file


def execute_dataframe_script(
    dataframe: Output[Dataset],
    databag_id: str,
    os4ml_namespace: str,
):
    databag = get_databag_by_id(databag_id, os4ml_namespace)
    script_url = get_dataset_download_url(databag, os4ml_namespace)
    with tempfile.NamedTemporaryFile() as script:
        with open(script.name, "wb") as script_file:
            download_file(script_url, script_file)
        command = [
            "python",
            script.name,
            "--output",
            dataframe.path,
        ]
        logging.info(f"Executing script: {command}")
        subprocess.run(command)
