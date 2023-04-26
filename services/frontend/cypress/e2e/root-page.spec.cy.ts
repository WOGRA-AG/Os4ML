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
afterEach('logout', () => {
  logout();
});

describe('Root Page', () => {
  it('regression with fastlane', () => {
    cy.visit('/solutions');

    cy.get('#get-started-button').click();
    cy.get('#dataset-name-input').clear();
    cy.get('#dataset-name-input').type(databagName);
    cy.get('#file-input')
      .invoke('show')
      .selectFile('cypress/fixtures/titanic.xls');
    cy.get('#add-databag-main-button').click();
    cy.get(
      '#cdk-step-content-0-1 > .mat-mdc-dialog-content > app-dialog-section > .dialog-element > :nth-child(3) > div'
    ).should('have.text', ' What do you want to predict? ');
    cy.get(
      ':nth-child(4) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container > .mat-subtitle-2',
      { timeout: databagTimeout }
    ).should('have.text', ' numerical ');
    cy.get(
      ':nth-child(4) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container'
    ).click();
    cy.get('#add-databag-main-button').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type(solutionName);
    cy.wait(standardTimeout);
    cy.get(
      'app-choose-solver > app-selectable-list > .mat-mdc-list > .mat-mdc-list-item > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container'
    ).click();
    cy.wait(standardTimeout);
    cy.get('#add-databag-main-button').click();

    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${databagName}")`, { timeout: 500 })
      .click();
    cy.get('[data-testid="solution-status-indicator"]').contains('Done', {
      timeout: solutionTimeout,
    });

    deleteSolution(solutionName);
    cy.visit('/databags');
    deleteDatabag(databagName);
  });
});
