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
        testLinks.should('have.length', 6)
    });
  });
  