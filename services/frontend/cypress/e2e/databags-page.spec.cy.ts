import { getCheckA11y, login, logout } from '../utils/e2e.utils';
import {
  CreateDatabagForm,
  changeDatabagName,
  checkDatabag,
  createDatabag,
  deleteDatabag,
  visitDatabagPage,
} from 'cypress/utils/databag.utils';

const id = Date.now();

const databagItem: CreateDatabagForm = {
  name: `Databag for databag specs #${id} - default`,
  fixtureFilename: 'cypress/fixtures/databags/titanic-small.xlsx',
};

const databagFrameScriptItem: CreateDatabagForm = {
  name: `Databag for databag specs #${id} - dataframe script`,
  fixtureFilename: 'cypress/fixtures/databags/dataframe_script.py',
};

const databagZipItem: CreateDatabagForm = {
  name: `Databag for databag specs #${id} - ZIP`,
  fixtureFilename: 'cypress/fixtures/databags/raw_data_small.zip',
};

function getUpdatedName(name: string) {
  return `${name} - updated`;
}

describe('Databags Page', () => {
  after('Clean up', () => {
    logout();
  });

  beforeEach(() => {
    login();
    visitDatabagPage();
    cy.injectAxe();
  });

  it('Has no detectable accessibility violations on load', () => {
    getCheckA11y();
  });

  context('Creating databags', () => {
    it('add a Databag xls', () => {
      createDatabag(databagItem);
    });

    it('add a Databag dataframe script', () => {
      createDatabag(databagFrameScriptItem);
    });

    it('add a Databag zip', () => {
      createDatabag(databagZipItem);
    });
  });

  context('Created databags shall be processed', () => {
    it('check a Databag xls', () => {
      checkDatabag(databagItem.name);
    });

    it('check a Databag dataframe script', () => {
      checkDatabag(databagFrameScriptItem.name);
    });

    it('check a Databag zip', () => {
      checkDatabag(databagZipItem.name);
    });
  });

  context('Databags updates', () => {
    it('change name', () => {
      changeDatabagName(databagItem.name, getUpdatedName(databagItem.name));
    });
  });

  context('Databags deletion', () => {
    it('delete a Databag xls', () => {
      deleteDatabag(getUpdatedName(databagItem.name));
    });

    it('delete a Databag dataframe script', () => {
      deleteDatabag(databagFrameScriptItem.name);
    });

    it('delete a Databag zip', () => {
      deleteDatabag(databagZipItem.name);
    });
  });
});
