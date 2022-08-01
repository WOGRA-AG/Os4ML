describe('Databags', () => {
  beforeEach(() => {
    cy.visit('/databag');
  });

  it('has the correct title', () => {
    cy.title().should('equal', 'Frontend');
  });

  it('add databag button available', () => {
    cy.get('.button-add-databag').click();
    const urlToPaste = 'https://web.stanford.edu/class/archive/cs/cs109/cs109.1166/stuff/titanic.csv';
    cy.get('[type=\'url\']').focus().type(urlToPaste).blur();
    cy.get('.main-button').click();
    cy.get('.main-button', { timeout: 600000 }).click();
    cy.get('.main-button', { timeout: 600000 }).click();
    cy.get('table', { timeout: 600000 }).find('tr').eq(0).find('td').eq(0).contains('titanic.csv');
  });

});
