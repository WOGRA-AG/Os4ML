# Templates

This contains the code for our pipelines.


## Structure
```bash
├── components      // components entrypoints
├── dockerfiles     // dockfiles for the components
├── oas             // mirror of the oas service dir
├── pipelines       // pipeline definitions
├── src             // src code for the components
└── tests           // tests
```

## Dockerfiles
We use kubeflow pipelines to build and execute the pipelines. To use shared code we have built the following docker images:

- python: for standard python task
- pandas: for data tasks, contains also the Pillow package to work with images
- ludwig: for the ludwig solver

Each dockefile contains the src folder and the generate clients for our oas spec.

## Naming Conventions
Additional to the standard os4ml naming conventions we have defined the following names:

- dataset: raw data uploaded by the user
- dataframe: pandas dataframe of the processed data

## Local development
To execute pipelines with local changes, you have to do the following:

1. Change to a testing tag
Change the tag in `build-and-push-dockerfiles.sh` and the default tag in `components/images.py` to a unique testing tag, e.g. 'test-dennis'

2. Build Components
```bash
poetry run python build_all_components.py
```

3. Build Pipelines
```bash
poetry run python build_all_pipelines.py
```

4. Build and push the dockerfiles
```bash
./build-and-push-dockerfiles.sh 
```

5. Start the workflow-translator
- Change `PIPELINE_TEMPLATES_DIR` of `services/workflow-translator/src/services/__init__.py` to the local pipelines dir
- Start the workflow translator
```bash
cd services/workflow-translator
poetry run python src/main.py
```
- Intercept the workflow translator
```bash
telepresence intercept --namespace os4ml workflow-translator --port 8002:8000
```


Now the locally running workflow translator is used and this uses the local pipeline files. The pipeline files run on the newely built images.

Once you have setupt this to only need to rerun step 4 to get updates for the changes in the src dir.

