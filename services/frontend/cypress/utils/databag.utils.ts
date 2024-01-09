import {
  TIMEOUT_LONG,
  handleA11yViolations,
  TIMEOUT_SHORT,
  isMobile,
} from './e2e.utils';

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

export function setupDatabag(databagItem: CreateDatabagForm): void {
  cy.wait(TIMEOUT_SHORT);
  cy.get('[data-testid="databag-table"]', { timeout: TIMEOUT_LONG })
    .should('exist')
    .then(() => {
      cy.get('body').then($body => {
        if ($body.find('[data-testid="databag-item"]').length > 0) {
          cy.get('[data-testid="databag-item"]').then($items => {
            const itemExists = $items
              .toArray()
              .some(item => item.innerText.includes(databagItem.name));
            if (!itemExists) {
              createDatabag(databagItem);
            }
          });
        } else {
          createDatabag(databagItem);
        }
      });
    });
}

export function createDatabag({ name, fixtureFilename }: CreateDatabagForm) {
  if (isMobile(name)) cy.viewport(430, 930);
  cy.findAllByTestId('add-databag', { timeout: TIMEOUT_LONG })
    .parent()
    .should('not.be.disabled')
    .findByTestId('add-databag')
    .click();
  cy.findByTestId('databag-create-dialog', {
    timeout: TIMEOUT_LONG,
  }).should('be.visible');
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);

  cy.findByTestId('input-name').clear().type(name);
  cy.findByTestId('file-input').invoke('show').selectFile(fixtureFilename);
  cy.findByTestId('submit-databag').click();
  cy.findByTestId('finish-upload', { timeout: TIMEOUT_LONG })
    .should('not.be.disabled')
    .click();
}

export function checkDatabag(name: string) {
  if (isMobile(name)) cy.viewport(430, 930);
  cy.findAllByTestId('databag-item', { timeout: TIMEOUT_LONG })
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
  if (isMobile(name)) cy.viewport(430, 930);
  goToDetailPage(name);
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
  if (isMobile(name)) cy.viewport(430, 930);
  goToDetailPage(name);
  cy.findByTestId('databag-delete-button').click();
  cy.findByTestId('confirm-popup-button').click();

  cy.visit('/#/databags');
  cy.findAllByText(name).should('have.length', 0);
}
export function goToDetailPage(name: string) {
  cy.findAllByTestId('databag-item', { timeout: TIMEOUT_LONG })
    .filter(`:contains("${name}")`)
    .findByTestId('databag-menu', { timeout: TIMEOUT_LONG })
    .click();
  cy.findByTestId('databag-detail-button', { timeout: TIMEOUT_LONG }).click();
  cy.wait(1000);
  cy.url().should('include', '/databags/detail');
  cy.findByTestId('databag-detail-page', { timeout: TIMEOUT_LONG }).should(
    'be.visible'
  );
}

//export function cleanUpDatabag(name: string) {}
