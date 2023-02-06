describe('Databags', () => {
  const databagTimeout = 600000;
  const solutionTimeout = 600000;
  const deleteTimeout = 5000;
  const downloadTimeout = 15000;

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
    function waitUntilElementExists(el: string): any {
      const $element = Cypress.$(el);
      if ($element.length) {
        return $element;
      }

      if (--remainingAttempts) {
        cy.log(
          'Element not found yet. Remaining attempts: ' + remainingAttempts
        );
        cy.reload();
        return cy.wait(2000).then(() => waitUntilElementExists(el));
      }
      throw Error('Element was not found.');
    }
    cy.visit('/databag');
    waitUntilElementExists('#add-databag-button-empty');
    cy.get('#add-databag-button-empty > .mat-button-wrapper').click();
    cy.get('#mat-input-0').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('e2e test databag');
    cy.get('#file-input')
      .invoke('show')
      .selectFile('cypress/fixtures/titanic.xls');
    cy.get('#add-databag-main-button').click();
    cy.get(
      '.mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix',
      { timeout: databagTimeout }
    )
      .get('.mat-select-min-line ', { timeout: databagTimeout })
      .contains('category');
    cy.get(
      '.mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix'
    )
      .get('.mat-select-min-line ')
      .contains('category');
    cy.get(
      '.mat-form-field > .mat-form-field-wrapper > .mat-form-field-flex > .mat-form-field-infix'
    )
      .get('.mat-select-min-line ')
      .contains('text');
    cy.get('#define-databag-button').click();
    cy.wait(2000);
  });

  it('train ludwig solution', () => {
    cy.visit('/dashboard');
    cy.get('#add-solution-button-empty > .mat-button-wrapper').click();
    cy.get(
      'app-choose-databag-column > .mat-list > :nth-child(1) > .mat-list-item-content'
    ).click();
    cy.get('#define-output-next-button').click();
    cy.get('#define-solver-name-input').clear();
    cy.get('#define-solver-name-input').type('e2e test ludwig solver');
    cy.get(
      'app-choose-solver > .mat-list > .mat-list-item > .mat-list-item-content'
    ).click();
    cy.get('#define-solver-next-button').click();
    cy.get('.status-column > .done', { timeout: solutionTimeout });
  });

  it('download model', () => {
    cy.visit('/dashboard');
    cy.get('.solution-list-item > :nth-child(3)').click();
    cy.get('.ng-star-inserted > .mat-button-wrapper').should('be.visible');
    cy.get('.mat-dialog-actions > .ng-star-inserted').should('be.enabled');
    cy.get('.mat-dialog-actions > .ng-star-inserted').should(
      'have.attr',
      'color',
      'primary'
    );
    // do not use electron for local testing, as it can't open a new tab for download
    cy.get('.ng-star-inserted > .mat-button-wrapper').click();
    const downloadedFile = `${Cypress.config(
      'downloadsFolder'
    )}/model.os4ml.zip`;
    cy.readFile(downloadedFile, 'binary', { timeout: downloadTimeout }).should(
      buffer => expect(buffer.length).to.be.gt(1000)
    );
  });

  it('rename databag', () => {
    cy.visit('/databag');
    cy.get(
      '.sidenav-container > :nth-child(1) > .mat-nav-list > :nth-child(2) > .mat-list-item-content'
    ).click();
    cy.get('.databag-list-item > :nth-child(2)').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('renamed-titanic.xls');
    cy.get(
      '.mat-dialog-actions > .mat-raised-button > .mat-button-wrapper'
    ).click();
    cy.get(':nth-child(1) > .mat-body-2').should(
      'have.text',
      'renamed-titanic.xls'
    );
  });

  it('rename solution', () => {
    cy.visit('/dashboard');
    cy.get(
      '.ng-star-inserted > .mat-list-item-content > .nav-item-extended'
    ).click();
    cy.get('.solution-list-item > :nth-child(3)').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('Renamed Solution');
    cy.get(
      '.mat-dialog-actions > [type="submit"] > .mat-button-wrapper'
    ).click();
    cy.get('.solution-list-item > :nth-child(1) > .mat-body-2').should(
      'have.text',
      'Renamed Solution'
    );
  });

  it('delete solution', () => {
    cy.visit('/dashboard');
    cy.get('.mat-subheading-2').click();
    cy.get('.solution-list-item > :nth-child(1)').click();
    cy.get('#mat-dialog-title-0').should('be.visible');
    cy.get('.delete-button > .mat-button-wrapper')
      .should('be.visible')
      .wait(deleteTimeout)
      .click();
    cy.get(
      '#mat-dialog-1 > app-dialog-dynamic.ng-star-inserted > .ng-star-inserted > .mat-dialog-actions > .mat-stroked-button > .mat-button-wrapper'
    )
      .should('be.visible')
      .wait(deleteTimeout)
      .click();
  });

  it('delete databag', () => {
    cy.visit('/dashboard');
    cy.get(':nth-child(2) > .mat-list-item-content > .nav-caption').click();
    cy.get('.databag-list-item > :nth-child(1)').click();
    cy.get('#mat-dialog-title-0').should('be.visible');
    cy.get('.mat-stroked-button > .mat-button-wrapper')
      .should('be.visible')
      .wait(deleteTimeout)
      .click();
    cy.get(
      '#mat-dialog-1 > app-dialog-dynamic.ng-star-inserted > .ng-star-inserted > .mat-dialog-actions > .mat-stroked-button > .mat-button-wrapper'
    )
      .should('be.visible')
      .wait(deleteTimeout)
      .click();
  });

  it('regression with fastlane', () => {
    cy.visit('/dashboard');
    cy.get(
      '.support-card > .mat-focus-indicator > .mat-button-wrapper'
    ).click();
    cy.get('#mat-input-1').clear();
    cy.get('#mat-input-1').type('Fastlane Databag');
    cy.get('#file-input')
      .invoke('show')
      .selectFile('cypress/fixtures/titanic.xls');
    cy.get('.mat-button-wrapper > .ng-star-inserted').click();
    cy.get(
      '#cdk-step-content-0-1 > .mat-dialog-content > app-dialog-section > .dialog-element > :nth-child(3) > div'
    ).should('have.text', 'What do you want to predict?');
    cy.get(
      'app-choose-databag-column > .mat-list > :nth-child(1) > .mat-list-item-content',
      { timeout: databagTimeout }
    ).click();
    cy.get('#add-databag-main-button').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('e2e fast lane solution');
    cy.get(
      'app-choose-solver > .mat-list > .mat-list-item > .mat-list-item-content'
    ).click();
    cy.get('.mat-button-wrapper > .ng-star-inserted').click();
    cy.get('.status-column > .done', { timeout: solutionTimeout });
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('dataframe script', () => {
    cy.get('#bag-list > :nth-child(2) > .mat-list-item-content').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('e2e dataframe script');
    cy.get('#file-input')
      .invoke('show')
      .selectFile('cypress/fixtures/dataframe_script.py');
    cy.get('#add-databag-main-button > .mat-button-wrapper').click();
    cy.wait(1000);
    cy.get('#mat-select-value-1', { timeout: databagTimeout }).should(
      'have.text',
      'numerical'
    );
    cy.get('#define-databag-button > .mat-button-wrapper').click();
    cy.get(
      ':nth-child(1) > .mat-list-item-content > .nav-item-extended > .mat-subheading-2'
    ).should('have.text', 'e2e dataframe script');
    cy.wait(1000);
    cy.get(
      ':nth-child(1) > .mat-list-item-content > .nav-item-extended'
    ).click();
    cy.wait(1000);
    cy.get('#add-solution-button-empty > .mat-button-wrapper').click();
    cy.wait(1000);
    cy.get(
      'app-choose-databag-column > .mat-list > :nth-child(1) > .mat-list-item-content > app-list-item > div > .on-surface-high'
    ).should('have.text', ' PassengerId ');
    cy.get(
      'app-choose-databag-column > .mat-list > :nth-child(1) > .mat-list-item-content > app-list-item > div > .mat-subheading-2'
    ).should('have.text', 'numerical');
  });
});
