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
  cy.intercept('GET', '/portal.json', { fixture: 'portal_logged_in_with_news_and_quicklinks.json' });
  cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
  cy.intercept('GET', 'de.json', { fixture: 'de.json' });
  cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
  // Mock newsfeed RSS/XML response - must match the exact URL from the fixture
  cy.intercept('GET', 'https://blog.example.com/feed', { fixture: 'newsfeed.xml' }).as('newsfeedRequest');
  cy.intercept('GET', '**/feed', { fixture: 'newsfeed.xml' }).as('anyFeedRequest');
  cy.intercept('GET', '**/blog.example.com/**', { fixture: 'newsfeed.xml' }).as('blogRequest');
  cy.visit('/');
  cy.get('main.cookie-banner + footer button.button--primary')
    .click();
});

describe('Test Modal Focus Behavior', () => {
  it('every link and button should initially have tabindex 0', () => {
    // Wait for page to fully load
    cy.get('.portal-tile')
      .should('exist')
      .and('have.length.greaterThan', 0);

    // Test portal-folder elements (if they exist)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-folder"]').length > 0) {
        cy.get('[data-test="portal-folder"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '0');
          });
      }
    });

    // Test portal-tile elements (but exclude minified ones)
    cy.get('[data-test="tileLink"]')
      .should('exist')
      .not('.portal-tile--minified')
      .each(($el) => {
        cy.wrap($el)
          .should('have.attr', 'tabindex', '0');
      });

    // Test portal-newsfeed-view-all elements (if newsfeed exists)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-newsfeed-view-all"]').length > 0) {
        cy.get('[data-test="portal-newsfeed-view-all"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '0');
          });
      }
    });

    // Test portal-newsfeed-item elements (if newsfeed items exist)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-newsfeed-item"]').length > 0) {
        cy.get('[data-test="portal-newsfeed-item"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '0');
          });
      }
    });

    // Test portal-quick-draft-entry elements (if quick links exist)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-quick-draft-entry"]').length > 0) {
        cy.get('[data-test="portal-quick-draft-entry"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '0');
          });
      }
    });

    // Test portal-corner-link elements (if corner links exist)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-corner-link"]').length > 0) {
        cy.get('[data-test="portal-corner-link"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '0');
          });
      }
    });
  });

  it('every link and button should have tabindex -1 when a modal is open', () => {
    // Wait for page to fully load
    cy.get('.portal-tile')
      .should('exist')
      .and('have.length.greaterThan', 0);

    cy.get('[data-test="portal-folder"]').first()
      .click();

    // Wait for modal to open
    cy.get('.modal-wrapper--isVisible')
      .should('exist');

    // Test portal tiles OUTSIDE the modal should have tabindex -1 (background elements)
    cy.get('[data-test="tileLink"]')
      .should('exist')
      .not('.portal-tile--minified')
      .not('.modal-wrapper--isVisible [data-test="tileLink"]') // Exclude tiles inside modal
      .each(($el) => {
        cy.wrap($el)
          .should('have.attr', 'tabindex', '-1');
      });

    // Test portal tiles INSIDE the modal should have tabindex 0 (focusable in modal)
    cy.get('.modal-wrapper--isVisible [data-test="tileLink"]')
      .then(($modalTiles) => {
        if ($modalTiles.length > 0) {
          cy.wrap($modalTiles)
            .not('.portal-tile--minified')
            .each(($el) => {
              cy.wrap($el)
                .should('have.attr', 'tabindex', '0');
            });
        }
      });

    // Test portal-newsfeed-view-all elements (if newsfeed exists)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-newsfeed-view-all"]').length > 0) {
        cy.get('[data-test="portal-newsfeed-view-all"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '0');
          });
      }
    });

    // Test portal-newsfeed-item elements (if newsfeed items exist)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-newsfeed-item"]').length > 0) {
        cy.get('[data-test="portal-newsfeed-item"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '-1');
          });
      }
    });

    // Test portal-quick-draft-entry elements (if quick links exist)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-quick-draft-entry"]').length > 0) {
        cy.get('[data-test="portal-quick-draft-entry"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '-1');
          });
      }
    });

    // Test portal-corner-link elements (if corner links exist)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-corner-link"]').length > 0) {
        cy.get('[data-test="portal-corner-link"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '-1');
          });
      }
    });
  });

  it('every link and button should have tabindex 0 when a modal is opened and closed again', () => {
    // Wait for page to fully load
    cy.get('.portal-tile')
      .should('exist')
      .and('have.length.greaterThan', 0);

    cy.get('[data-test="portal-folder"]').first()
      .click();

    // Wait for the modal to become visible and fully loaded
    cy.get('.modal-wrapper--isVisible')
      .should('exist')
      .and('be.visible');

    // Wait a bit for animations to complete
    cy.wait(500);

    // Close the modal using ESC key (most reliable method)
    cy.get('body').type('{esc}');

    // Alternative: If ESC doesn't work, try clicking on the modal backdrop
    // cy.get('.modal-wrapper--isVisible').then(($modal) => {
    //   const rect = $modal[0].getBoundingClientRect();
    //   cy.get('.modal-wrapper--isVisible').click(rect.width - 10, 10);
    // });

    // Wait for modal to close
    cy.get('.modal-wrapper--isVisible')
      .should('not.exist');

    cy.get('[data-test="tileLink"]')
      .should('exist')
      .not('.portal-tile--minified')
      .each(($el) => {
        cy.wrap($el)
          .should('have.attr', 'tabindex', '0');
      });

    // Test portal-newsfeed-view-all elements (if newsfeed exists)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-newsfeed-view-all"]').length > 0) {
        cy.get('[data-test="portal-newsfeed-view-all"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '0');
          });
      }
    });

    // Test portal-newsfeed-item elements (if newsfeed items exist)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-newsfeed-item"]').length > 0) {
        cy.get('[data-test="portal-newsfeed-item"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '0');
          });
      }
    });

    // Test portal-quick-draft-entry elements (if quick links exist)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-quick-draft-entry"]').length > 0) {
        cy.get('[data-test="portal-quick-draft-entry"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '0');
          });
      }
    });

    // Test portal-corner-link elements (if corner links exist)
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="portal-corner-link"]').length > 0) {
        cy.get('[data-test="portal-corner-link"]')
          .each(($el) => {
            cy.wrap($el)
              .should('have.attr', 'tabindex', '0');
          });
      }
    });
  });
});
/* eslint-enable jest/expect-expect */
