///<reference path="../utils/e2e.utils.ts"/>
import { deleteDatabag, deleteSolution } from '../utils/e2e.utils';
import { login, logout } from '../utils/e2e.login';

const databagName = `e2e Fastlane databag ${new Date().toISOString()}`;
const solutionName = `e2e Fastlane solutionName ${new Date().toISOString()}`;
const databagTimeout = 1000000;
const standardTimeout = 1000;
const solutionTimeout = 600000;

beforeEach('login', () => {
  login();
});

after('logout', () => {
  logout();
});

beforeEach(() => {
  cy.visit('/');
  cy.wait(2000);
});

describe('Root Page', () => {
  it('Test link databag-page', () => {
    cy.get('[data-testid=databags-page-link]').click();
    cy.url().should('include', '/databags');
    cy.get('[data-testid="databag-page"]').should('be.visible');
  });

  it('Test link solutions-page', () => {
    cy.get('[data-testid=solutions-page-link]').click();
    cy.url().should('include', '/solutions');
    cy.get('[data-testid="solutions-page"]').should('be.visible');
  });

  it('Test link predictions-page', () => {
    cy.get('[data-testid=predictions-page-link]').click();
    cy.url().should('include', '/predictions');
    cy.get('[data-testid="predictions-page"]').should('be.visible');
  });

  it('regression with fastlane', () => {
    cy.get('[data-testid=open-getting-started-dialog]').click();
    cy.get('#dataset-name-input').clear();
    cy.get('#dataset-name-input').type(databagName);
    cy.get('#file-input')
      .invoke('show')
      .selectFile('cypress/fixtures/titanic.xls');
    cy.get('#add-databag-main-button').click();
    cy.get(
      '#cdk-step-content-0-1 > .mat-mdc-dialog-content > app-dialog-section > .dialog-element > :nth-child(3) > div'
    ).should('have.text', ' What do you want to predict? ');
    cy.wait(2000);
    cy.get(
      ':nth-child(4) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container > .mat-subtitle-2',
      { timeout: databagTimeout }
    ).should('have.text', ' numerical ');
    cy.get(
      ':nth-child(4) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container'
    ).click();
    cy.get('#add-databag-main-button').click();
    cy.wait(2000);
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type(solutionName);
    cy.wait(standardTimeout);
    cy.get(
      'app-choose-solver > app-selectable-list > .mat-mdc-list > .mat-mdc-list-item > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container'
    ).click();
    cy.wait(standardTimeout);
    cy.get('#add-databag-main-button').click();

    cy.wait(standardTimeout);

    cy.visit('/solutions');
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${solutionName}")`)
      .should('exist');
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${solutionName}")`)
      .contains('Done', {
        timeout: 600000,
      });

    deleteSolution(solutionName);
    cy.visit('/#/databags');
    cy.wait(standardTimeout);

    deleteDatabag(databagName);
  });
});
