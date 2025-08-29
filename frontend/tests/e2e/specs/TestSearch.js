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
      .should('have.attr', 'aria-label', 'search');

    cy.get(searchInput)
      .should('be.empty');

    cy.get(searchInput).type('test');
    cy.get(searchInput).should('have.value', 'test');

    cy.get(searchInput)
      .should('have.attr', 'aria-label', 'search');
  });

  it('Search input tab navigation works correctly', () => {
    // Focus on search button
    cy.get('[data-test="searchbutton"]')
      .focus()
      .should('be.focused');

    // Press Enter to open search
    cy.get('[data-test="searchbutton"]').type('{enter}');

    // Verify search input is now focused
    cy.get(searchInput)
      .should('be.focused');

    // Press Tab to move to close button
    cy.get(searchInput).type('{tab}');

    // Verify close button has focus (using its ID)
    cy.get('#portal-search-close-button')
      .should('be.focused');

    // Press Tab to move to bell button
    cy.get('#portal-search-close-button').type('{tab}');

    // Verify bell button has focus
    cy.get('#header-button-bell')
      .should('be.focused');

    // Verify we can continue tabbing to next element (not looping back)
    cy.get('#header-button-bell').type('{tab}');
    cy.get(searchInput).should('not.be.focused');
  });

  it('Search input reverse tab navigation works correctly', () => {
    clickOnSearchButton();

    // Start with search input focused
    cy.get(searchInput).should('be.focused');

    // Press Shift+Tab to move to search button
    cy.get(searchInput).type('{shift+tab}');

    // Verify search button has focus
    cy.get('[data-test="searchbutton"]')
      .should('be.focused');

    // Go forward again to close button
    cy.get('[data-test="searchbutton"]').type('{enter}');
    cy.get(searchInput).type('{tab}');

    // From close button, Shift+Tab should go to search input
    cy.get('#portal-search-close-button').type('{shift+tab}');
    cy.get(searchInput).should('be.focused');
  });

  it('Close button has proper focus styling and accessibility', () => {
    clickOnSearchButton();

    // Tab to close button
    cy.get(searchInput).type('{tab}');

    // Verify close button is focusable and has proper attributes
    cy.get('#portal-search-close-button')
      .should('be.focused')
      .should('have.attr', 'tabindex', '0')
      .should('have.attr', 'aria-label');

    // Test that close button works with keyboard
    cy.get('#portal-search-close-button').type('{enter}');

    // Verify search input is hidden after pressing Enter on close button
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
      .should('have.attr', 'aria-label', 'search');
  });
});
