// https://docs.cypress.io/api/introduction/api.html

describe('General Tests', () => {
  it('Loads the page', () => {
    cy.clearCookie('univentionCookieSettingsAccepted');
    cy.setCookie('UMCLang', 'de_DE');
    // stuff selenium can't do #1: mock requests / responses
    cy.intercept('GET', 'portal.json', { fixture: 'portal_logged_out.json' });
    // cy.intercept('GET', 'portal/portal.json', { fixture: 'portal_logged_in.json' });
    cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
    cy.intercept('GET', 'de.json', { fixture: 'de.json' });
    cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
    cy.visit('/');
    /**
         * Since there are few data-test attributes the selectors are all over the place,
         * this is quite common but not a best practice. So this is good for learning but
         * should be refactored.
         */

    // cy.contains('Cookie-Einstellungen');
    cy.get('main.cookie-banner + footer button.primary').click();
    cy.getCookie('univentionCookieSettingsAccepted').should('exist');

    cy.contains('h2', 'Verwaltung');
    // Tiles?
    cy.get('.portal-tile__name').contains('span', 'Univention Blog');


    // Mouseover tooltip?
    cy.get('.portal-category .portal-tile').first().trigger('mouseenter');
    cy.get('[data-test="portal-tooltip"]').contains('ownCloud');
    cy.get('.portal-category .portal-tile').first().trigger('mouseleave');
    cy.get('[data-test="portal-tooltip"]').should('not.exist');

    // Buttons, check if they become green
    const searchbutton = cy.get('[data-test="searchbutton"]');
    searchbutton.should('not.have.class', 'header-button--is-active');
    searchbutton.click();
    searchbutton.should('have.class', 'header-button--is-active');

    const bellbutton = cy.get('[data-test="bellbutton"]');
    bellbutton.should('not.have.class', 'header-button--is-active');
    bellbutton.click();
    bellbutton.should('have.class', 'header-button--is-active');

    const menubutton = cy.get('[data-test="navigationbutton"]');
    menubutton.should('not.have.class', 'header-button--is-active');
    menubutton.click();
    menubutton.should('have.class', 'header-button--is-active');
    cy.get('.modal-wrapper--isVisible').click();

    cy.get('[data-test="navigationbutton"]').click();
    cy.wait(500);
    cy.get('.portal-sidenavigation__link').contains('Anmelden');
    cy.contains('Zertifikate');
    cy.contains('Apps');
    cy.contains('Hilfe');
  });
});
