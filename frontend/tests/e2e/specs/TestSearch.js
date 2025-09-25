/*
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
*/

import 'cypress-axe';

beforeEach(() => {
  cy.setCookie('UMCLang', 'de_DE');
  cy.intercept('GET', 'portal.json', { fixture: 'portal_logged_out.json' });
  cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
  cy.intercept('GET', 'de.json', { fixture: 'de.json' });
  cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
  cy.visit('/');
  cy.get('main.cookie-banner + footer button.button--primary').click();
});

const searchInput = '[data-test="searchInput"]';

const clickOnSearchButton = () => {
  cy.get('[data-test="searchbutton"]').should('not.have.class', 'header-button--is-active');
  cy.get(searchInput).should('not.exist'); // input exists after searchButton is clicked
  cy.get('[data-test="searchbutton"]').click();
  cy.get('[data-test="searchbutton"]').should('have.class', 'header-button--is-active');
  cy.get(searchInput).should('exist');
};

describe('Test Seach Component', () => {
  it('Tile title in results should match with the String "Blog"', () => {
    // make inputfield visible
    clickOnSearchButton();

    // test for tilename
    cy.contains('Handbuch').should('exist');
    cy.get(searchInput).type('Blog');
    cy.contains('Handbuch').should('not.exist');
    cy.contains('Blog').should('exist');
  });

  it('displays all the tiles in folder, when folder name is search query', () => {
    clickOnSearchButton();
    cy.contains('System- und Domäneneinstellungen').should('exist');
    cy.get(searchInput).type('Apps');
    cy.get('.portal-folder').should('exist');
    cy.contains('System- und Domäneneinstellungen').should('not.exist');
    cy.get('.portal-folder__thumbnails').find('.portal-folder__thumbnail')
      .should('have.length', 4);
  });

  it('displays only certain tiles in folder', () => {
    clickOnSearchButton();
    cy.get(searchInput).type('Blog');
    cy.get('.portal-folder').should('exist');
    cy.get('.portal-folder__thumbnails').find('.portal-folder__thumbnail')
      .should('have.length', 1);
  });

  it('Searches also for tile description', () => {
    // make inputfield visible
    clickOnSearchButton();

    // make sure the first tile is not our expected search result
    cy.get('.portal-tile').first()
      .contains('System- und Domäneneinstellungen')
      .should('not.exist');
    cy.get(searchInput).type('Univention Management Console zur Ver­wal­tung der UCS-Domäne und des lokalen Systems');
    // ensure that the first result is not by coincidence the search result
    cy.get('.portal-tile').should('have.length', 1);
    cy.get('.portal-tile').first()
      .contains('System- und Domäneneinstellungen');
  });

  it('Escape is working', () => {
    // make inputfield visible
    clickOnSearchButton();
    cy.get(searchInput).should('exist');
    cy.get('body').type('{esc}');
    cy.get(searchInput).should('not.exist');
  });

  it('General A11y test', () => {
    // make inputfield visible
    clickOnSearchButton();
    cy.injectAxe();
    cy.checkA11y(searchInput,
      {
        runOnly: {
          type: 'tag',
          values: ['wcag21aa'],
        },
      },
      cy.terminalLog,
      {
        skipFailures: false,
      },
    );
  });

  it('Search input has proper placeholder text for accessibility', () => {
    clickOnSearchButton();

    cy.get(searchInput)
      .should('have.attr', 'placeholder', 'Search…');

    cy.get(searchInput)
      .should('have.attr', 'aria-label', 'suche');

    cy.get(searchInput)
      .should('be.empty');

    cy.get(searchInput).type('test');
    cy.get(searchInput).should('have.value', 'test');

    cy.get(searchInput)
      .should('have.attr', 'aria-label', 'suche');
  });

  it.skip('Search input tab navigation works correctly', () => {
    // Focus on search button
    cy.get('#header-button-search')
      .focus()
      .should('be.focused');

    // Press Enter to open search
    cy.get('[data-test="searchbutton"]').click();

    // Verify search input is now focused
    cy.get(searchInput)
      .should('be.focused');

    // Test that close button can receive focus (simulating tab navigation)
    cy.get('#portal-search-close-button')
      .focus()
      .should('be.focused');

    // Test that bell button can receive focus (next in tab order)
    cy.get('#header-button-bell')
      .focus()
      .should('be.focused');

    // Verify search input can lose focus (tab order works)
    cy.get('#header-button-bell').focus();
    cy.get(searchInput).should('not.be.focused');
  });

  it.skip('Search input reverse tab navigation works correctly', () => {
    clickOnSearchButton();

    // Start with search input focused
    cy.get(searchInput).should('be.focused');

    // Test reverse tab navigation - search button should be focusable
    cy.get('#header-button-search')
      .focus()
      .should('be.focused');

    // Reopen search if it was closed and test close button focus
    cy.get(searchInput).then(($input) => {
      if ($input.length === 0) {
        cy.get('[data-test="searchbutton"]').click();
      }
    });

    cy.get('#portal-search-close-button')
      .focus()
      .should('be.focused');

    // Test that we can focus back to search input (reverse navigation)
    cy.get(searchInput)
      .focus()
      .should('be.focused');
  });

  it('Close button has proper focus styling and accessibility', () => {
    clickOnSearchButton();

    // Focus on close button to test accessibility
    cy.get('#portal-search-close-button')
      .focus()
      .should('be.focused')
      .should('have.attr', 'tabindex', '0')
      .should('have.attr', 'aria-label');

    // Test that close button works with keyboard (click instead of enter due to Cypress 6.x limitations)
    cy.get('#portal-search-close-button').click();

    // Verify search input is hidden after clicking close button
    cy.get(searchInput).should('not.exist');
  });

  it('WCAG 2.2 compliance for search input labeling', () => {
    clickOnSearchButton();
    cy.injectAxe();

    // Test WCAG 2.2 Success Criterion 3.3.2 Labels or Instructions
    cy.checkA11y(searchInput, {
      rules: {
        label: { enabled: true },
        'aria-valid-attr-value': { enabled: true },
        'aria-valid-attr': { enabled: true },
      },
    });

    // Verify both visible (placeholder) and programmatic (aria-label) labeling
    cy.get(searchInput)
      .should('have.attr', 'placeholder', 'Search…')
      .should('have.attr', 'aria-label', 'suche');
  });
});
