import {
  TIMEOUT_LONG,
  handleA11yViolations,
  login,
  logout,
  getSupportingMLEntitieId,
} from '../utils/e2e.utils';
import {
  CreateDatabagForm,
  checkDatabag,
  deleteDatabag,
  setupDatabag,
} from 'cypress/utils/databag.utils';
import {
  CreateSolutionForm,
  checkSolution,
  setupSolution,
  deleteSolution,
} from 'cypress/utils/solution.utils';
import {
  CreatePredictionForm,
  createPrediction,
  deletePrediction,
  visitPredictionsPage,
} from 'cypress/utils/prediction.utils';
const essentialMLEntitiesOnly =
  Cypress.env('createEssentialMLEntitiesOnly') === true;
const id = Date.now();

const databagItem: CreateDatabagForm = {
  name: `Databag for prediction specs #${getSupportingMLEntitieId()}`,
  fixtureFilename: 'cypress/fixtures/databags/titanic-small.xlsx',
};

const solutionItem: CreateSolutionForm = {
  name: `Solution for prediction specs #${getSupportingMLEntitieId()}`,
  databagName: databagItem.name,
  applyTransferLearning: false,
};

const predictionItem: CreatePredictionForm = {
  name: `Prediction #${id}`,
  solutionName: solutionItem.name,
  file: 'cypress/fixtures/predictions/titanic_predict.csv',
};

const predictionItemMobile: CreatePredictionForm = {
  name: `Prediction mobile #${id}`,
  solutionName: solutionItem.name,
  file: 'cypress/fixtures/predictions/titanic_predict.csv',
};

describe('Predictions Page', () => {
  before('Prepare data for tests', () => {
    login('#/databags');
    cy.injectAxe();

    setupDatabag(databagItem);
    checkDatabag(databagItem.name);

    cy.visit('/#/solutions');
    setupSolution(solutionItem);
    checkSolution(solutionItem.name);
  });

  after('Clean up', () => {
    if (!essentialMLEntitiesOnly) {
      deleteDatabag(databagItem.name);
      deleteSolution(solutionItem.name);
    }
    logout();
  });

  beforeEach(() => {
    login();
    visitPredictionsPage();
    cy.injectAxe();
  });

  it('Has no detectable accessibility violations on load', () => {
    cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  });

  context('Creating precictions', () => {
    it('add a Prediction', () => {
      createPrediction(predictionItem);

      cy.findAllByTestId('prediction-item')
        .filter(`:contains("${predictionItem.name}")`)
        .should('exist');
      cy.findAllByTestId('prediction-item')
        .filter(`:contains("${predictionItem.name}")`)
        .contains('Done', {
          timeout: TIMEOUT_LONG,
        });
    });

    it('add a Prediction mobile', () => {
      createPrediction(predictionItemMobile);

      cy.findAllByTestId('prediction-item')
        .filter(`:contains("${predictionItemMobile.name}")`)
        .should('exist');
      cy.findAllByTestId('prediction-item')
        .filter(`:contains("${predictionItemMobile.name}")`)
        .contains('Done', {
          timeout: TIMEOUT_LONG,
        });
    });
  });

  context('Predictions deletion', () => {
    it('delete a Prediction', () => {
      deletePrediction(predictionItem.name);

      cy.findByTestId('prediction-table').should(
        'not.contain',
        predictionItem.name
      );
    });

    it('delete a Prediction mobile', () => {
      deletePrediction(predictionItemMobile.name);

      cy.findByTestId('prediction-table').should(
        'not.contain',
        predictionItemMobile.name
      );
    });
  });
});
