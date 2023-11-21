import {
  TIMEOUT_LONG,
  handleA11yViolations,
  login,
  logout,
} from '../utils/e2e.utils';
import {
  CreateDatabagForm,
  checkDatabag,
  createDatabag,
  deleteDatabag,
} from 'cypress/utils/databag.utils';
import {
  CreateSolutionForm,
  createSolution,
} from 'cypress/utils/solution.utils';
import {
  CreatePredictionForm,
  createPrediction,
  deletePrediction,
  visitPredictionsPage,
} from 'cypress/utils/prediction.utils';

const id = Date.now();

const databagItem: CreateDatabagForm = {
  name: `Databag for prediction specs #${id}`,
  fixtureFilename: 'cypress/fixtures/databags/titanic-small.xlsx',
};

const solutionItem: CreateSolutionForm = {
  name: `Solution for prediction specs #${id}`,
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

    createDatabag(databagItem);
    checkDatabag(databagItem.name);

    cy.visit('/#/solutions');
    createSolution(solutionItem);
  });

  after('Clean up', () => {
    cy.visit('/#/databags');
    deleteDatabag(databagItem.name);
    logout();
  });

  beforeEach(() => {
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
