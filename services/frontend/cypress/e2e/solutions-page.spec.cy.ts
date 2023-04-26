import {
  createDatabag,
  createSolution,
  deleteDatabag,
  deleteSolution,
} from '../utils/e2e.utils';

const inputTimeout = 1000;
const databagName = `e2e databag ${new Date().toISOString()}`;
const solutionName = `e2e solutionName ${new Date().toISOString()}`;
let updatedDatabagName: string;
let updatedSolutionName: string;

before(() => {
  updatedDatabagName = `updated ${databagName}`;
  updatedSolutionName = `updated ${solutionName}`;
});

describe('Solutions Page', () => {
  beforeEach(() => {
    cy.visit('/#/solutions');
    cy.wait(2000);
  });

  it('add a Databag xls', () => {
    createDatabag(databagName, 'cypress/fixtures/titanic.xls');
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${databagName}")`)
      .should('exist');
  });

  it('add Solution', () => {
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${databagName}")`, { timeout: 500 })
      .click();
    createSolution(solutionName);
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${solutionName}")`)
      .should('exist');
  });

  it('change Solution name', () => {
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${solutionName}")`)
      .find('[data-testid="solution-settings-button"]')
      .click();
    cy.get('#mat-input-0').clear({ timeout: inputTimeout });
    cy.get('#mat-input-0').type(updatedSolutionName, {
      timeout: inputTimeout,
    });
    cy.get('[data-testid="solution-update-button"]').click();
    cy.get('[data-testid="solution-item"]')
      .filter(`:contains("${updatedSolutionName}")`)
      .should('exist');
  });

  it('delete Solution', () => {
    cy.get('[data-testid="databag-item"]')
      .filter(`:contains("${databagName}")`)
      .click();
    deleteSolution(updatedSolutionName);
    cy.get('[data-testid="solution-page"]').should(
      'not.contain',
      updatedSolutionName
    );
  });

  it('delete a Databag', () => {
    cy.visit('/#/databags');
    deleteDatabag(databagName);
    cy.get('[data-testid="databag-page"]').should('not.contain', databagName);
  });
});
