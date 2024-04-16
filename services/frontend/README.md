# OS4ML - Frontend app

- 🛠️ [Getting started](#🛠️-getting-started)
- 🧪 [Testing](#🧪-testing)

The official OS4ML frontend app.

- 📂 [Directory overview](#📂-directory-overview)
- 🛠️ [Getting started](#🛠️-getting-started)
- 🧪 [Testing](#🧪-testing)
- 🌍 [i18n](#🌍-i18n)

## 📂 Directory overview

```bash
├── [+] cypress/                # E2E and Integration tests with Cypress
├── [+] nginx/                  # Nginx config for environments
├── [+] src/                    # Source code of the app
│    ├── app/                     # Angular source code
│    ├── assets/                  # Project-related files, no code
│    └── environments/            # Configurations for the environments
├── README.md                   # Inception
└── ...
```

## 🛠️ Getting started

The first time you're running the project, you need to run the following command:

- `npm run generate:modelmanager`

### Environment variables

You don't need to set up environment variables for running the frontend app.
Create a `cypress.env.json` file just in case you need to run the E2E tests, with the following content:

```json
{
  "dev": "false",
  "TEST_USER": "XXX",
  "TEST_PASSWORD": "XXX"
}
```

### Available scripts

Here there's a list of the most relevant scripts:

- `generate:modelmanager`: Builds the Model Manager API CLI in Typescript
- `prestart`: Runs the `generate:modelmanager` command
- `start`: Starts the app
- `start-frontend`: Starts the app with proxy configuration
- `build`: Generate the bundle of the app
- `test`: Execute the unit tests
- `lint`: Runs the linter
- `format`: Runs the linter and the formatter
- `prettier`: Runs the formatter
- `e2e:run`: Executes E2E tests in headless mode
- `e2e:local`: Executes E2E tests in headless and DEV mode
- `cypress:open`: Opens Cypress GUI for executing E2E tests in DEV mode
- `cypress:open-test`: Opens Cypress GUI for executing E2E test

### Angular scripts

#### Code scaffolding

Run `ng generate component component-name` or the short version (`ng g c component-name`) to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

#### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page or the [new homepage](https://angular.dev/).

## 🧪 Testing

These types of tests are currently implemented in this project

- ❌ Unit tests
- ❌ Integration tests
- ✅ E2E tests
- ❌ Visual tests

### Recomendations

If you need to implement any kind of tests, we recommend you to take a look to the following [guide from Testing library](https://testing-library.com/docs/queries/about), specially to the [#priority](https://testing-library.com/docs/queries/about/#priority) section, which explains and justifies which kind of checks you should do on the app, taking into account and prioritizing how users interact with your code.

## 🌍 i18n

As we are in the early development stage, translations are prepared, but not used yet. There is a translation file in `src/assets/i18n` for `de` with translation values still in english. But make sure all keys are contained by running `npm run i18n` and comparing the `messages.json` file to the `messages.de.json` file.
