import logging
import subprocess
import tempfile

from kfp.v2.dsl import Dataset, Output

from model_manager.databags import download_dataset, get_databag_by_id


def execute_dataframe_script(
    dataframe: Output[Dataset],
    databag_id: str,
):
    databag = get_databag_by_id(databag_id)
    with tempfile.NamedTemporaryFile() as script:
        with open(script.name, "wb") as script_file:
            download_dataset(script_file, databag)
        command = [
            "python",
            script.name,
            "--output",
            dataframe.path,
        ]
        logging.info(f"Executing script: {command}")
        subprocess.run(command)
