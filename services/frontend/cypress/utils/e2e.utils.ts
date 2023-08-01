export function createDatabag(
  databagName: string,
  selectFile: string,
  timeout = 5000
) {
  cy.get('[data-testid="add-databag"]', { timeout: timeout }).first().click();
  cy.get('#dataset-name-input').clear();
  cy.get('#dataset-name-input').type(databagName);
  cy.get('#file-input').invoke('show').selectFile(selectFile);
  cy.get('#add-databag-main-button').click();
  cy.get('#define-databag-button', { timeout: 600000 }).click();
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
  cy.wait(500);
  cy.get('[data-testid="input-name"]', { timeout: 500 }).type(solutionName);
  cy.get('[data-testid="input-databagId"]').click();
  cy.get('mat-option').contains(databagName).click();
  cy.get('[data-testid="mat-list-item"]').first().click();
  cy.wait(2000);
  cy.get('[data-testid="create-databag"]', { timeout: 500 }).first().click();
}

export function deleteSolution(solutionName: string) {
  cy.get('[data-testid="solution-item"]')
    .filter(`:contains("${solutionName}")`)
    .find('[data-testid="solution-settings-button"]')
    .click();
  cy.get('[data-testid="solution-delete-button"]', { timeout: 500 }).click();
  cy.get('[data-testid="confirm-popup-button"]', { timeout: 500 }).click();
}
