FROM tensorflow/tensorflow:2.7.0-gpu as production

ENV TARGET_DIR /opt/enas-trial/

WORKDIR  ${TARGET_DIR}

COPY ./*.py ./
COPY ./requirements.txt .

ENV PYTHONPATH ${TARGET_DIR}

RUN chgrp -R 0 ${TARGET_DIR} && chmod -R g+rwX ${TARGET_DIR}

RUN pip install -r requirements.txt

ENTRYPOINT ["python3", "-u", "RunTrial.py"]
