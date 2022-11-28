describe('Databags', () => {

  beforeEach('login', () => {
    cy.viewport(1280, 720)
    cy.visit('/');
    cy.get(':nth-child(1) > .pure-material-textfield-outlined > span').click();
    cy.get('#username').clear('us');
    cy.get('#username').type(Cypress.env('TEST_USER'));
    cy.get(':nth-child(2) > .pure-material-textfield-outlined > span').click();
    cy.get('#password').clear();
    cy.get('#password').type(Cypress.env('TEST_PASSWORD'));
    cy.get('#kc-login > span').click();
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
    cy.get('.status-column > .done', { timeout: 600000});
  });
  it('download model', () => {
    cy.visit('/dashboard');
    cy.get('.ng-star-inserted > .mat-list-item-content > .nav-item-extended').click();
    cy.get(':nth-child(1) > .mat-body-2').click();
    cy.get('.ng-star-inserted > .mat-button-wrapper').click();
    cy.window().then((win) => { setTimeout(() => { win.location.reload(); },10000); });
    cy.readFile('cypress/downloads/model.os4ml.zip', { timeout: 15000 });
  });
  it('rename databag', () => {
    cy.visit('/dashboard');
    cy.get(':nth-child(2) > .mat-list-item-content > .nav-caption').click();
    cy.get(':nth-child(2) > .mat-body-2').click();
    cy.get('#mat-input-0').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('renamed-titanic.xls');
    cy.get('.mat-dialog-actions > .mat-raised-button > .mat-button-wrapper').click();
    cy.get(':nth-child(1) > .mat-body-2').should('have.text', 'renamed-titanic.xls');
  });
  it('rename solution', () => {
    cy.visit('/dashboard');
    cy.get('.mat-subheading-2').click();
    cy.get(':nth-child(2) > .mat-body-2').click();
    cy.get('#mat-input-0').clear('R');
    cy.get('#mat-input-0').type('Rename Solution');
    cy.get('[type="submit"] > .mat-button-wrapper').click();
    cy.get(':nth-child(1) > .mat-body-2').should('have.text', 'Rename Solution');
  });
  it('delete solution', () => {
    cy.visit('/dashboard');
    cy.get('.mat-subheading-2').click();
    cy.wait(5);
    cy.get(':nth-child(1) > .mat-body-2').click();
    cy.wait(5);
    cy.get('.delete-button').click();
    cy.wait(5);
    cy.get('#mat-dialog-1 > app-dialog-dynamic.ng-star-inserted > .ng-star-inserted > .mat-dialog-actions > .mat-stroked-button > .mat-button-wrapper').click();
  });
  it('delete databags', () => {
    cy.visit('/dashboard');
    cy.get(':nth-child(2) > .mat-list-item-content > .nav-caption').click();
    cy.wait(5);
    cy.get(':nth-child(1) > .mat-body-2').click();
    cy.wait(5);
    cy.get('.delete-button').click();
    cy.wait(5);
    cy.get('#mat-dialog-1 > app-dialog-dynamic.ng-star-inserted > .ng-star-inserted > .mat-dialog-actions > .mat-stroked-button > .mat-button-wrapper').click();
    cy.get('h5').should('have.text', 'Get started with Machine Learning');
  });
  it('fastlane', () => {
    cy.visit('/dashboard');
    cy.get('.support-card > .mat-focus-indicator > .mat-button-wrapper').click();
    cy.get('#mat-input-0').clear('F');
    cy.get('#mat-input-0').type('Fastlane Databag');
    cy.get('[id=\'file-input\']').invoke('show').selectFile('cypress/fixtures/titanic.xls');
    cy.get('[id=\'add-databag-main-button\']').click();
    cy.get('#cdk-step-content-0-1 > .mat-dialog-content > app-shared-dialog-section > .dialog-element > .dialog-element-content > .mat-list > :nth-child(1) > .mat-list-item-content', { timeout: 600000}).click();
    cy.get('.mat-button-wrapper > .ng-star-inserted').click();
    cy.get('#mat-input-2').clear('F');
    cy.get('#mat-input-2').type('Fastlane Solution');
    cy.get('.mat-button-wrapper > .ng-star-inserted').click();
    cy.get('#define-solver-list > .mat-list-item-content', { timeout: 600000}).click();
    cy.get('.active > .mat-list-item-content > .nav-caption').click();
    cy.get('.mat-overline').click();
    cy.get('.status-column > .done', { timeout: 600000});
  });
});
