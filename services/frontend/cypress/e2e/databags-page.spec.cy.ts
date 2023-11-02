import {
  changeDatabagName, checkDatabag,
  createDatabag,
  deleteDatabag, handleA11yViolations,
  visitDatabagPage
} from '../utils/e2e.utils';
import { login, logout } from '../utils/e2e.login';

const databagNameXls = `e2e databag xls ${new Date().toISOString()}`;
const updatedDatabagNameXls= `e2e databag xls update ${new Date().toISOString()}`;
const databagNameDataframeScript = `e2e databag dataframe script ${new Date().toISOString()}`;
const databagNameZip = `e2e databag zip ${new Date().toISOString()}`;

beforeEach('login', () => {
  login();
});

after('logout', () => {
  logout();
});
beforeEach(() => {
  visitDatabagPage();
  cy.injectAxe();
});

describe('Databags Page', () => {
  it('Has no detectable accessibility violations on load', () => {
    cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  });

  it('add a Databag xls', () => {
    createDatabag(
      databagNameXls,
      'cypress/fixtures/titanic.xls'
    );
  });

  it('change Databag name', () => {
    changeDatabagName(databagNameXls, updatedDatabagNameXls)
  });

  it('add a Databag dataframe script', () => {
    createDatabag(databagNameDataframeScript, 'cypress/fixtures/dataframe_script.py');
  });

  it('add a Databag zip', () => {
    createDatabag(databagNameZip, 'cypress/fixtures/raw_data_small.zip');
  });

  it('check a Databag xls', () => {
    checkDatabag(updatedDatabagNameXls);
  });

  it('check a Databag dataframe script', () => {
    checkDatabag(databagNameDataframeScript);
  });

  it('check a Databag zip', () => {
    checkDatabag(databagNameZip);
  });

  it('delete a Databag xls', () => {
    deleteDatabag(updatedDatabagNameXls);
  });

  it('delete a Databag dataframe script', () => {
    deleteDatabag(databagNameDataframeScript);
  });

  it('delete a Databag zip', () => {
    deleteDatabag(databagNameZip);
  });
});
