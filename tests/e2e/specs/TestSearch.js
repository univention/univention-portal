import 'cypress-axe';

beforeEach(() => {
  cy.setCookie('UMCLang', 'de_DE');
  cy.intercept('GET', 'portal.json', { fixture: 'portal_logged_out.json' });
  cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
  cy.intercept('GET', 'de.json', { fixture: 'de.json' });
  cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
  cy.visit('/');
  cy.get('main.cookie-banner + footer button.primary').click();
});

const clickOnSearchButton = () => {
  cy.get('[data-test="searchbutton"]').should('not.have.class', 'header-button--is-active');
  cy.get(searchInput).should('not.exist'); // input exists after searchButton is clicked
  cy.get('[data-test="searchbutton"]').click();
  cy.get('[data-test="searchbutton"]').should('have.class', 'header-button--is-active');
  cy.get(searchInput).should('exist');
}

const searchInput = '[data-test="searchInput"]';

describe('General Tests', () => {
  it('Tile title in results should match with the String "Blog"', () => {
    // make inputfield visible
    clickOnSearchButton();

    // test for tilename
    cy.contains('Handbuch');
    cy.get(searchInput).type('Blog');
    cy.contains('Handbuch').should('not.exist');
    cy.contains('Blog');

    // TODO: Assert that folder containing Blog is there
  });


  it('Searches also for tile description', () => {
    // make inputfield visible
    clickOnSearchButton();

    // make sure the first tile is not our expected search result
    cy.get('.portal-tile').first().contains('System- und Domäneneinstellungen').should("not.exist");
    cy.get(searchInput).type('Univention Management Console zur Ver­wal­tung der UCS-Domäne und des lokalen Systems');
    // ensure that the first result is not by coincidence the search result
    cy.get('.portal-tile').should('have.length', 1);
    cy.get('.portal-tile').first().contains('System- und Domäneneinstellungen');
  });

  it('Escape is working', () => {
    // make inputfield visible
    clickOnSearchButton();
    cy.get(searchInput).should('exist');
    cy.get('body').type('{esc}');
    cy.get(searchInput).should('not.exist');
  });

  it('General A11y test', () => {
    // make inputfield visible
    clickOnSearchButton();
    cy.injectAxe();
    cy.checkA11y(searchInput, 
    {
      runOnly: {
        type: 'tag',
        values: ['wcag21aa'],
      }
    },
    cy.terminalLog, {
      skipFailures: false
    });
  });
});
