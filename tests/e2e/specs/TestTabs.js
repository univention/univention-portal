// Iframes are inherently unsafe. Don't use them.

describe('General Tests', () => {
  it('shows Iframe Tabs', () => {
    // TODO: Same origin html fake for linktarget tests
    cy.readFile('public/data/portal.json').then((portal) => {
      portal.entries[0].linkTarget = 'embedded';
      cy.intercept('GET', 'portal.json', portal);
      cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
      cy.intercept('GET', 'de.json', { fixture: 'de.json' });
      cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
      cy.setCookie('univentionCookieSettingsAccepted', 'doesthisneedavalue');
      cy.visit('/');
      // first click results to first tab and first Iframe (first element in array)
      cy.get('.portal-category .portal-tile').last().click();
      cy.get('#iframe-1').should('be.visible');
      // click to portal
      cy.get('.portal-header__portal-name').click();
      cy.get('#portalCategories').should('be.visible');
      cy.get('iframe').should('not.be.visible');
      // click to first tab expects to have visible iframe
      cy.get('#headerTab__1').click();
      cy.get('iframe').should('be.visible');
      // go back to portal to open second tab
      cy.get('.portal-header__portal-name').click();
      cy.get('#portalCategories').should('be.visible');
      cy.get('[href="https://doc.owncloud.com/server/10.0/admin_manual/"]').click();
      cy.get('iframe').should('be.visible');
      // now we have two tabs and can switch between them
      cy.get('[data-test="header-tabs"]').children().should('have.length', 2)
      cy.get('#headerTab__1').click();
      cy.get('#iframe-1').should('be.visible');
      cy.get('iframe').should('be.focused');
      // closing last tab of two
      cy.get('#headerTab__2').click();
      cy.get('#iframe-2').should('be.visible');
      cy.get('#headerTab__2').children().last().click();
      cy.get('#portalCategories').should('be.visible');
      cy.get('[data-test="header-tabs"]').children().should('have.length', 1)
      cy.get('[data-test="portal-iframes"]').children().should('have.length', 1)
      // closing remaining tab
      cy.get('#headerTab__1').children().last().click();
      cy.get('#portalCategories').should('be.visible');
      cy.get('[data-test="header-tabs"]').children().should('have.length', 0)
      cy.get('[data-test="portal-iframes"]').children().should('have.length', 0)
    });
  });
  it('test store 1', () => {
    // TODO: Same origin html fake for linktarget tests
    cy.readFile('public/data/portal.json').then((portal) => {
      portal.entries[0].linkTarget = 'embedded';
      cy.intercept('GET', 'portal.json', portal);
      cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
      cy.intercept('GET', 'de.json', { fixture: 'de.json' });
      cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
      cy.setCookie('univentionCookieSettingsAccepted', 'doesthisneedavalue');
      cy.visit('/');
      // first click results to first tab and first Iframe (first element in array)
      // cy.get('.portal-category .portal-tile').last().click();
      // cy.get('#iframe-1').should('be.visible');
      const getStore = () => cy.window().its('store');
      getStore().its('state').should('have.keys', ['activeTabIndex', 'tabs', 'scrollPosition'])
    });
  });
  it('test store 2', () => {
    // TODO: Same origin html fake for linktarget tests
    cy.readFile('public/data/portal.json').then((portal) => {
      cy.visit('/');
      const getStore = () => cy.window().its('store');
      // first click results to first tab and first Iframe (first element in array)
      // cy.get('.portal-category .portal-tile').last().click();
      // cy.get('#iframe-1').should('be.visible');
      getStore().its('state').should('have.keys', ['activeTabIndex', 'tabs', 'scrollPosition'])
    });
  });
});
