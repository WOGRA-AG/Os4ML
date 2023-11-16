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
  it('Test link databags-page', () => {
    cy.get('[data-testid=databags-page-link]').click();
    cy.url().should('include', '/databags');
    cy.get('[data-testid="databags-page"]').should('be.visible');
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
});
