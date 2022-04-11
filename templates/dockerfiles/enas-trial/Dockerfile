FROM tensorflow/tensorflow:2.7.0-gpu

ENV TARGET_DIR /opt/enas-trial/

ADD *.py ${TARGET_DIR}
WORKDIR  ${TARGET_DIR}

ENV PYTHONPATH ${TARGET_DIR}

RUN chgrp -R 0 ${TARGET_DIR} \
  && chmod -R g+rwX ${TARGET_DIR}

ENTRYPOINT ["python3", "-u", "RunTrial.py"]
