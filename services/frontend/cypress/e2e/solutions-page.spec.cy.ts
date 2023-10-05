import {
  createDatabag,
  createSolution,
  deleteDatabag,
  deleteSolution,
} from '../utils/e2e.utils';
import { login, logout } from '../utils/e2e.login';

const inputTimeout = 1000;
const databagName = `e2e databag ${new Date().toISOString()}`;
const solutionName = `e2e solutionName ${new Date().toISOString()}`;
const predictionName = `e2e predictionName ${new Date().toISOString()}`;
let updatedDatabagName: string;
let updatedSolutionName: string;

beforeEach('login', () => {
  login();
});

after('logout', () => {
  logout();
});

before(() => {
  updatedDatabagName = `updated ${databagName}`;
  updatedSolutionName = `updated ${solutionName}`;
});
beforeEach(() => {
  cy.visit('/#/solutions');
  cy.wait(2000);
});

describe('Solutions Page', () => {
  it('add a Databag xls', () => {
    createDatabag(databagName, 'cypress/fixtures/titanic.xls');
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${databagName}")`)
      .should('exist');
  });

  it('add Solution', () => {
    createSolution(solutionName, databagName);
    cy.wait(2000);
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${solutionName}")`)
      .should('exist');
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${solutionName}")`)
      .contains('Done', {
        timeout: 600000,
      });
  });

  it('change Solution name', () => {
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${solutionName}")`)
      .find('[data-testid="solution-detail-button"]')
      .click();
    cy.url().should('include', '/solutions/detail');
    cy.get('[data-testid="solution-detail-page"]').should('be.visible');
    cy.get('[data-testid="solution-rename-button"]').click();

    cy.get('[data-testid="popup-input-field"]').focus().clear();
    cy.get('[data-testid="popup-input-field"]', { timeout: 500 }).type(
      updatedSolutionName
    );
    cy.get('[data-testid="popup-input-submit"]').click();
    cy.go('back');

    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${updatedSolutionName}")`)
      .should('exist');
  });

  it('delete Solution', () => {
    deleteSolution(updatedSolutionName);
    cy.get('[data-testid="solution-table"]').should(
      'not.contain',
      updatedSolutionName
    );
  });

  it('delete a Databag', () => {
    cy.visit('/#/databags');
    cy.wait(2000);
    deleteDatabag(databagName);
    cy.get('[data-testid="databag-page"]').should('not.contain', databagName);
  });
});
