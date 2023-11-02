import {
  createDatabag,
  createSolution,
  deleteDatabag,
  deleteSolution,
  deletePrediction,
  visitPredictionsPage,
  handleA11yViolations,
  setupSolutionTestDatabag,
  createPrediction,
  setupPredictionTestSolution,
} from '../utils/e2e.utils';
import { login, logout } from '../utils/e2e.login';

const predictionTestDatabagName = `e2e prediction test databag`;
const predictionTestSolutionName = `e2e prediction test solution`;
const predictionName = `e2e predictionName ${new Date().toISOString()}`;
const updatedPredictionName = `e2e predictionName update ${new Date().toISOString()}`;

beforeEach('login', () => {
  login();
});

after('logout', () => {
  logout();
});

beforeEach(() => {
  visitPredictionsPage();
  cy.injectAxe();
});

describe('Predictions Page', () => {
  it('Has no detectable accessibility violations on load', () => {
    cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  });

  it('setup a Databag xls', () => {
    setupSolutionTestDatabag(predictionTestDatabagName);
  });

  it('setup a Solution', () => {
    setupPredictionTestSolution(
      predictionTestSolutionName,
      predictionTestDatabagName
    );
  });

  it('create Pridiction', () => {
    createPrediction(
      predictionName,
      predictionTestSolutionName,
      'cypress/fixtures/titanic_predict.csv'
    );
  });

  it('delete Prediction', () => {
    deletePrediction(predictionName);
  });
});
