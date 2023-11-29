export type TransferLearningForm = {
  name: string;
  solutionName: string;
  solutionInputField: string;
};

export function createTransferLearningByModel({
  name,
  solutionName,
  solutionInputField,
}: TransferLearningForm) {
  const createButton = cy.findByTestId('add-transfer-learning-model');

  createButton.click();

  cy.findByRole('dialog').should('be.visible');
  cy.wait(1500);
  cy.findByText(/create transfer learning model/i).should('be.visible');

  const inputName = cy.findByLabelText(/Transfer learning model name/i);

  inputName.clear();
  inputName.type(name);

  cy.findByTestId('input-databagId').click({ force: true });
  cy.get('mat-option').contains(solutionName).click();

  cy.findByTestId('input-selected-fields').click({ force: true });
  cy.get('mat-option').contains(solutionInputField).click();

  cy.findByRole('button', { name: /Submit/i }).click();
}
