import { TIMEOUT_LONG, handleA11yViolations, TIMEOUT_SHORT } from './e2e.utils';

export type CreateSolutionForm = {
  name: string;
  databagName: string;
  outputField?: string;
  applyTransferLearning: boolean;
};

export function visitSolutionsPage(): void {
  cy.visit('/#/solutions');
  cy.findByTestId('solutions-page', { timeout: TIMEOUT_LONG }).should(
    'be.visible'
  );
}

export function createSolution({
  name,
  databagName,
  outputField,
  applyTransferLearning,
}: CreateSolutionForm) {
  cy.findAllByTestId('add-solution', { timeout: TIMEOUT_LONG })
    .parent()
    .should('not.be.disabled')
    .findByTestId('add-solution')
    .click();
  cy.findByTestId('solution-create-dialog', {
    timeout: TIMEOUT_LONG,
  }).should('be.visible');

  cy.checkA11y(undefined, undefined, handleA11yViolations, true);

  cy.findByTestId('input-name').clear().type(name);

  cy.findByTestId('input-databagId').click();
  cy.get('mat-option').contains(databagName).click();
  cy.findByTestId('solution-create-dialog').click(0, 0, { force: true });

  cy.findByTestId('output-select-field').click();
  if (outputField) {
    cy.get('mat-option').contains(outputField).click({ force: true });
  } else {
    cy.get('mat-option').first().click();
  }
  cy.findByTestId('solution-create-dialog').click(0, 0, { force: true });

  if (applyTransferLearning) {
    cy.findByRole('switch', { name: /toggle for transfer learning/i }).click();
  }
  cy.findByTestId('submit-solution')
    .should('not.be.disabled')
    .children()
    .click({ force: true });
}
export function setupSolution(solutionItem: CreateSolutionForm): void {
  cy.wait(TIMEOUT_SHORT);
  cy.get('[data-testid="solution-table"]', { timeout: TIMEOUT_LONG })
    .should('exist')
    .then(() => {
      cy.get('body').then($body => {
        if ($body.find('[data-testid="solution-item"]').length > 0) {
          cy.get('[data-testid="solution-item"]').then($items => {
            const itemExists = $items
              .toArray()
              .some(item => item.innerText.includes(solutionItem.name));
            if (!itemExists) {
              createSolution(solutionItem);
            }
          });
        } else {
          createSolution(solutionItem);
        }
      });
    });
}

export function checkSolution(name: string) {
  const rowTable = cy
    .findByText(name, {
      timeout: TIMEOUT_LONG,
    })
    .parent();

  rowTable.contains('Done', {
    timeout: TIMEOUT_LONG,
  });
}
export function changeSolutionName(name: string, newName: string): void {
  cy.findAllByTestId('solution-item')
    .filter(`:contains("${name}")`)
    .findByTestId('solution-menu')
    .click();
  cy.findAllByTestId('solution-detail-button').click();
  cy.url().should('include', '/solutions/detail');
  cy.findByTestId('solution-detail-page', { timeout: TIMEOUT_LONG }).should(
    'be.visible'
  );
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.findByTestId('solution-rename-button').click();
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);

  cy.findByTestId('popup-input-field').focus().clear();
  cy.findByTestId('popup-input-field').type(newName);
  cy.findByTestId('popup-input-submit').click();
  cy.go('back');

  cy.findAllByTestId('solution-item')
    .filter(`:contains("${newName}")`)
    .should('exist');
}

export function deleteSolution(name: string) {
  cy.visit('/#/solutions');
  cy.findAllByTestId('solution-item')
    .filter(`:contains("${name}")`)
    .findByTestId('solution-menu')
    .click();
  cy.findAllByTestId('solution-detail-button').click();
  cy.url().should('include', '/solutions/detail');
  cy.findByTestId('solution-detail-page', { timeout: TIMEOUT_LONG }).should(
    'be.visible'
  );
  cy.findByTestId('solution-delete-button').children().click();
  cy.findByTestId('confirm-popup-button').click();
  cy.visit('/#/solutions');

  cy.findAllByText(name).should('have.length', 0);
}
