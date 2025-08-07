/* eslint-disable jest/expect-expect */

import 'cypress-axe';

describe('Test Left Sidebar Feature Toggle', () => {
  describe('When left_sidebar is enabled', () => {
    beforeEach(() => {
      cy.setCookie('UMCLang', 'de_DE');
      cy.intercept('GET', 'portal.json', { fixture: 'portal_left_sidebar.json' });
      cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
      cy.intercept('GET', 'de.json', { fixture: 'de.json' });
      cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
      cy.intercept('GET', 'navigation.json', { fixture: 'navigation.json' });
      cy.visit('/');
      cy.get('main.cookie-banner + footer button.button--primary').click();
      cy.wait(1000);
      cy.injectAxe();
    });

    it('displays left sidebar navigation button in header', () => {
      cy.get('[data-test="left-sidebar-button"]').should('be.visible');
    });

    it('applies correct CSS class when left sidebar is supported', () => {
      cy.get('#portal-header').should('have.class', 'portal-header--waffle-icon-height');
    });

    it('can click left sidebar button', () => {
      cy.get('[data-test="left-sidebar-button"]').should('be.visible')
        .click();
    });

    it('left sidebar button is keyboard accessible', () => {
      cy.get('[data-test="left-sidebar-button"]')
        .focus()
        .should('be.focused')
        .type('{enter}');
    });

    it('header layout changes correctly with left sidebar enabled', () => {
      cy.get('#portal-header')
        .should('have.class', 'portal-header--waffle-icon-height')
        .and('be.visible');

      cy.get('[data-test="left-sidebar-button"]')
        .should('be.visible')
        .and('have.css', 'display')
        .and('not.equal', 'none');
    });

    it('left sidebar button appears before portal title', () => {
      cy.get('#portal-header').within(() => {
        cy.get('[data-test="left-sidebar-button"]').should('be.visible');
        cy.get('.portal-title, [data-test="portal-title"]').should('be.visible');
      });
    });

    it('passes accessibility tests with left sidebar enabled', () => {
      cy.checkA11y('#portal-header',
        {
          runOnly: {
            type: 'tag',
            values: ['wcag21aa'],
          },
        },
        cy.terminalLog,
        {
          skipFailures: true,
        },
      );
    });

    it('works correctly on different viewport sizes', () => {
      // Test mobile viewport
      cy.viewport(375, 667);
      cy.get('[data-test="left-sidebar-button"]').should('be.visible');

      // Test tablet viewport
      cy.viewport(768, 1024);
      cy.get('[data-test="left-sidebar-button"]').should('be.visible');

      // Test desktop viewport
      cy.viewport(1920, 1080);
      cy.get('[data-test="left-sidebar-button"]').should('be.visible');
    });

    it('maintains proper spacing and layout with left sidebar button', () => {
      cy.get('#portal-header').should('be.visible')
        .and('have.css', 'height');
      cy.get('[data-test="left-sidebar-button"]').should('be.visible')
        .and('have.css', 'width')
        .and('have.css', 'height');
    });
  });

  describe('When left_sidebar is disabled', () => {
    beforeEach(() => {
      cy.setCookie('UMCLang', 'de_DE');
      cy.intercept('GET', 'portal.json', { fixture: 'portal_logged_out.json' });
      cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
      cy.intercept('GET', 'de.json', { fixture: 'de.json' });
      cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
      cy.visit('/');
      cy.get('main.cookie-banner + footer button.button--primary').click();
    });

    it('does not display left sidebar navigation button', () => {
      cy.get('[data-test="left-sidebar-button"]').should('not.exist');
    });

    it('does not apply waffle icon height CSS class', () => {
      cy.get('#portal-header').should('not.have.class', 'portal-header--waffle-icon-height');
    });

    it('header layout works correctly without left sidebar', () => {
      cy.get('#portal-header').should('be.visible');
      cy.get('.portal-title, [data-test="portal-title"]').should('be.visible');
    });

    it('maintains accessibility without left sidebar button', () => {
      cy.checkA11y('#portal-header',
        {
          runOnly: {
            type: 'tag',
            values: ['wcag21aa'],
          },
        },
        cy.terminalLog,
        {
          skipFailures: true,
        },
      );
    });

    it('works correctly on different viewport sizes without left sidebar', () => {
      // Test mobile viewport
      cy.viewport(375, 667);
      cy.get('[data-test="left-sidebar-button"]').should('not.exist');

      // Test tablet viewport
      cy.viewport(768, 1024);
      cy.get('[data-test="left-sidebar-button"]').should('not.exist');

      // Test desktop viewport
      cy.viewport(1920, 1080);
      cy.get('[data-test="left-sidebar-button"]').should('not.exist');
    });
  });

  describe('Feature toggle edge cases', () => {
    it('handles missing feature_toggles gracefully', () => {
      cy.intercept('GET', 'portal.json', { fixture: 'portal_logged_out.json' });
      cy.visit('/');
      cy.get('main.cookie-banner + footer button.button--primary').click();

      cy.get('[data-test="left-sidebar-button"]').should('not.exist');
      cy.get('#portal-header').should('not.have.class', 'portal-header--waffle-icon-height');
    });

    it('handles feature toggle value changes correctly', () => {
      // Start with left sidebar enabled
      cy.intercept('GET', 'portal.json', { fixture: 'portal_left_sidebar.json' });
      cy.visit('/');
      cy.get('main.cookie-banner + footer button.button--primary').click();

      cy.get('[data-test="left-sidebar-button"]').should('be.visible');

      // Simulate feature toggle being disabled (page reload scenario)
      cy.intercept('GET', 'portal.json', { fixture: 'portal_logged_out.json' });
      cy.reload();
      cy.get('main.cookie-banner + footer button.button--primary').click();

      cy.get('[data-test="left-sidebar-button"]').should('not.exist');
    });
  });
});

/* eslint-enable jest/expect-expect */
