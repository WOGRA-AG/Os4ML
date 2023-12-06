import {
  TIMEOUT_LONG,
  handleA11yViolations,
  login,
  getSupportingMLEntitieId,
} from '../utils/e2e.utils';
import {
  CreateDatabagForm,
  checkDatabag,
  deleteDatabag,
  setupDatabag,
} from 'cypress/utils/databag.utils';
import {
  CreateSolutionForm,
  setupSolution,
  checkSolution,
  deleteSolution,
} from 'cypress/utils/solution.utils';
import {
  createTransferLearningByModel,
  TransferLearningForm,
} from 'cypress/utils/transfer-learning.utils';

const essentialMLEntitiesOnly =
  Cypress.env('createEssentialMLEntitiesOnly') === true;
const id = Date.now();

const databagItem: CreateDatabagForm = {
  name: `Databag for TL specs #${getSupportingMLEntitieId()}`,
  fixtureFilename: 'cypress/fixtures/databags/titanic-small.xlsx',
};

const solutionItem: CreateSolutionForm = {
  name: `Solution for TL specs #${getSupportingMLEntitieId()}`,
  databagName: databagItem.name,
  outputField: 'survived',
  applyTransferLearning: false,
};

const transferLearningItem: TransferLearningForm = {
  name: `Transfer learning #${id}`,
  solutionName: solutionItem.name,
  solutionInputField: 'age',
};

const newTLsolutionItem: CreateSolutionForm = {
  name: `New solution from TL #${id}`,
  databagName: databagItem.name,
  outputField: 'sex',
  applyTransferLearning: true,
};

describe('Transfer learning page', () => {
  before('Prepare data for tests', () => {
    login('#/databags');
    cy.injectAxe();

    setupDatabag(databagItem);
    checkDatabag(databagItem.name);

    cy.visit('/#/solutions');
    setupSolution(solutionItem);
    checkSolution(solutionItem.name);
  });

  after('Clean up', () => {
    if (!essentialMLEntitiesOnly) {
      deleteDatabag(databagItem.name);
      deleteSolution(solutionItem.name);
    }
  });

  beforeEach(() => {
    login('#/transfer-learning');
    cy.injectAxe();
    cy.findByTestId('transfer-learning-page', { timeout: TIMEOUT_LONG }).should(
      'be.visible'
    );
  });

  it('Should be accessible (a11y)', () => {
    cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  });

  it('Should create a new Transfer Learning via Model', function () {
    cy.findByRole('link', { name: /transfer learning/i }).click();
    cy.findByRole('heading', { level: 1, name: /transfer learning models/i });
    cy.findByRole('button', { name: /create solution/i });
    cy.findByRole('button', { name: /create model/i });

    createTransferLearningByModel(transferLearningItem);

    cy.visit('#/transfer-learning');
    cy.findByText(transferLearningItem.name).should('be.visible');
  });

  it('The created Transfer Learning shall be available when creating a new Solution', function () {
    const newItem = newTLsolutionItem satisfies CreateSolutionForm;

    cy.findByRole('link', { name: /transfer learning/i }).click();
    cy.findByRole('heading', { level: 1, name: /transfer learning models/i });
    cy.findByRole('button', { name: /create solution/i });

    cy.findAllByTestId('add-solution').first().click();
    cy.wait(1500);

    cy.findByTestId('input-name').clear().type(newItem.name);

    cy.findByTestId('input-databagId').click();
    cy.get('mat-option').contains(newItem.databagName).click();

    cy.findByTestId('output-select-field').click({ force: true });
    cy.get('mat-option').contains(newItem.outputField!).click({ force: true });
    cy.get('body').type('{esc}');

    cy.findByRole('switch', { name: /toggle for transfer learning/i }).click();

    cy.findAllByText(/Default Model - OS4ML/i)
      .first()
      .click();
    cy.get('mat-option').contains(transferLearningItem.name).click();

    cy.findByTestId('submit-solution')
      .should('not.be.disabled')
      .children()
      .click({ force: true });

    const rowTable = cy
      .findByText(newItem.name, {
        timeout: TIMEOUT_LONG,
      })
      .parent();

    rowTable.contains('Done', {
      timeout: TIMEOUT_LONG,
    });


    cy.findAllByTestId('solution-item')
      .filter(`:contains("${newItem.name}")`)
      .findByTestId('solution-menu')
      .click();
    cy.findAllByTestId('solution-detail-button').click();

    cy.findByText(transferLearningItem.name).should('be.visible');
  });

  it('delete TL Solution', () => {
    deleteSolution(newTLsolutionItem.name);
  });
});
