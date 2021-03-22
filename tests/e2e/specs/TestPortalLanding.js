// https://docs.cypress.io/api/introduction/api.html

describe('General Tests', () => {
  it('Loads the page', () => {
    // stuff selenium can't do #1: mock requests / responses
    cy.intercept('GET', 'portal/portal.json', { fixture: 'portal_logged_out.json' });
    // cy.intercept('GET', 'portal/portal.json', { fixture: 'portal_logged_in.json' });
    cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
    cy.intercept('GET', 'de.json', { fixture: 'de.json' });
    cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
    cy.clock();
    cy.visit('/');
    /**
         * Since there are few data-test attributes the selectors are all over the place,
         * this is quite common but not a best practice. So this is good for learning but
         * should be refactored.
         */
    cy.contains('h2', 'Verwaltung');
    // Tiles?
    cy.get('.portal-tile__name').contains('span', 'Univention Blog');
    // Login notification?
    cy.get('.notification-bubble__title').contains('Anmelden');
    cy.get('button[aria-label="Benachrichtigung schließen"]').click();

    cy.contains('Anmelden').should('not.exist');

    // Mouseover tooltip?
    cy.get('#ownCloud').trigger('mouseover');
    cy.get('.portal-tooltip--shown').contains('Cloud Lösung');
    cy.get('#ownCloud').trigger('mouseleave');
    cy.get('.portal-tooltip--shown').should('not.exist');

    // Buttons ?
    // TODO: Implement differece between Ring and Icon color / get test criteria
    // const searchbutton = cy.get('[data-test="searchbutton"]');
    // searchbutton.should('not.have.class', 'header-button--is-active');
    // searchbutton.click();
    // searchbutton.should('have.class', 'header-button--is-active');
    //
    // const bellbutton = cy.get('[data-test="bellbutton"]');
    // bellbutton.should('not.have.class', 'header-button--is-active');
    // bellbutton.click();
    // bellbutton.should('have.class', 'header-button--is-active');
    //
    // const menubutton = cy.get('[data-test="menubutton"]');
    // menubutton.should('not.have.class', 'header-button--is-active');
    // menubutton.click();
    // menubutton.should('have.class', 'header-button--is-active');

    cy.get('button[aria-label="Button for navigation"]');

    // Burger Menu
    cy.get('button[aria-label="Button for navigation"]').click();

    cy.get('.portal-sidenavigation__link').contains('Anmelden');

    // TODO: Sidemenu broken when entries and not logged in?
    // TODO: empty portal (no tiles, menuitems)
    // TODO: logged out stuff (no tiles, menuitems)
    // TODO: create a permutation of possible tile states (read json from file and manipulate directly / reload page
    // TODO: Cookie Banner
    // https://help.univention.com/t/q-a-how-to-add-a-portal-tile-for-saml-login/10139
    // TODO: injection via tile
    // TODO: Is the loading animation loaded multiple times (see cypress time travel)
    // embedded tabs
    // Linktargets + Portaldefault
    // get a couple of screenshots of different viewports
    // TODO: Frames
    // https://en.wikipedia.org/wiki/Frame_(World_Wide_Web)
    // criticism there: no a11y, so maybe we got to scrap iframes for UPX/Dataport?
  });
});
