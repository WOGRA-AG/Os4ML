import {
  createDatabag,
  createSolution,
  deleteDatabag,
  deleteSolution,
} from '../utils/e2e.utils';
import { login, logout } from '../utils/e2e.login';

const inputTimeout = 1000;
const databagName = `e2e databag ${new Date().toISOString()}`;
const solutionName = `e2e solutionName ${new Date().toISOString()}`;
let updatedDatabagName: string;
let updatedSolutionName: string;

beforeEach('login', () => {
  login();
});

after('logout', () => {
  logout();
});

before(() => {
  updatedDatabagName = `updated ${databagName}`;
  updatedSolutionName = `updated ${solutionName}`;
});
beforeEach(() => {
  cy.visit('/#/solutions');
  cy.wait(2000);
});

describe('Solutions Page', () => {
  it('add a Databag xls', () => {
    createDatabag(databagName, 'cypress/fixtures/titanic.xls');
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${databagName}")`)
      .should('exist');
  });

  it('add Solution', () => {
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${databagName}")`, { timeout: 500 })
      .click();
    createSolution(solutionName);
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${solutionName}")`)
      .should('exist');
  });

  it('change Solution name', () => {
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${solutionName}")`)
      .find('[data-testid="solution-settings-button"]')
      .click();
    cy.get('#mat-input-0').clear({ timeout: inputTimeout });
    cy.get('#mat-input-0').type(updatedSolutionName, {
      timeout: inputTimeout,
    });
    cy.get('[data-testid="solution-update-button"]').click();
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${updatedSolutionName}")`)
      .should('exist');
  });

  it('create Pridiction', () => {
    // cy.get('[data-testid="solution-item"]')
    //   .filter(`:contains("${solutionName}")`)
    //   .find('[data-testid="create-prediction-button"]')
    //   .click();
    // cy.get('#dataset-name-input').clear({ force: true });
    // cy.get('#dataset-name-input').type('pred', { force: true });
    // cy.get('#file-input')
    //   .invoke('show')
    //   .selectFile('cypress/fixtures/titanic_predict.csv');
    // cy.get('#predict-dialog-button').click();
    //
    // cy.get('#download-prediction-result-link', {
    //   timeout: 300000,
    // }).should('have.text', ' Download Result ');
    // cy.get('#predict-dialog-button').click();
    // const downloadedFile = `${Cypress.config(
    //   'downloadsFolder'
    // )}/prediction_result.csv`;
    // cy.readFile(downloadedFile, 'binary', { timeout: 300000 }).should(
    //   buffer => expect(buffer.length).to.be.gt(100)
    // );
    // cy.get('#close-create-prediction-dialog-button').click();
    // cy.get('#predictions-page-link-button').click();
    // cy.get('.prediction-list-item > :nth-child(1) > :nth-child(2)').should(
    //   'have.text',
    //   'pred'
    // );
  });

  it('delete Solution', () => {
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${databagName}")`)
      .click();
    deleteSolution(updatedSolutionName);
    cy.get('[data-testid="solution-page"]').should(
      'not.contain',
      updatedSolutionName
    );
  });

  it('delete a Databag', () => {
    cy.visit('/#/databags');
    cy.wait(2000);
    deleteDatabag(databagName);
    cy.get('[data-testid="databag-page"]').should('not.contain', databagName);
  });
});
