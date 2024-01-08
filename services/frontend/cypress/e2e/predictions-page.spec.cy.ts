import {
  TIMEOUT_LONG,
  login,
  logout,
  getSupportingMLEntitieId,
  getCheckA11y,
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
    getCheckA11y();
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
  });

  context('Predictions deletion', () => {
    it('delete a Prediction', () => {
      deletePrediction(predictionItem.name);

      cy.findByTestId('prediction-table').should(
        'not.contain',
        predictionItem.name
      );
    });
  });
});
