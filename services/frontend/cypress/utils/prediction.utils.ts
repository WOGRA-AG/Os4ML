import { TIMEOUT_LONG, handleA11yViolations } from './e2e.utils';

export type CreatePredictionForm = {
  name: string;
  solutionName: string;
  file: string;
};

export function visitPredictionsPage(): void {
  cy.visit('/#/predictions');
  cy.findByTestId('predictions-page', { timeout: TIMEOUT_LONG }).should(
    'be.visible'
  );
}

export function createPrediction({
  name,
  solutionName,
  file,
}: CreatePredictionForm) {
  cy.findByTestId('predictions-page-actions', { timeout: TIMEOUT_LONG })
    .parent()
    .should('not.be.disabled')
    .findByTestId('add-prediction')
    .click();
  cy.findByTestId('prediction-create-dialog', {
    timeout: TIMEOUT_LONG,
  }).should('be.visible');
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.findByTestId('input-name').scrollIntoView();
  cy.findByTestId('input-name').type(name);
  cy.findByTestId('input-solutionId').should('not.be.disabled').click();
  cy.get('mat-option').contains(solutionName).click();
  cy.findByTestId('file-input').invoke('show').selectFile(file);
  cy.findByTestId('submit-prediction').click();
  cy.findByTestId('finish-upload', { timeout: TIMEOUT_LONG }).click();
}

export function deletePrediction(name: string) {
  cy.findAllByTestId('prediction-item', {
    timeout: TIMEOUT_LONG,
  })
    .filter(`:contains("${name}")`)
    .findByTestId('prediction-delete-button')
    .click();
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);

  cy.findByTestId('confirm-popup-button').should('not.be.disabled').click();
}
