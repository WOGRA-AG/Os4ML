//reference path="../../node_modules/cypress/types/net-stubbing.d.ts"/>

import { createDatabag, deleteDatabag } from '../utils/e2e.utils';
import { login, logout } from '../utils/e2e.login';

const databagTimeout = 1000000;
const solutionTimeout = 600000;
const predictionTimeout = 300000;
const deleteTimeout = 5000;
const downloadTimeout = 15000;
const inputTimeout = 1000;
const standardTimeout = 1000;
const databagName = `e2e databag ${new Date().toISOString()}`;
const solutionName = `e2e solutionName ${new Date().toISOString()}`;
let updatedDatabagName: string;
let updatedSolutionName: string;

beforeEach('login', () => {
  updatedDatabagName = `updated ${databagName}`;
  updatedSolutionName = `updated ${solutionName}`;
  login();
});

after('logout', () => {
  logout();
});
beforeEach(() => {
  cy.visit('/#/databags');
  cy.wait(2000);
});

describe('Databags Page', () => {
  it('verify documentation link', () => {
    const documentationUrl = 'https://wogra-ag.github.io/os4ml-docs/';
    cy.get('[data-testid="add-databag"]', { timeout: 500 }).click();
    cy.get('[data-testid="documentation-link"]').should(
      'have.attr',
      'href',
      documentationUrl
    );
    cy.get('[data-testid="documentation-link"]').should(
      'have.attr',
      'target',
      '_blank'
    );
    cy.get('[data-testid="close-button"]').click();
    cy.get('[data-testid="create-solution-stepper"]').should('not.exist');
  });

  it('add a Databag xls', () => {
    createDatabag(databagName, 'cypress/fixtures/titanic.xls');
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${databagName}")`)
      .should('exist');
  });

  it('change Databag name', () => {
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${databagName}")`)
      .find('[data-testid="databag-settings-button"]')
      .click();
    cy.get('#mat-input-0').clear({ timeout: inputTimeout });
    cy.get('#mat-input-0').type(updatedDatabagName, {
      timeout: inputTimeout,
    });
    cy.get('#update-databag-button').click();
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${updatedDatabagName}")`)
      .should('exist');
  });

  it('delete a Databag', () => {
    deleteDatabag(updatedDatabagName);
    cy.get('[data-testid="databag-page"]').should('not.contain', databagName);
  });

  it('add a Databag dataframe script', () => {
    updatedDatabagName = databagName + ' dataframe script';
    createDatabag(updatedDatabagName, 'cypress/fixtures/dataframe_script.py');
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${updatedDatabagName}")`)
      .should('exist');
  });

  it('delete a Databag dataframe script', () => {
    updatedDatabagName = databagName + ' dataframe script';
    deleteDatabag(updatedDatabagName);
    cy.get('[data-testid="databag-page"]').should(
      'not.contain',
      updatedDatabagName
    );
  });
});
// it('download model', () => {
//
// });
//
// it('add prediction', () => {
//
// });
//
// it('add a Databag tif', () => {
//
// });
//
// it('add a Databag url', () => {
//
// });
//
// it('add a Databag mnist', () => {
//
// });
//
// it('add a Databag mnist', () => {
//
// });
//
