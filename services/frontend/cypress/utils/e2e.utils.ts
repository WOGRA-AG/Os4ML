import { NodeResult, Result } from 'axe-core';

const TIMEOUT_SHORT = 500;
const TIMEOUT_LONG = 600000;

export function visitDatabagPage(): void {
  cy.visit('/#/databags');
  cy.get('[data-testid="databags-page"]', { timeout: TIMEOUT_LONG }).should(
    'be.visible'
  );
}
export function createDatabag(databagName: string, selectFile: string) {
  cy.get('[data-testid="add-databag"]', { timeout: TIMEOUT_SHORT })
    .first()
    .click();
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.get('[data-testid="input-name"]').clear();
  cy.get('[data-testid="input-name"]').type(databagName);
  cy.get('[data-testid="file-input"]').invoke('show').selectFile(selectFile);
  cy.get('[data-testid="submit-databag"]', { timeout: TIMEOUT_LONG }).click();
  cy.get('[data-testid="finish-upload"]', { timeout: TIMEOUT_LONG })
    .should('not.be.disabled')
    .click();
}
export function checkDatabag(databagName: string) {
  cy.get('[data-testid="databag-item"]')
    .filter(`:contains("${databagName}")`)
    .should('exist');
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.get('[data-testid="databag-item"]')
    .filter(`:contains("${databagName}")`)
    .contains('Done', {
      timeout: TIMEOUT_LONG,
    });
}
export function changeDatabagName(
  databagName: string,
  updatedDatabagName: string
) {
  cy.get('[data-testid="databag-item"]', { timeout: TIMEOUT_LONG })
    .filter(`:contains("${databagName}")`)
    .find('[data-testid="databag-settings-button"]')
    .click();
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.get('#mat-input-0')
    .focus()
    .clear({ timeout: TIMEOUT_LONG })
    .should('have.value', '');
  cy.get('#mat-input-0').type(updatedDatabagName, {
    timeout: TIMEOUT_SHORT,
  });
  cy.get('#update-databag-button').click();
  cy.get('[data-testid="databag-item"]')
    .filter(`:contains("${updatedDatabagName}")`)
    .should('exist');
}
export function deleteDatabag(databagName: string) {
  cy.get('[data-testid="databag-item"]', {
    timeout: TIMEOUT_LONG,
  })
    .filter(`:contains("${databagName}")`)
    .find('[data-testid="databag-settings-button"]')
    .click();
  cy.get('[data-testid="databag-delete-button"]', {
    timeout: TIMEOUT_SHORT,
  }).click();
  cy.get('[data-testid="confirm-popup-button"]', {
    timeout: TIMEOUT_SHORT,
  }).click();
  cy.get('[data-testid="databags-page"]').should('not.contain', databagName, {
    timeout: TIMEOUT_SHORT,
  });
}
export function visitSolutionsPage(): void {
  cy.visit('/#/solutions');
  cy.get('[data-testid="solutions-page"]', { timeout: TIMEOUT_LONG }).should(
    'be.visible'
  );
}
export function setupSolutionTestDatabag(
  solutionTestDatabagName: string
): void {
  visitDatabagPage();
  cy.get('[data-testid="databag-table"]', { timeout: TIMEOUT_SHORT })
    .should('exist')
    .then($items => {
      const item = $items.filter((index, el) => {
        return Cypress.$(el).text().includes(solutionTestDatabagName);
      });
      if (item.length === 0) {
        createDatabag(solutionTestDatabagName, 'cypress/fixtures/titanic.xls');
      }
    });
  cy.get('[data-testid="databag-item"]')
    .filter(`:contains("${solutionTestDatabagName}")`)
    .should('exist');
  cy.get('[data-testid="databag-item"]')
    .filter(`:contains("${solutionTestDatabagName}")`)
    .contains('Done', {
      timeout: TIMEOUT_LONG,
    });
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
}

export function createSolution(solutionName: string, databagName: string) {
  cy.get('[data-testid="add-solution"]', { timeout: TIMEOUT_SHORT })
    .first()
    .click();
  cy.get('[data-testid="solution-create-dialog"]', {
    timeout: TIMEOUT_LONG,
  }).should('be.visible');
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.get('[data-testid="input-name"]', { timeout: TIMEOUT_SHORT }).type(
    solutionName
  );
  cy.get('[data-testid="input-databagId"]', { timeout: TIMEOUT_SHORT })
    .should('not.be.disabled')
    .click();
  cy.get('mat-option').contains(databagName).click();
  cy.get('[data-testid="output-select-field"]', { timeout: TIMEOUT_SHORT })
    .should('not.be.disabled')
    .click();
  cy.get('mat-option').first().click();
  cy.get('body').type('{esc}');
  cy.get('[data-testid="submit-solution"]', { timeout: TIMEOUT_SHORT }).click();
  cy.get('[data-testid="solution-item"]')
    .filter(`:contains("${solutionName}")`)
    .should('exist', { timeout: TIMEOUT_SHORT });
  cy.get('[data-testid="solution-item"]')
    .filter(`:contains("${solutionName}")`)
    .contains('Done', {
      timeout: TIMEOUT_LONG,
    });
}
export function changeSolutionName(
  solutionName: string,
  updatedSolutionName: string
): void {
  cy.get('[data-testid="solution-item"]')
    .filter(`:contains("${solutionName}")`)
    .find('[data-testid="solution-detail-button"]')
    .click();
  cy.url().should('include', '/solutions/detail');
  cy.get('[data-testid="solution-detail-page"]').should('be.visible');
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.get('[data-testid="solution-rename-button"]').click();
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);

  cy.get('[data-testid="popup-input-field"]').focus().clear();
  cy.get('[data-testid="popup-input-field"]', { timeout: TIMEOUT_SHORT }).type(
    updatedSolutionName
  );
  cy.get('[data-testid="popup-input-submit"]').click();
  cy.go('back');

  cy.get('[data-testid="solution-item"]')
    .filter(`:contains("${updatedSolutionName}")`)
    .should('exist');
}
export function deleteSolution(solutionName: string) {
  cy.get('[data-testid="solution-item"]')
    .filter(`:contains("${solutionName}")`)
    .find('[data-testid="solution-detail-button"]')
    .click();
  cy.get('[data-testid="solution-detail-page"]', { timeout: TIMEOUT_LONG }).should(
    'be.visible'
  );
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.get('[data-testid="solution-delete-button"]', { timeout: TIMEOUT_SHORT })
    .scrollIntoView()
    .click();
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.get('[data-testid="confirm-popup-button"]', {
    timeout: TIMEOUT_SHORT,
  }).click();
  cy.get('[data-testid="solution-table"]').should('not.contain', solutionName);
}

export function visitPredictionsPage(): void {
  cy.visit('/#/predictions');
  cy.get('[data-testid="predictions-page"]', { timeout: TIMEOUT_LONG }).should(
    'be.visible'
  );
}

export function setupPredictionTestSolution(
  predictionTestSolutionName: string,
  predictionTestDatabagName: string
): void {
  visitSolutionsPage();
  cy.get('[data-testid="prediction-table"]', { timeout: TIMEOUT_SHORT })
    .should('exist')
    .then($items => {
      const item = $items.filter((index, el) => {
        return Cypress.$(el).text().includes(predictionTestSolutionName);
      });
      if (item.length === 0) {
        createSolution(predictionTestSolutionName, predictionTestDatabagName);
      }
    });
  cy.get('[data-testid="solution-item"]', { timeout: TIMEOUT_LONG })
    .filter(`:contains("${predictionTestSolutionName}")`)
    .should('exist');
  cy.get('[data-testid="solution-item"]')
    .filter(`:contains("${predictionTestSolutionName}")`)
    .contains('Done', {
      timeout: TIMEOUT_LONG,
    });
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
}

export function createPrediction(
  predictionName: string,
  solutionName: string,
  selectFile: string
) {
  cy.get('[data-testid="add-prediction"]', { timeout: TIMEOUT_SHORT })
    .first()
    .click();
  cy.get('[data-testid="prediction-create-dialog"]', {
    timeout: TIMEOUT_LONG,
  }).should('be.visible');
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);
  cy.get('[data-testid="input-name"]', {
    timeout: TIMEOUT_SHORT,
  }).scrollIntoView();
  cy.get('[data-testid="input-name"]', { timeout: TIMEOUT_SHORT }).type(
    predictionName
  );
  cy.get('[data-testid="input-solutionId"]', { timeout: TIMEOUT_SHORT })
    .should('not.be.disabled')
    .click();
  cy.get('mat-option')
    .contains(solutionName, { timeout: TIMEOUT_SHORT })
    .click();
  cy.get('[data-testid="file-input"]', { timeout: TIMEOUT_SHORT })
    .invoke('show')
    .selectFile(selectFile);
  cy.get('[data-testid="submit-prediction"]', {
    timeout: TIMEOUT_SHORT,
  }).click();
  cy.get('[data-testid="finish-upload"]', { timeout: TIMEOUT_LONG }).click();
  cy.get('[data-testid="prediction-item"]', { timeout: TIMEOUT_SHORT })
    .filter(`:contains("${predictionName}")`)
    .should('exist');
  cy.get('[data-testid="prediction-item"]', { timeout: TIMEOUT_SHORT })
    .filter(`:contains("${predictionName}")`)
    .contains('Done', {
      timeout: TIMEOUT_LONG,
    });
}
export function deletePrediction(predictionName: string) {
  cy.get('[data-testid="prediction-item"]')
    .filter(`:contains("${predictionName}")`)
    .find('[data-testid="prediction-delete-button"]', {
      timeout: TIMEOUT_SHORT,
    })
    .click();
  cy.checkA11y(undefined, undefined, handleA11yViolations, true);

  cy.get('[data-testid="confirm-popup-button"]', {
    timeout: TIMEOUT_SHORT,
  })
    .should('not.be.disabled')
    .click();
  cy.get('[data-testid="prediction-table"]').should(
    'not.contain',
    predictionName
  );
}

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
