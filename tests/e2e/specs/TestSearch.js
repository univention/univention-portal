// Iframes are inherently unsafe. Don't use them.
beforeEach(() => {
  cy.setCookie('UMCLang', 'de_DE');
  // stuff selenium can't do #1: mock requests / responses
  cy.intercept('GET', 'portal.json', { fixture: 'portal_logged_out.json' });
  // cy.intercept('GET', 'portal/portal.json', { fixture: 'portal_logged_in.json' });
  cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
  cy.intercept('GET', 'de.json', { fixture: 'de.json' });
  cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });

  cy.setCookie('univentionCookieSettingsAccepted');
});

describe('General Tests', () => {
  it('search shows results with "Blog"', () => {
    // make inputfield visible 
    const searchButton = cy.get('[data-test="searchbutton"]');
    searchButton.should('not.have.class', 'header-button--is-active');
    cy.get('[data-test="searchInput"]').should('not.exist'); // input exists after searchButton is clicked
    cy.get('[data-test="searchbutton"]').click();
    searchButton.should('have.class', 'header-button--is-active');
    cy.get('[data-test="searchInput"]').should('exist');

    // test for tilename
    cy.contains('Handbuch');
    cy.get('[data-test="searchInput"]').type('Blog');
    cy.contains('Handbuch').should('not.exist');
    cy.contains('Blog');
  });


  it('searches also for tile description', () => {
    // make inputfield visible 
    const searchButton = cy.get('[data-test="searchbutton"]');
    searchButton.should('not.have.class', 'header-button--is-active');
    cy.get('[data-test="searchInput"]').should('not.exist'); // input exists after searchButton is clicked
    cy.get('[data-test="searchbutton"]').click();
    searchButton.should('have.class', 'header-button--is-active');
    cy.get('[data-test="searchInput"]').should('exist');


  // test for query of description
  // before typing text of tooltip is decsription of first tile
  cy.get('.portal-tile').first().trigger('mouseover');
  cy.get('[data-test="portal-tooltip"]').contains('Cloud Lösung für Filesync und -share');
  cy.get('#ownCloud').trigger('mouseleave');
  cy.get('[data-test="portal-tooltip"]').should('not.exist');

  // typing text from second tile (not folder)
  cy.get('[data-test="searchInput"]').type('Univention Management Console zur Ver­wal­tung der UCS-Domäne und des lokalen Systems');
  cy.get('.portal-tile').first().trigger('mouseover');
  cy.get('[data-test="portal-tooltip"]').contains('Univention Management Console zur Ver­wal­tung der UCS-Domäne und des lokalen Systems');
  });
});
