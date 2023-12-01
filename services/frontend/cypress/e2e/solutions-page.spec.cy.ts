import {
  getSupportingMLEntitieId,
  handleA11yViolations,
  login,
  logout,
} from '../utils/e2e.utils';
import {
  CreateDatabagForm,
  checkDatabag,
  createDatabag,
  deleteDatabag,
  setupDatabag,
} from 'cypress/utils/databag.utils';
import {
  CreateSolutionForm,
  changeSolutionName,
  createSolution,
  deleteSolution,
  visitSolutionsPage,
  checkSolution,
} from 'cypress/utils/solution.utils';
import { cleanup } from 'axe-core';

const essentialMLEntitiesOnly =
  Cypress.env('createEssentialMLEntitiesOnly') === true;
const id = Date.now();

const databagItem: CreateDatabagForm = {
  name: `Databag for solution specs #${getSupportingMLEntitieId()}`,
  fixtureFilename: 'cypress/fixtures/databags/titanic-small.xlsx',
};

const solutionItem: CreateSolutionForm = {
  name: `Solution #${id}`,
  databagName: databagItem.name,
  applyTransferLearning: false,
};

function getUpdatedName(name: string) {
  return `${name} - updated`;
}

describe('Solutions Page', () => {
  before('Prepare data for tests', () => {
    login('#/databags');
    cy.injectAxe();
    setupDatabag(databagItem);
    checkDatabag(databagItem.name);
  });

  after('Clean up', () => {
    cy.visit('/#/databags');
    if (!essentialMLEntitiesOnly) {
      deleteDatabag(databagItem.name);
    }
    logout();
  });

  beforeEach(() => {
    login();
    visitSolutionsPage();
    cy.injectAxe();
  });

  it('Has no detectable accessibility violations on load', () => {
    cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  });

  context('Creating solutions', () => {
    it('add a Solution', () => {
      createSolution(solutionItem);
    });
  });

  context('Solutions updates', () => {
    it('change name', () => {
      changeSolutionName(solutionItem.name, getUpdatedName(solutionItem.name));
    });
  });

  context('Created solution shall be processed', () => {
    it('Check Solution', () => {
      checkSolution(databagItem.name);
    });
  });

  context('Solutions deletion', () => {
    it('delete a Solution', () => {
      deleteSolution(getUpdatedName(solutionItem.name));
    });
  });
});
