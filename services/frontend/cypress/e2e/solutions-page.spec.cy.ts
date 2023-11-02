import {
  changeSolutionName,
  createSolution,
  deleteSolution,
  handleA11yViolations,
  setupSolutionTestDatabag,
  visitSolutionsPage,
} from '../utils/e2e.utils';
import { login, logout } from '../utils/e2e.login';

const solutionTestDatabagName = `e2e solution test databag`;
const solutionName = `e2e solutionName ${new Date().toISOString()}`;
const updatedSolutionName = `e2e solutionName update ${new Date().toISOString()}`;

beforeEach('login', () => {
  login();
});

after('logout', () => {
  logout();
});

beforeEach(() => {
  visitSolutionsPage();
  cy.injectAxe();
});

describe('Solutions Page', () => {
  it('Has no detectable accessibility violations on load', () => {
    cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  });

  it('setup a Databag xls', () => {
    setupSolutionTestDatabag(solutionTestDatabagName);
  });

  it('add Solution', () => {
    createSolution(solutionName, solutionTestDatabagName);
  });

  it('change Solution name', () => {
    changeSolutionName(solutionName, updatedSolutionName);
  });

  it('delete Solution', () => {
    deleteSolution(updatedSolutionName);
  });
});
