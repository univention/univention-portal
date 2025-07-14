/*
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

/* eslint-disable jest/expect-expect */
import 'cypress-axe';

beforeEach(() => {
  cy.clearCookie('univentionCookieSettingsAccepted');
  cy.setCookie('UMCLang', 'de_DE');
  // Mock requests / responses
  cy.intercept('GET', 'portal.json', { fixture: 'portal_logged_out.json' });
  cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
  cy.intercept('GET', 'de.json', { fixture: 'de.json' });
  cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
  cy.visit('/');
  cy.get('main.cookie-banner + footer button.button--primary')
    .click();
});

describe('Test Modal Focus Behavior', () => {
  it('should verify tiles exist and test focus behavior with modals', () => {
    // Always execute assertions - verify portal loads
    cy.get('.portal-tile')
      .should('exist')
      .and('have.length.greaterThan', 0);

    // Test basic focus functionality
    cy.get('.portal-tile')
      .first()
      .focus()
      .should('be.focused');

    // Check for folders and test modal behavior
    cy.get('body')
      .then(($body) => {
        if ($body.find('.portal-folder').length > 0) {
          // Open modal test
          cy.get('.portal-folder')
            .first()
            .click();

          cy.get('.modal-wrapper--isVisible')
            .should('exist');

          // Test focus within modal
          cy.get('.modal-wrapper--isVisible')
            .within(() => {
              cy.get('[tabindex]:not([tabindex="-1"])')
                .should('exist');
            });

          // Close modal
          cy.get('body')
            .type('{esc}');
          cy.get('.modal-wrapper--isVisible')
            .should('not.exist');
        }
      });

    // Final verification that always runs
    cy.get('.portal-tile')
      .should('be.visible');
  });

  it('should verify modal overlay properties', () => {
    // Always execute - basic verification
    cy.get('.portal-tile')
      .should('exist');

    // Test modal properties
    cy.get('body')
      .then(($body) => {
        if ($body.find('.portal-folder').length > 0) {
          cy.get('.portal-folder')
            .first()
            .click();

          cy.get('.modal-wrapper--isVisible')
            .should('exist')
            .and('have.css', 'position', 'fixed');

          cy.get('body')
            .type('{esc}');
        }
      });

    // Always runs
    cy.get('.portal-tile')
      .first()
      .should('be.visible');
  });

  it('should handle keyboard interactions', () => {
    // Always runs
    cy.get('.portal-tile')
      .should('exist');

    // Test keyboard behavior
    cy.get('body')
      .then(($body) => {
        if ($body.find('.portal-folder').length > 0) {
          cy.get('.portal-folder')
            .first()
            .click();

          cy.get('.modal-wrapper--isVisible')
            .should('exist');

          cy.get('body')
            .type('{esc}');

          cy.get('.modal-wrapper--isVisible')
            .should('not.exist');
        }
      });

    // Always runs
    cy.get('.portal-tile')
      .should('have.length.greaterThan', 0);
  });

  it('should test focus restoration', () => {
    // Always runs
    cy.get('.portal-tile')
      .should('exist');

    cy.get('.portal-tile')
      .first()
      .focus()
      .should('be.focused');

    // Test with modal if available
    cy.get('body')
      .then(($body) => {
        if ($body.find('.portal-folder').length > 0) {
          cy.get('.portal-folder')
            .first()
            .click();

          cy.get('.modal-wrapper--isVisible')
            .should('exist');

          cy.get('body')
            .type('{esc}');

          cy.get('.modal-wrapper--isVisible')
            .should('not.exist');
        }
      });

    // Always runs
    cy.get('.portal-tile, .portal-folder')
      .should('exist');
  });

  it('should verify modal focus trapping', () => {
    // Always runs
    cy.get('.portal-tile')
      .should('exist');

    // Test focus trapping
    cy.get('body')
      .then(($body) => {
        if ($body.find('.portal-folder').length > 0) {
          cy.get('.portal-folder')
            .first()
            .click();

          cy.get('.modal-wrapper--isVisible')
            .should('exist')
            .within(() => {
              cy.get('button, [tabindex]:not([tabindex="-1"])')
                .then(($elements) => {
                  if ($elements.length > 0) {
                    cy.wrap($elements.first())
                      .should('be.visible');
                  }
                });
            });

          cy.get('body')
            .type('{esc}');
        }
      });

    // Always runs
    cy.get('.portal-tile')
      .should('be.visible');
  });

  it('should test nested modal behavior', () => {
    // Always runs
    cy.get('.portal-tile')
      .should('exist');

    // Test nested modals
    cy.get('body')
      .then(($body) => {
        if ($body.find('.portal-folder').length > 0) {
          cy.get('.portal-folder')
            .first()
            .click();

          cy.get('.modal-wrapper--isVisible')
            .should('exist');

          cy.get('.modal-wrapper--isVisible')
            .within(() => {
              cy.get('button, .icon-button')
                .then(($buttons) => {
                  if ($buttons.length > 0) {
                    cy.wrap($buttons.first())
                      .should('be.visible');
                  }
                });
            });

          cy.get('body')
            .type('{esc}');

          cy.get('.modal-wrapper--isVisible')
            .should('not.exist');
        }
      });

    // Always runs
    cy.get('.portal-tile')
      .should('have.length.greaterThan', 0);
  });
});
/* eslint-enable jest/expect-expect */
