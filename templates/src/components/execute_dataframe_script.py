import logging
import subprocess
import tempfile

from kfp.v2.dsl import Output, Dataset

from objectstore.objectstore import download_file, get_download_url


def execute_dataframe_script(
        dataframe: Output[Dataset],
        bucket: str,
        file_name: str,
        databag_id: str,
        os4ml_namespace: str,
):
    script_url = get_download_url(bucket, f"{databag_id}/{file_name}", os4ml_namespace)
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
