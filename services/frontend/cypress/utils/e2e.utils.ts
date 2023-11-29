import { NodeResult, Result } from 'axe-core';

const isDev = Cypress.env('dev') === true;
export const TIMEOUT_LONG = 60 * 1000 * 10; /* Number of minutes */

export function handleA11yViolations(violations: Array<Result>) {
  violations.forEach(violation => {
    // Für jeden Verstoß werden die betroffenen Elemente (Knoten) aufgelistet
    const nodes = violation.nodes
      .map((node: NodeResult) => {
        return `
      Element: ${node.html}
      Reason: ${node.failureSummary}
      `;
      })
      .join('\n');

    const violationDetails = `
      ID: ${violation.id}
      Description: ${violation.description}
      Help Text: ${violation.help}
      Severity: ${violation.impact}
      Affected Elements: ${nodes}
    `;

    if (violation.id === 'color-contrast') {
      cy.log(`[WARNING] ${violationDetails}`);
    } else {
      throw new Error(violationDetails);
    }
  });
}

export function login(path?: string) {
  cy.viewport(1280, 720);
  if (isDev) {
    cy.visit(`http://localhost:4200/${path ? path : ''}`);
    cy.log('Login Disabled');
  } else {
    cy.visit(`/${path ? path : ''}`);

    cy.get('body').then($el => {
      if ($el.find('#username').length > 0) {
        // User not logged in
        cy.get('#username').clear({ force: true });
        cy.get('#username').type(Cypress.env('TEST_USER'));

        cy.get('#password').clear({ force: true });
        cy.get('#password').type(Cypress.env('TEST_PASSWORD'));

        cy.get('#rememberMe').check({ force: true });

        cy.get('#kc-login').click();
      } else {
        // User already logged in
      }

      cy.visit(`/${path ? path : ''}`);
    });
  }
}

export function logout() {
  if (!isDev) {
    cy.visit('/logout');
    cy.get('#kc-logout').click();
    cy.get('#kc-page-title').contains('You are logged out');
  }
}
