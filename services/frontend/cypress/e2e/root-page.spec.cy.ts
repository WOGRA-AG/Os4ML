import { login, logout } from '../utils/e2e.utils';

describe('Root Page', () => {
  after('Clean up', () => {
    logout();
  });

  beforeEach(() => {
    login();
    cy.visit('/');
    cy.wait(1000);
  });

  // it('Test link databags page', () => {
  //   cy.findByTestId('databags-page-link').click();
  //   cy.url().should('include', '/databags');
  //   cy.findByTestId('databags-page').should('be.visible');
  // });
  //
  // it('Test link solutions page', () => {
  //   cy.findByTestId('solutions-page-link').click();
  //   cy.url().should('include', '/solutions');
  //   cy.findByTestId('solutions-page').should('be.visible');
  // });
  //
  // it('Test link predictions page', () => {
  //   cy.findByTestId('predictions-page-link').click();
  //   cy.url().should('include', '/predictions');
  //   cy.findByTestId('predictions-page').should('be.visible');
  // });
  //
  // it('Test link transfer learning page', () => {
  //   cy.findByTestId('transfer-learning-page-link').click();
  //   cy.url().should('include', '/transfer-learning');
  //   cy.findByTestId('transfer-learning-page').should('be.visible');
  // });
  //
  //
  // it('Test link databags page mobile', () => {
  //   changeToMobileView();
  //   cy.findByTestId('databags-page-link').click();
  //   cy.url().should('include', '/databags');
  //   cy.findByTestId('databags-page').should('be.visible');
  // });
  //
  // it('Test link solutions page mobile', () => {
  //   changeToMobileView();
  //   cy.findByTestId('solutions-page-link').click();
  //   cy.url().should('include', '/solutions');
  //   cy.findByTestId('solutions-page').should('be.visible');
  // });
  //
  // it('Test link solutions page mobile', () => {
  //   changeToMobileView();
  //   cy.findByTestId('predictions-page-link').click();
  //   cy.url().should('include', '/predictions');
  //   cy.findByTestId('predictions-page').should('be.visible');
  // })
  //
  // it('Test link transfer learning page mobile', () => {
  //   changeToMobileView();
  //   cy.findByTestId('transfer-learning-page-link').click();
  //   cy.url().should('include', '/transfer-learning');
  //   cy.findByTestId('transfer-learning-page').should('be.visible');
  // });

  const testPageLink = (testId: string, url: string) => {
    it(`Test link ${url} page`, () => {
      cy.findByTestId(testId).click();
      cy.url().should('include', `/${url}`);
      cy.findByTestId(`${url}-page`).should('be.visible');
    });
  };

  const testPageLinkInMobileView = (testId: string, url: string) => {
    it(`Test link ${url} page mobile`, () => {
      cy.viewport(430, 930);
      cy.findByTestId('hamburger-button').find('button').click();
      cy.findByTestId(testId).click();
      cy.url().should('include', `/${url}`);
      cy.findByTestId(`${url}-page`).should('be.visible');
    });
  };

  testPageLink('databags-page-link', 'databags');
  testPageLink('solutions-page-link', 'solutions');
  testPageLink('predictions-page-link', 'predictions');
  testPageLink('transfer-learning-page-link', 'transfer-learning');

  testPageLinkInMobileView('databags-page-link', 'databags');
  testPageLinkInMobileView('solutions-page-link', 'solutions');
  testPageLinkInMobileView('predictions-page-link', 'predictions');
  testPageLinkInMobileView('transfer-learning-page-link', 'transfer-learning');
});
