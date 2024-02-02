import {isMobileMode, login, logout} from '../utils/e2e.utils';

describe('Root Page', () => {
  after('Clean up', () => {
    logout();
  });

  beforeEach(() => {
    login();
    cy.visit('/');
    cy.wait(1000);
  });

  const testPageLink = (testId: string, url: string) => {
    it(`Test link ${url} page`, () => {
      if(isMobileMode()) {
        cy.findByTestId('hamburger-button').find('button').click();
      }
      cy.findByTestId(testId).click();
      cy.url().should('include', `/${url}`);
      cy.findByTestId(`${url}-page`).should('be.visible');
    });
  };

  testPageLink('databags-page-link', 'databags');
  testPageLink('solutions-page-link', 'solutions');
  testPageLink('predictions-page-link', 'predictions');
  testPageLink('transfer-learning-page-link', 'transfer-learning');

});
