import {
  createDatabag,
  createSolution,
  deleteDatabag,
  deleteSolution,
  deletePrediction,
} from '../utils/e2e.utils';
import { login, logout } from '../utils/e2e.login';

const databagName = `e2e databag ${new Date().toISOString()}`;
const solutionName = `e2e solutionName ${new Date().toISOString()}`;
const predictionName = `e2e predictionName ${new Date().toISOString()}`;


beforeEach('login', () => {
  login();
});

after('logout', () => {
  logout();
});

beforeEach(() => {
  cy.visit('/#/predictions');
  cy.wait(2000);
});

function createPrediction(predictionName: string, solutionName: string, csv: string) {

}

describe('Predictions Page', () => {
  it('add a Databag xls', () => {
    createDatabag(databagName, 'cypress/fixtures/titanic.xls');
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${databagName}")`)
      .should('exist');
  });

  it('add Solution', () => {
    createSolution(solutionName, databagName);
    cy.wait(2000);
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${solutionName}")`)
      .should('exist');
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${solutionName}")`)
      .contains('Done', {
        timeout: 600000,
      });
  });

  it('create Pridiction', () => {
    createPrediction(
      predictionName,
      solutionName,
      'cypress/fixtures/titanic_predict.csv'
    );
    cy.wait(2000);
    cy.get('[data-testid="prediction-item"]')
      .filter(`:contains("${predictionName}")`)
      .should('exist');
    cy.get('[data-testid="prediction-item"]')
      .filter(`:contains("${predictionName}")`)
      .contains('Done', {
        timeout: 600000,
      });
  });

  it('delete Prediction', () => {
    deletePrediction(predictionName);
    cy.get('[data-testid="prediction-table"]').should(
      'not.contain',
      predictionName
    );
  });

  it('delete Solution', () => {
    cy.visit('/#/solutions');
    deleteSolution(solutionName);
    cy.get('[data-testid="solution-table"]').should(
      'not.contain',
      solutionName
    );
  });

  it('delete a Databag', () => {
    cy.visit('/#/databags');
    cy.wait(2000);
    deleteDatabag(databagName);
    cy.get('[data-testid="databags-page"]').should('not.contain', databagName);
  });
});
