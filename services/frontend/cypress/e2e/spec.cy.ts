describe('Databags', () => {

  beforeEach('login', () => {
    cy.visit('/');
    cy.get('#username').clear('us');
    cy.get('#username').type('user@example.com');
    cy.get('#password').clear();
    cy.get('#password').type('12341234');
    cy.get('#kc-login').click();
    cy.wait(1000);
  });
  afterEach('logout', () => {
    cy.visit('/logout');
    cy.get('#kc-logout').click();
    cy.get('#kc-page-title').contains('You are logged out');
  });
  it('add initial databag', () => {
    let remainingAttempts = 1000;
    function waitUntilElementExists(el: string) {
      const $element = Cypress.$(el);
      if ($element.length) {
          return $element;
      }

      if (--remainingAttempts) {
          cy.log('Element not found yet. Remaining attempts: ' + remainingAttempts);
          cy.reload();
          return cy.wait(2000).then(() => waitUntilElementExists(el));
      }
      throw Error('Element was not found.');
    }
    cy.visit('/databag');
    waitUntilElementExists('#add-databag-button-empty');
    cy.wait(60000);
    cy.get('[id=\'add-databag-button-empty\']', { timeout: 600000 }).click();
    cy.get('[id=\'file-input\']').invoke('show').selectFile('cypress/fixtures/titanic.xls');
    cy.get('[id=\'add-databag-main-button\']').click();
    cy.get('.mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix', { timeout: 600000 }).get('.mat-select-min-line ', { timeout: 600000 }).contains('category');
    cy.get('.mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').get('.mat-select-min-line ').contains('category');
    cy.get('.mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').get('.mat-select-min-line ').contains('text');
    cy.get('#define-databag-button').click();
    cy.wait(2000);
  });
  it('train ludwig solution', () => {
    cy.visit('/dashboard');
    cy.get('.ng-star-inserted > .mat-list-item-content > .nav-item-extended').click();
    cy.get('#add-solution-button-empty > .mat-button-wrapper').click();
    cy.get('#define-output-list > :nth-child(1) > .mat-list-item-content').click();
    cy.get('#define-output-next-button').click();
    cy.get('#define-solver-name-input').clear('S');
    cy.get('#define-solver-name-input').type('Solution Test Ludwig Solver');
    cy.get('#define-solver-list > .mat-list-item-content').click();
    cy.get('#define-solver-next-button > .mat-button-wrapper').click();
    cy.get('[id=\'solution-status-finished\']', { timeout: 600000 }).contains('Solver finished', { timeout: 600000 });
  });
});
