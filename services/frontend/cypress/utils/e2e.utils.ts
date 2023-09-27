export function createDatabag(
  databagName: string,
  selectFile: string,
  timeout = 5000
) {
  cy.get('[data-testid="add-databag"]', { timeout: timeout }).first().click();
  cy.get('[data-testid="input-name"]').clear();
  cy.get('[data-testid="input-name"]').type(databagName);
  cy.get('[data-testid="file-input"]').invoke('show').selectFile(selectFile);
  cy.get('[data-testid="submit-databag"]', { timeout: 600000 }).click();
  cy.wait(8000);
  cy.get('[data-testid="finish-upload"]', { timeout: 600000 }).click();
  cy.get('[data-testid="databag-item"]')
    .filter(`:contains("${databagName}")`)
    .contains('Done', {
      timeout: 600000,
    });
}
export function deleteDatabag(databagName: string) {
  cy.get('[data-testid="databag-item"]')
    .filter(`:contains("${databagName}")`)
    .find('[data-testid="databag-settings-button"]')
    .click();
  cy.get('[data-testid="databag-delete-button"]', { timeout: 500 }).click();
  cy.get('[data-testid="confirm-popup-button"]', { timeout: 500 }).click();
}
export function createSolution(solutionName: string, databagName: string) {
  cy.get('[data-testid="add-solution"]', { timeout: 500 }).first().click();
  cy.wait(2000);
  cy.get('[data-testid="input-name"]', { timeout: 500 }).type(solutionName);
  cy.get('[data-testid="input-databagId"]').click();
  cy.get('mat-option').contains(databagName).click();
  cy.wait(2000);
  cy.get('[data-testid="input-selected-fields"]').click();
  cy.get('mat-option').first().click();
  cy.get('body').type('{esc}'); // Click anywhere outside the drop-down menu to close it
  cy.wait(2000);
  cy.get('[data-testid="submit-solution"]', { timeout: 500 }).click();
}
export function deleteSolution(solutionName: string) {
  cy.get('[data-testid="solution-item"]')
    .filter(`:contains("${solutionName}")`)
    .find('[data-testid="solution-detail-button"]')
    .click();
  cy.get('[data-testid="solution-delete-button"]', { timeout: 500 })
    .scrollIntoView()
    .click();
  cy.get('[data-testid="confirm-popup-button"]', { timeout: 500 }).click();
}
export function createPrediction(
  predictionName: string,
  solutionName: string,
  selectFile: string
) {
  cy.get('[data-testid="add-prediction"]', { timeout: 500 }).first().click();
  cy.wait(2000);
  cy.get('[data-testid="input-name"]', { timeout: 500 }).type(predictionName);
  cy.get('[data-testid="input-solutionId"]').click();
  cy.get('mat-option').contains(solutionName).click();
  cy.wait(2000);
  cy.get('[data-testid="file-input"]').invoke('show').selectFile(selectFile);
  cy.wait(2000);
  cy.get('[data-testid="submit-prediction"]', { timeout: 500 }).click();
  cy.wait(2000);
  cy.get('[data-testid="finish-upload"]', { timeout: 600000 }).click();
  cy.get('[data-testid="prediction-item"]')
    .filter(`:contains("${predictionName}")`)
    .contains('Done', {
      timeout: 600000,
    });
}
export function deletePrediction(predictionName: string) {
  cy.get('[data-testid="prediction-item"]')
    .filter(`:contains("${predictionName}")`)
    .find('[data-testid="prediction-delete-button"]', { timeout: 500 })
    .click();
  cy.get('[data-testid="confirm-popup-button"]', { timeout: 500 }).click();
}
