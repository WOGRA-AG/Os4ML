# OS4ML - Frontend app

- 🛠️ [Getting started](#🛠️-getting-started)
- 🧪 [Testing](#🧪-testing)


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.3.

## 🛠️ Getting started

The first time you're running the project, you need to run the following command:

- `npm run generate:modelmanager`

### Environment variables

You don't need to set up environment variables for running the frontend app.
Create a `cypress.env.json` file just in case you need to run the E2E tests, with the following content:

```json
{
  "dev": "false",
  "TEST_USER": "e2e",
  "TEST_PASSWORD": "sZUG2jGC"
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
- `cypress:open`: Opens Cypress GUI for executing E2E tests in DEV mode
- `cypress:open-test`: Opens Cypress GUI for executing E2E test

### Angular scripts

#### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

#### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## 🧪 Testing

On this project is implemented, at the moment, these kind of tests:

- ❌ Unit tests
- ❌ Integration tests
- ✅ E2E tests
- ❌ Visual tests
