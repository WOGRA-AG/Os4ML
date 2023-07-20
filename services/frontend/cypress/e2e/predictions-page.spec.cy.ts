import {
  createDatabag, createPrediction,
  createSolution,
  deleteDatabag, deletePrediction,
  deleteSolution,
} from '../utils/e2e.utils';
import { login, logout } from '../utils/e2e.login';
// @ts-ignore
const path = require('path');

const inputTimeout = 1000;
const databagName = `e2e databag ${new Date().toISOString()}`;
const solutionName = `e2e solutionName ${new Date().toISOString()}`;
const predictionName = `e2e predictionName ${new Date().toISOString()}`;
let updatedDatabagName: string;
let updatedSolutionName: string;

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
    createPrediction(predictionName, solutionName, 'cypress/fixtures/titanic_predict.csv');
    cy.wait(2000);
    cy.get('[data-testid="prediction-item"]')
      .filter(`:contains("${predictionName}")`)
      .should('exist');
    cy.get('[data-testid="prediction-item"]')
      .filter(`:contains("${predictionName}")`)
      .contains('Done', {
        timeout: 600000,
      });


    // cy.get('[data-testid="solution-item"]')
    //   .filter(`:contains("${updatedSolutionName}")`)
    //   .find('[data-testid="solution-settings-button"]')
    //   .click();

    // cy.get('#create-prediction-button').click();
    // cy.get('#dataset-name-input').clear({ force: true });
    // cy.get('#dataset-name-input').type(predictionName, { force: true });
    // cy.get('#file-input')
    //   .invoke('show')
    //   .selectFile('cypress/fixtures/titanic_predict.csv');
    // cy.get('#predict-dialog-button').click();
    //
    // cy.get('[data-testid="prediction-item"]')
    //   .filter(`:contains("${predictionName}")`)
    //   .should('exist');
    // cy.wait(60000);
    // cy.get('[data-testid="prediction-item"]')
    //   .filter(`:contains("${predictionName}")`)
    //   .contains('Done', {
    //     timeout: 600000,
    //   });
    //
    // cy.get('[data-testid="prediction-item"]')
    //   .filter(`:contains("${predictionName}")`)
    //   .find('[data-testid="prediction-download-button"]')
    //   .click();
    //
    // const downloadedFile = path.join(
    //   Cypress.config('downloadsFolder'),
    //   'prediction_result.csv'
    // );
    // cy.readFile(downloadedFile, 'binary', { timeout: 300000 }).should(buffer =>
    //   expect(buffer.length).to.be.gt(100)
    // );
  });

  it('delete Prediction', () => {
    deletePrediction(predictionName);
    cy.get('[data-testid="prediction-table"]')
      .should('not.contain', predictionName);
  });

  it('delete Solution', () => {
    cy.visit('/#/solutions');
    deleteSolution(solutionName);
    cy.get('[data-testid="solution-table"]')
      .should('not.contain', solutionName);
  });

  it('delete a Databag', () => {
    cy.visit('/#/databags');
    cy.wait(2000);
    deleteDatabag(databagName);
    cy.get('[data-testid="databag-page"]')
      .should('not.contain', databagName);
  });
});
