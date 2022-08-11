describe('Databags', () => {
  beforeEach(() => {
    cy.visit('/databag');
  });

  it('has the correct title', () => {
    cy.title().should('equal', 'Frontend');
  });

  it('add and define databag', () => {
    const urlToPaste = 'https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/stuff/titanic.csv';
    // eslint-disable-next-line max-len
    // Use the .button-add-databag instead of [id='add-databag-button-empty'] if you want to test the workflow with already uploaded databags
    cy.get('[id=\'add-databag-button-empty\']').click();
    cy.get('[type=\'url\']').focus().type(urlToPaste).blur();
    cy.get('[id=\'add-databag-button\']').click();
    cy.get('[id=\'ngForm\']', { timeout: 600000 }).find('.columns').find('.mat-select-value-text').eq(0).find('span').contains('category');
    cy.get('[id=\'ngForm\']').find('.columns').find('.mat-select-value-text').eq(1).find('span').contains('category');
    cy.get('[id=\'ngForm\']').find('.columns').find('.mat-select-value-text').eq(2).find('span').contains('text');
    cy.get('[id=\'ngForm\']').find('.columns').find('.mat-select-value-text').eq(3).find('span').contains('category');
    cy.get('[id=\'ngForm\']').find('.columns').find('.mat-select-value-text').eq(4).find('span').contains('numerical');
    cy.get('[id=\'ngForm\']').find('.columns').find('.mat-select-value-text').eq(5).find('span').contains('category');
    cy.get('[id=\'ngForm\']').find('.columns').find('.mat-select-value-text').eq(6).find('span').contains('category');
    cy.get('[id=\'ngForm\']').find('.columns').find('.mat-select-value-text').eq(7).find('span').contains('numerical');
    cy.get('[id=\'define-databag-button\']').click();
    // eslint-disable-next-line max-len
    // Use cy.get('[id=\'databag-table\']').find('tbody').find('tr').eq(0).find('td').eq(0).contains('titanic.csv'); if multiple entries are present in the table
    cy.get('[id=\'databag-table\']').find('tbody').find('tr').find('td').eq(0).contains('titanic.csv');
    cy.get('[id=\'databag-table\']').find('tbody').find('tr').find('td').eq(1).contains(urlToPaste);
    cy.get('[id=\'databag-table\']').find('tbody').find('tr').find('td').eq(2).contains('file_url', { timeout: 60000 });
    cy.get('[id=\'databag-table\']').find('tbody').find('tr').find('td').eq(3).contains('8', { timeout: 60000 });
    cy.get('[id=\'databag-table\']').find('tbody').find('tr').find('td').eq(4).contains('887', { timeout: 60000 });
    cy.get('[id=\'databag-table\']').find('tbody').find('tr').find('td').eq(5);
    cy.visit('/dashboard');
    cy.get('.bag-list').find('mat-list-item').eq(0).click();
    cy.get('[id=\'add-solution-button-empty\']').click();
    cy.get('[id=\'define-output-list\']').find('mat-list-item').eq(0).click();
    cy.get('[id=\'define-output-next-button\']').click();
    cy.get('[id=\'define-solver-name-input\']').focus().type('My Solution').blur();
    cy.get('[id=\'define-solver-list\']').find('mat-list-item').eq(0).click();
    cy.get('[id=\'define-solver-next-button\']').click();
  });
});
