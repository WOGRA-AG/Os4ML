import { TIMEOUT_LONG, handleA11yViolations } from './e2e.utils';

export type CreateDatabagForm = {
  name: string;
  fixtureFilename: string;
};

export function visitDatabagPage() {
  cy.visit('/#/databags');
  cy.findByTestId('databags-page', { timeout: TIMEOUT_LONG }).should(
    'be.visible'
  );
}

export function createDatabag({ name, fixtureFilename }: CreateDatabagForm) {
  cy.findByTestId('add-databag').click();

  cy.checkA11y(undefined, undefined, handleA11yViolations, true);

  cy.findByTestId('input-name').clear().type(name);
  cy.findByTestId('file-input').invoke('show').selectFile(fixtureFilename);
  cy.findByTestId('submit-databag').click();
  cy.findByTestId('finish-upload', { timeout: TIMEOUT_LONG })
    .should('not.be.disabled')
    .click();
}

export function checkDatabag(name: string) {
  cy.findAllByTestId('databag-item')
    .filter(`:contains("${name}")`)
    .should('exist');

  cy.findAllByTestId('databag-item')
    .filter(`:contains("${name}")`)
    .contains('Done', {
      timeout: TIMEOUT_LONG,
    });

  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
}
export function changeDatabagName(name: string, newName: string): void {
  cy.findAllByTestId('databag-item', { timeout: TIMEOUT_LONG })
    .filter(`:contains("${name}")`)
    .findByTestId('databag-detail-button')
    .click();
  cy.url().should('include', '/databags/detail');
  cy.findByTestId('databag-detail-page').should('be.visible');
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.findByTestId('databag-rename-button').click();
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.findByTestId('popup-input-field').focus().clear();
  cy.findByTestId('popup-input-field').type(newName);
  cy.findByTestId('popup-input-submit').click();
  cy.go('back');

  cy.findAllByTestId('databag-item')
    .filter(`:contains("${newName}")`)
    .should('exist');
}

export function deleteDatabag(name: string) {
  cy.visit('/#/databags');

  cy.findAllByTestId('databag-item', { timeout: TIMEOUT_LONG })
    .filter(`:contains("${name}")`)
    .findByTestId('databag-detail-button')
    .click();

  cy.findByTestId('databag-delete-button').children().click();
  cy.findByTestId('confirm-popup-button').click();

  cy.visit('/#/databags');
  cy.findAllByText(name).should('have.length', 0);
}
