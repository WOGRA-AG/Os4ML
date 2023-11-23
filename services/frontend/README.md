# OS4ML - Frontend app

The official OS4ML frontend app.

- 📂 [Directory overview](#📂-directory-overview)
- 🛠️ [Getting started](#🛠️-getting-started)
- 🧪 [Testing](#🧪-testing)
- 🌍 [i18n](#🌍-i18n)

## 📂 Directory overview

> NOTE: \* symbol at the start of the text means that is OPTIONAL

```bash
├── [+] cypress/                # E2E and Integration tests with Cypress
├── [+] nginx/                  # Nginx config for environments
├── [+] src/                    # Source code of the app
│    ├── app/                     # TODO: Add documentation
│    ├── assets/                  # TODO: Add documentation
│    └── environments/            # TODO: Add documentation
├── README.md                   # Inception
├── (FILE_NAME)                 # TODO ADD DOCUMENTATION: Other files
└── ...
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

- `npm run generate:modelmanager`

### Connecting to the API's

In case you need to use the different API's, you can create a tunnel between your local machine and the environment.
This solution is useful for example when you have to work in a feature without the need of doing any development on the API's side (you just need to consume them).

Follow this steps to create a tunnel connection:

#### The first time

- Install the [GCloud CLI](https://cloud.google.com/sdk/docs/install)
- Open a new terminal
- Log in your GCloud account:
  - `gcloud auth login`
- Install Google Kubernetes Engine (GKE) component:
  - `gcloud components install gke-gcloud-auth-plugin`
- Setup k8s config:
  - `gcloud container clusters get-credentials os4ml-k8s --project=proud-lamp-337514 --zone=europe-west4-c`

#### Every time you want to create a new tunnel

Once you completed the `"first time"` section, you can run the following command:

- `kubectl port-forward -n os4ml-release svc/model-manager 8000:8000`

**NOTES:**

- Replace `os4ml-release` with the k8s namespace to be used (by this way you can change the environment you're connected to)
- Replace `8000:8000` with the ports you need/want for the tunnel
  - The first number (before `:`), is the port we want to use from the k8s instance
  - The second number (after `:`), is the port we want to use in our laptop for accessing the tunnel

### Environment variables

You don't need to set up environment variables for running the frontend app.
Create a `cypress.env.json` file just in case you need to run the E2E tests, with the following content:

```json
{
  "dev": "false",
  "TEST_USER": "e2e",
  "TEST_PASSWORD": "<<<ASK_FOR_PASSWORD>>>"
}
```

### Available scripts

Here there's a list of the most relevant scripts:

- `generate:modelmanager`: Builds the Model Manager API CLI in Typescript
- `prestart`: Runs the `generate:modelmanager` command
- `start`: Starts the app
- `start-frontend`: Starts the app with proxy configuration
- `build`: Generate the bundle of the app
- `test`: Execute the unit tests via
- `lint`: Runs the linter
- `format`: Runs the linter and the formatter
- `prettier`: Runs the formatter
- `e2e:run`: Executes E2E tests in headless mode
- `e2e:local`: Executes E2E tests in headless and DEV mode
- `cypress:open`: Opens Cypress GUI for executing E2E tests in DEV mode (connects to localhost)
- `cypress:open-test`: Opens Cypress GUI for executing E2E test (connects to Testing environment)

### Angular scripts

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.3.

#### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## 🧪 Testing

On this project is implemented, at the moment, these kind of tests:

- ❌ Unit tests
- ❌ Integration tests
- ✅ E2E tests
- ❌ Visual tests

### Recomendations

If you need to implement any kind of tests, we recommend you to take a look to the following [guide from Testing library](https://testing-library.com/docs/queries/about), specially to the [#priority](https://testing-library.com/docs/queries/about/#priority) section, which explains and justifies which kind of checks you should do on the app, taking into account and prioritizing how users interact with your code.

## 🌍 i18n

`TODO: Add documentation`
