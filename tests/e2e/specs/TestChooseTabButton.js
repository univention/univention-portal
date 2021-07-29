// Iframes are inherently unsafe. Don't use them.

describe('ChooseTabButton Component', () => {
    it('ChooseTabButton.vue works correctly', () => {
      cy.intercept('GET', 'portal.json', { fixture: 'portal_choose_tab_button.json' });
      cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
      cy.intercept('GET', 'de.json', { fixture: 'de.json' });
      cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
      cy.setCookie('univentionCookieSettingsAccepted', 'doesthisneedavalue');
      cy.viewport(1024, 768);
      cy.visit('/');
      // first click results to first tab and first Iframe (first element in array)
      const testLinks = cy.get('a[href*="wikipedia"]');
      testLinks.should('have.length', 6);
      cy.get('[href="https://de.wikipedia.org/wiki/Test"]').click();
      cy.get('#headerTab__1').should('be.visible');
      cy.get('.portal-header__portal-name').click();
      cy.get('[href="https://de.wikipedia.org/wiki/Vue"]').click();
      cy.get('#headerTab__2').should('be.visible');
      cy.get('.portal-header__portal-name').click();
      cy.get('[href="https://en.wikipedia.org/wiki/Front_end_and_back_end"]').click();
      cy.get('.portal-header__portal-name').click();
      cy.get('[href="https://en.wikipedia.org/wiki/Climate_change"]').click();
      cy.get('#headerTab__3').should('not.be.visible');
      cy.get('#header-button-copy').should('be.visible');
      cy.wait(500);
      cy.get('#header-button-copy').click();
      cy.wait(500);
      cy.get('.modal-wrapper--isVisible').should('be.visible');
      cy.wait(500);
      
      const openElements = 4;
      cy.get('[data-test="portal-iframes"]').children().should('have.length', openElements);
      cy.get('.choose-tab').should('have.length', openElements);
      cy.get('.header-button__detail').contains(openElements);
      cy.wait(500);
      cy.get('#choose-tab__button--2').click();
      cy.get('#iframe-2').should('be.visible');
      cy.get('#header-button-copy').click();
      for (let i = 1; i <= openElements; i++) {
        cy.get(`[data-test="chooseTabCloseButton--1"]`).click();
        cy.get('.modal-wrapper--isVisible').should('be.visible');
      }
      cy.get('.modal-wrapper--isVisible').should('not.be.visible');
    });
  });
  