import { login, logout } from '../utils/e2e.utils';

describe('Root Page', () => {
  before('Prepare data for tests', () => {
    login();
  });

  after('Clean up', () => {
    logout();
  });

  beforeEach(() => {
    cy.visit('/');
    cy.wait(1000);
  });

  it('Test link databags page', () => {
    cy.findByTestId('databags-page-link').click();
    cy.url().should('include', '/databags');
    cy.findByTestId('databags-page').should('be.visible');
  });

  it('Test link solutions page', () => {
    cy.findByTestId('solutions-page-link').click();
    cy.url().should('include', '/solutions');
    cy.findByTestId('solutions-page').should('be.visible');
  });

  it('Test link predictions page', () => {
    cy.findByTestId('predictions-page-link').click();
    cy.url().should('include', '/predictions');
    cy.findByTestId('predictions-page').should('be.visible');
  });

  it('Test link transfer learning page', () => {
    cy.findByTestId('transfer-learning-page-link').click();
    cy.url().should('include', '/transfer-learning');
    cy.findByTestId('transfer-learning-page').should('be.visible');
  });
});
