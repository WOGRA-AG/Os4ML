import { TIMEOUT_LONG, handleA11yViolations } from './e2e.utils';
import {createDatabag, CreateDatabagForm} from "./databag.utils";

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
  cy.findAllByTestId('add-solution').first().click();

  cy.checkA11y(undefined, undefined, handleA11yViolations, true);

  cy.findByTestId('input-name').clear().type(name);

  cy.findByTestId('input-databagId').click();
  cy.get('mat-option').contains(databagName).click();

  cy.findByTestId('output-select-field').click({force: true});
  if (outputField) {
    cy.get('mat-option').contains(outputField).click({force: true});
  } else {
    cy.get('mat-option').first().click();
  }

  cy.get('body').type('{esc}');

  if (applyTransferLearning) {
    cy.findByRole('switch', {name: /toggle for transfer learning/i}).click();
  }

  cy.findByTestId('submit-solution')
    .should('not.be.disabled')
    .children()
    .click({force: true});
}

export function setupSolution(solutionItem: CreateSolutionForm): void {
  cy.get('[data-testid="solution-item"]').then($items => {
    const matchingItem =
      $items.filter((index, item) => item.innerText.includes(solutionItem.name));
    if (matchingItem.length === 0) {
      createSolution(solutionItem);
    }
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
    .findAllByTestId('solution-detail-button')
    .click();
  cy.url().should('include', '/solutions/detail');
  cy.findByTestId('solution-detail-page').should('be.visible');
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
  const rowTable = cy.findByText(name).parent();

  rowTable.findByRole('button', { name: /solution settings/i }).click();

  cy.findByTestId('solution-delete-button').children().click();
  cy.findByTestId('confirm-popup-button').click();

  cy.visit('/#/solutions');
  cy.findAllByText(name).should('have.length', 0);
}
