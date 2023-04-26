export function createDatabag(databagName: string, selectFile: string) {
  cy.get('[data-testid="add-databag"]', { timeout: 5000 }).click();
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
export function createSolution(solutionName: string) {
  cy.get('[data-testid="add-solution"]', { timeout: 500 }).click();
  cy.get(
    'app-selectable-list.ng-star-inserted > .mat-mdc-list > :nth-child(1)'
  ).click();
  cy.get('#define-output-next-button').click();
  cy.get('#define-solver-name-input').clear();
  cy.get('#define-solver-name-input').type(solutionName);
  cy.get(
    'app-choose-solver > app-selectable-list > .mat-mdc-list > :nth-child(1) > .mdc-list-item__content > .mat-mdc-list-item-unscoped-content'
  ).click();
  cy.wait(2000);
  cy.get('#define-solver-next-button').click();
}

export function deleteSolution(solutionName: string) {
  cy.get('[data-testid="solution-item"]')
    .filter(`:contains("${solutionName}")`)
    .find('[data-testid="solution-settings-button"]')
    .click();
  cy.get('[data-testid="solution-delete-button"]', { timeout: 500 }).click();
  cy.get('[data-testid="confirm-popup-button"]', { timeout: 500 }).click();
}
