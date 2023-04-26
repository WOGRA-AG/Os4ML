export function login() {
  cy.viewport(1280, 720);
  cy.log('lol');
  if (!Cypress.env('CYPRESS_dev')) {
    cy.log('fddd');
    cy.visit('https://testing.os4ml.wogra.com');
    cy.log('fddd');
    cy.get(':nth-child(1) > .pure-material-textfield-outlined > span').click();
    cy.get('#username').clear();
    // add username to run locally
    cy.get('#username').type(Cypress.env('TEST_USER'));
    cy.get(':nth-child(2) > .pure-material-textfield-outlined > span').click();
    cy.get('#password').clear();
    // add password to run locally
    cy.get('#password').type(Cypress.env('TEST_PASSWORD'));
    cy.get('#kc-login > span').click();
  } else {
    cy.visit('http://localhost:4200');
    cy.log('Login Disabled');
  }
}

export function logout() {
  if (!Cypress.env('CYPRESS_dev')) {
    cy.visit('/logout');
    cy.get('#kc-logout').click();
    cy.get('#kc-page-title').contains('You are logged out');
  }
}
