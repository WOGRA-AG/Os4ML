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
    cy.visit('/solutions');
    waitUntilElementExists('#add-databag-button-empty');
    cy.get('#add-databag-button-empty').click();
    cy.get('#mat-input-0').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('e2e test databag');
    cy.get('#file-input')
      .invoke('show')
      .selectFile('cypress/fixtures/titanic.xls');
    cy.get('#add-databag-main-button').click();
    cy.get(
      '.mat-mdc-form-field > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix',
      { timeout: databagTimeout }
    )
      .get('.mat-mdc-select-min-line ', { timeout: databagTimeout })
      .contains('category');
    cy.get(
      '.mat-mdc-form-field > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix'
    )
      .get('.mat-mdc-select-min-line ')
      .contains('category');
    cy.get(
      '.mat-mdc-form-field > .mat-mdc-text-field-wrapper > .mat-mdc-form-field-flex > .mat-mdc-form-field-infix'
    )
      .get('.mat-mdc-select-min-line ')
      .contains('text');
    cy.get('#define-databag-button').click();
    cy.wait(2000);
  });

  it('train ludwig solution', () => {
    cy.visit('/solutions');
    cy.get('#add-solution-button-empty').click();
    cy.get(
      'app-selectable-list.ng-star-inserted > .mat-mdc-list > :nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container > .mat-subtitle-2',
      { timeout: databagTimeout }
    ).should('have.text', ' category ');
    cy.get(
      'app-selectable-list.ng-star-inserted > .mat-mdc-list > :nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content'
    ).click();
    cy.get('#define-output-next-button').click();
    cy.get('#define-solver-name-input').clear();
    cy.get('#define-solver-name-input').type('e2e test ludwig solver');
    cy.get(
      'app-choose-solver > app-selectable-list > .mat-mdc-list > :nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content'
    ).click();
    cy.get('#define-solver-next-button').click();
    cy.get('.status-column > .done', { timeout: solutionTimeout });
  });

  it('download model', () => {
    cy.visit('/solutions');
    cy.get('.solution-list-item > :nth-child(3)').click();
    cy.get('#download-model-link').click();
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
      '.sidenav-container > :nth-child(1) > .mat-mdc-nav-list > :nth-child(2) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content'
    ).click();
    cy.get('.databag-list-item > :nth-child(2)').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('renamed-titanic.xls');
    cy.get('.mat-mdc-dialog-actions > .mdc-button--raised').click();
    cy.get(':nth-child(1) > .mat-body-2').should(
      'have.text',
      'renamed-titanic.xls'
    );
  });

  it('rename solution', () => {
    cy.visit('/solutions');
    cy.get(
      '#bag-list > :nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > .nav-item-extended'
    ).click();
    cy.get('.solution-list-item > :nth-child(1)').click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('Renamed Solution');
    cy.get('#solution-update-button').click();
    cy.get('.solution-list-item > :nth-child(1) > :nth-child(2)').should(
      'have.text',
      'Renamed Solution'
    );
  });

  it('delete solution', () => {
    cy.visit('/solutions');
    cy.get('.mat-subtitle-2').click();
    cy.get('.solution-list-item > :nth-child(1)').click();
    cy.get('.delete-button').click();
    cy.get(
      '.ng-star-inserted > app-dialog-section > .dialog-element > .dialog-element-content'
    ).should(
      'have.text',
      ' Are you sure you want to delete this solution? All data will be lost!\n'
    );
    cy.get(
      'app-popup-confirm > .mat-mdc-dialog-actions > .mdc-button--outlined'
    )
      .wait(deleteTimeout)
      .click();
    cy.wait(deleteTimeout);
    cy.get('h1.primary').should(
      'have.text',
      'Analyze your Data with Machine Learning'
    );
  });

  it('delete databag', () => {
    cy.visit('/solutions');
    cy.get('.mat-mdc-nav-list > :nth-child(2)').click();
    cy.get('.databag-list-item > :nth-child(1)').click();
    cy.get('.mdc-button--outlined').click();
    cy.get(
      '.ng-star-inserted > app-dialog-section > .dialog-element > .dialog-element-content'
    ).should(
      'have.text',
      ' Are you sure you want to delete this databag? All data will be lost!\n'
    );
    cy.get(
      'app-popup-confirm > .mat-mdc-dialog-actions > .mdc-button--outlined'
    )
      .wait(deleteTimeout)
      .click();
    cy.wait(deleteTimeout);
    cy.get('h1.primary').should(
      'have.text',
      'Get started with Machine Learning'
    );
  });

  it('regression with fastlane', () => {
    cy.visit('/solutions');
    cy.get('.support-card > .mdc-button').click();
    cy.get('#mat-input-1').clear();
    cy.get('#mat-input-1').type('Fastlane Databag');
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
    cy.get('#mat-input-0').type('fast solution');
    cy.wait(1000);
    cy.get(
      'app-choose-solver > app-selectable-list > .mat-mdc-list > .mat-mdc-list-item > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container'
    ).click();
    cy.wait(1000);
    cy.get('#add-databag-main-button').click();
    cy.get('.status-column > .done', { timeout: solutionTimeout });
  });

  it('dataframe script', () => {
    cy.get(
      '#bag-list > :last-child > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > .nav-item-extended'
    ).click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('script');
    cy.get('#file-input')
      .invoke('show')
      .selectFile('cypress/fixtures/dataframe_script.py');
    cy.get('#add-databag-main-button').click();
    cy.wait(1000);
    cy.get('#mat-select-value-1', { timeout: databagTimeout }).should(
      'have.text',
      'numerical'
    );
    cy.get('#define-databag-button').click();
    cy.get(
      ':first-child > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > .nav-item-extended > .mat-subtitle-2'
    ).should('have.text', 'script');
    cy.wait(1000);
    cy.get(
      ':nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > .nav-item-extended'
    ).click();
    cy.wait(1000);
    cy.get('#add-solution-button-empty').click();
    cy.wait(1000);
    cy.get(
      'app-selectable-list.ng-star-inserted > .mat-mdc-list > :nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container > .primary'
    ).should('have.text', ' PassengerId ');
    cy.get(
      'app-selectable-list.ng-star-inserted > .mat-mdc-list > :nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container > .mat-subtitle-2'
    ).should('have.text', ' numerical ');
  });

  it('mnist', function () {
    cy.get(
      ':last-child > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > .nav-item-extended'
    ).click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('mnist');
    cy.get('#file-input')
      .invoke('show')
      .selectFile('cypress/fixtures/mnist_test_dataset.zip');
    cy.get('#add-databag-main-button').click();
    cy.wait(1000);

    cy.get(
      '#mat-select-value-1 > .mat-mdc-select-value-text > .mat-mdc-select-min-line',
      { timeout: databagTimeout }
    ).should('have.text', 'image');
    cy.get(
      '#mat-select-value-3 > .mat-mdc-select-value-text > .mat-mdc-select-min-line',
      { timeout: databagTimeout }
    ).should('have.text', 'category');
    cy.get('#define-databag-button').click();
    cy.get(
      ':nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > .nav-item-extended > .mat-subtitle-2'
    ).should('have.text', 'mnist');
  });

  it('tif', function () {
    cy.get(
      ':last-child > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > .nav-item-extended'
    ).click();
    cy.get('#mat-input-0').clear();
    cy.get('#mat-input-0').type('tif');
    cy.get('#file-input')
      .invoke('show')
      .selectFile('cypress/fixtures/raw_data_small.zip');
    cy.get('#add-databag-main-button').click();
    cy.wait(1000);

    cy.get(
      '#mat-select-value-1 > .mat-mdc-select-value-text > .mat-mdc-select-min-line',
      { timeout: databagTimeout }
    ).should('have.text', 'image');
    cy.get(
      '#mat-select-value-3 > .mat-mdc-select-value-text > .mat-mdc-select-min-line',
      { timeout: databagTimeout }
    ).should('have.text', 'category');
    cy.get('#define-databag-button').click();
    cy.get(
      ':nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > .nav-item-extended'
    ).click();
    cy.get('#add-solution-button-empty').click();
    cy.get(
      'app-selectable-list.ng-star-inserted > .mat-mdc-list > .mat-mdc-list-item > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container'
    ).click();
    cy.get('#define-output-next-button').click();
    cy.get('#define-solver-name-input').clear();
    cy.get('#define-solver-name-input').type('tif sol');
    cy.get(
      'app-choose-solver > app-selectable-list > .mat-mdc-list > .mat-mdc-list-item > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > .list-item-container'
    ).click();
    cy.get('#define-solver-next-button').click();
    cy.get('.list-container').click();
    cy.get('.status-column > .done', { timeout: solutionTimeout });
    cy.get('#solution-status').should('have.text', ' Done ');
  });

  it('url', function () {
    cy.get(
      ':last-child > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > .nav-item-extended'
    ).click();
    cy.get('#mat-input-0', { timeout: 1000 }).clear();
    cy.get('#mat-input-0').type('url');
    cy.get('#mat-input-1', { timeout: 1000 }).clear();
    cy.get('#mat-input-1').type(
      'https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv',
      { timeout: 1000 }
    );
    cy.get('#add-databag-main-button').click();
    cy.get(
      '#mat-select-value-1 > .mat-mdc-select-value-text > .mat-mdc-select-min-line',
      { timeout: databagTimeout }
    ).should('have.text', 'numerical');
    cy.get('#define-databag-button').click();
    cy.get(
      ':nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > .nav-item-extended'
    ).click();
    cy.get('#add-solution-button-empty').click();
    cy.get(
      'app-selectable-list.ng-star-inserted > .mat-mdc-list > :nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content > app-list-item > div'
    ).should('have.text', ' PassengerId  numerical ');
  });
});
