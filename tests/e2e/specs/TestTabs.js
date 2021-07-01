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
      cy.get('.portal-category .portal-tile').last().click();
      // cypress can't look into frames out of the box
      cy.get('iframe').should('be.visible');
      cy.get('.portal-header__portal-name').click();
      cy.get('#portalCategories').should('be.visible');
      cy.get('iframe').should('not.be.visible');
      cy.get('#headerTab__1').click();
      cy.get('iframe').should('be.visible');
      
      cy.get('[href="https://doc.owncloud.com/server/10.0/admin_manual/"]').click();
      cy.get('iframe').should('be.visible');
      cy.get('data-test="header-tabs"').children().should('have.length', 2)
      // cy.get('#close-tab-1').click();
    });
  });
  // it('shows Iframe Tabs', () => {
  //   // stuff selenium can't do #2: mock requests / responses
  //   const portal = cy.readFile('public/data/portal.json').then((portal) => {
  //     portal.entries[0].linkTarget = 'samewindow';
  //     cy.intercept('GET', 'portal.json', portal);
  //     cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
  //     cy.intercept('GET', 'de.json', { fixture: 'de.json' });
  //     cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
  //     cy.setCookie('univentionCookieSettingsAccepted', 'doesthisneedavalue');
  //     cy.visit('/');
  //     // cy.get('#ownCloud a').
  //     // // cypress can't look into frames out of the box
  //     // cy.get('iframe').should('be.visible');
  //     // cy.get('.portal-header__portal-name').click();
  //     // cy.get('iframe').should('not.be.visible');
  //     // cy.get('#headerTab__1').click();
  //     // cy.get('iframe').should('be.visible');
  //     // cy.get('#header-button-x').click();
  //   });
  // });
});
