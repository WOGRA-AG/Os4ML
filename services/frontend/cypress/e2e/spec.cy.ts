describe('Databags', () => {
  beforeEach('login', () => {
    cy.viewport(1280, 720);
    cy.visit('/');
    cy.get(':nth-child(1) > .pure-material-textfield-outlined > span').click();
    cy.get('#username').clear();
    // add username to run locally
    cy.get('#username').type(Cypress.env('TEST_USER'));
    cy.get(':nth-child(2) > .pure-material-textfield-outlined > span').click();
    cy.get('#password').clear();
    // add password to run locally
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
    // @ts-ignore
    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
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
    // eslint-disable-next-line max-len
    cy.get('.mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix', { timeout: 600000 }).get('.mat-select-min-line ', { timeout: 600000 }).contains('category');
    // eslint-disable-next-line max-len
    cy.get('.mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix').get('.mat-select-min-line ').contains('category');
    // eslint-disable-next-line max-len
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
    cy.get('#define-solver-name-input').clear();
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
    cy.visit('/databag');
    cy.get('.sidenav-container > :nth-child(1) > .mat-nav-list > :nth-child(2) > .mat-list-item-content').click();
    cy.get('.databag-list-item > :nth-child(2)').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('renamed-titanic.xls');
    cy.get('.mat-dialog-actions > .mat-raised-button > .mat-button-wrapper').click();
    cy.get(':nth-child(1) > .mat-body-2').should('have.text', 'renamed-titanic.xls');
  });

  it('rename solution', () => {
    cy.visit('/dashboard');
    cy.get('.ng-star-inserted > .mat-list-item-content > .nav-item-extended').click();
    cy.get('.solution-list-item > :nth-child(3)').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('Renamed Solution');
    cy.get('.mat-dialog-actions > [type="submit"] > .mat-button-wrapper').click();
    cy.get('.solution-list-item > :nth-child(1) > .mat-body-2').should('have.text', 'Renamed Solution');
  });

  it('delete solution', () => {
    cy.visit('/dashboard');
    cy.get('.mat-subheading-2').click();
    cy.get('.solution-list-item > :nth-child(1)').click();
    cy.get('#mat-dialog-title-0').should('be.visible');
    cy.get('.delete-button > .mat-button-wrapper').should('be.visible').wait(5000).click();
    // eslint-disable-next-line max-len
    cy.get('#mat-dialog-1 > app-dialog-dynamic.ng-star-inserted > .ng-star-inserted > .mat-dialog-actions > .mat-stroked-button > .mat-button-wrapper').should('be.visible').wait(5000).click();
  });

  it('delete databag', () => {
    cy.visit('/dashboard');
    cy.get(':nth-child(2) > .mat-list-item-content > .nav-caption').click();
    cy.get('.databag-list-item > :nth-child(1)').click();
    cy.get('#mat-dialog-title-0').should('be.visible');
    cy.get('.mat-stroked-button > .mat-button-wrapper').should('be.visible').wait(5000).click();
    // eslint-disable-next-line max-len
    cy.get('#mat-dialog-1 > app-dialog-dynamic.ng-star-inserted > .ng-star-inserted > .mat-dialog-actions > .mat-stroked-button > .mat-button-wrapper').should('be.visible').wait(5000).click();
  });

  it('fastlane', () => {
    cy.visit('/dashboard');
    cy.get('.support-card > .mat-focus-indicator > .mat-button-wrapper').click();
    cy.get('[id=\'file-input\']').invoke('show').selectFile('cypress/fixtures/titanic.xls');
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('Fastlane Databag');
    cy.get('.mat-button-wrapper > .ng-star-inserted').click();
    // eslint-disable-next-line max-len
    cy.get('#cdk-step-content-0-1 > .mat-dialog-content > app-shared-dialog-section > .dialog-element > :nth-child(3) > div', { timeout: 600000}).should('be.visible').should('have.text', 'What do you want to predict?');
    // eslint-disable-next-line max-len
    cy.get('#cdk-step-content-0-1 > .mat-dialog-content > app-shared-dialog-section > .dialog-element > .dialog-element-content > .mat-list > :nth-child(4) > .mat-list-item-content').click();
    cy.get('.mat-button-wrapper > .ng-star-inserted').click();
    cy.get('#mat-input-2').clear();
    cy.get('#mat-input-2').type('Fastlane Solution');
    cy.get('#define-solver-list > .mat-list-item-content').click();
    cy.get('.mat-button-wrapper > .ng-star-inserted').wait(5000).click();
    cy.get(':nth-child(1) > .mat-list-item-content > .nav-item-extended').click();
    cy.get('.status-column > .done', { timeout: 600000});
  });

});
