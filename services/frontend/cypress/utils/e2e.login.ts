const isDev = Cypress.env('dev') === true;

export function login(path?: string) {
  cy.viewport(1280, 720);
  if (isDev) {
    cy.visit(`http://localhost:4200/${path ? path : ''}`);
    cy.log('Login Disabled');
  } else {
    cy.visit('/');
    cy.get(':nth-child(1) > .pure-material-textfield-outlined > span').click();
    cy.get('#username').clear();
    // add username to run locally
    cy.get('#username').type(Cypress.env('TEST_USER'));
    cy.get(':nth-child(2) > .pure-material-textfield-outlined > span').click();
    cy.get('#password').clear();
    // add password to run locally
    cy.get('#password').type(Cypress.env('TEST_PASSWORD'));
    cy.get('#kc-login > span').click();

    if (path) {
      cy.visit(`/${path}`);
    }
  }
}

export function logout() {
  if (!isDev) {
    cy.visit('/logout');
    cy.get('#kc-logout').click();
    cy.get('#kc-page-title').contains('You are logged out');
  }
}
