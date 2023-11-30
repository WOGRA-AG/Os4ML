import { TIMEOUT_LONG, handleA11yViolations, login } from '../utils/e2e.utils';
import {
  CreateDatabagForm,
  checkDatabag,
  createDatabag,
  deleteDatabag,
} from 'cypress/utils/databag.utils';
import {
  CreateSolutionForm,
  createSolution,
} from 'cypress/utils/solution.utils';
import {
  createTransferLearningByModel,
  TransferLearningForm,
} from 'cypress/utils/transfer-learning.utils';

const id = Date.now();

const databagItem: CreateDatabagForm = {
  name: `Databag for TL specs #${id}`,
  fixtureFilename: 'cypress/fixtures/databags/titanic-small.xlsx',
};

const solutionItem: CreateSolutionForm = {
  name: `Solution for TL specs #${id}`,
  databagName: databagItem.name,
  outputField: 'survived',
  applyTransferLearning: false,
};

const transferLearningItem: TransferLearningForm = {
  name: `Transfer learning #${id}`,
  solutionName: solutionItem.name,
  solutionInputField: 'age',
};

describe('Transfer learning page', () => {
  before('Prepare data for tests', () => {
    login('#/databags');
    cy.injectAxe();

    createDatabag(databagItem);
    checkDatabag(databagItem.name);

    cy.visit('/#/solutions');
    createSolution(solutionItem);
  });

  after('Clean up', () => {
    cy.visit('/#/databags');
    deleteDatabag(databagItem.name);
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
    const newItem = {
      databagName: databagItem.name,
      name: `${solutionItem.name} - for transfer learning`,
      outputField: 'sex',
      applyTransferLearning: true,
    } satisfies CreateSolutionForm;

    cy.findByRole('link', { name: /transfer learning/i }).click();
    cy.findByRole('heading', { level: 1, name: /transfer learning models/i });
    cy.findByRole('button', { name: /create solution/i });

    cy.findAllByTestId('add-solution').first().click();
    cy.wait(1500);

    cy.findByTestId('input-name').clear().type(newItem.name);

    cy.findByTestId('input-databagId').click();
    cy.get('mat-option').contains(newItem.databagName).click();

    cy.findByTestId('output-select-field').click({ force: true });
    cy.get('mat-option').contains(newItem.outputField).click({ force: true });
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

    cy.findByText(newItem.name, {
      timeout: TIMEOUT_LONG,
    })
      .parent()
      .findByRole('button', { name: /solution settings/i })
      .click();
    cy.findByText(transferLearningItem.name).should('be.visible');
  });
});
