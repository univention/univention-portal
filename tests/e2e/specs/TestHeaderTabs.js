beforeEach(() => {
    cy.setCookie('UMCLang', 'de_DE');
    cy.intercept('GET', 'portal.json', { fixture: 'portal_logged_out.json' });
    cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
    cy.intercept('GET', 'de.json', { fixture: 'de.json' });
    cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
    cy.visit('/');
    cy.setCookie('univentionCookieSettingsAccepted', 'simpleCookieValue');
    cy.get('main.cookie-banner + footer button.primary').click();
  });

  describe('Hab Handling', () => {
    it('Handle One Tab', () => {
      cy.get('data-test="header-tabs"').should('be.empty');
      cy.get('.portal-tile').contains('Benutzer Handbuch').click();
      cy.get('data-test="header-tabs"').children().should('have.length', 1);
    });
  
  
    it('Handle multiple Tabs', () => {
      // make inputfield visible

    });
  });
   