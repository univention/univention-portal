/*
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
*/

import 'cypress-axe';
// import terminalLog from './terminallog';

beforeEach(() => {
  cy.setCookie('UMCLang', 'de_DE');
  cy.intercept('GET', 'portal.json', { fixture: 'portal_logged_in.json' });
  cy.intercept('GET', 'meta.json', { fixture: 'meta.json' });
  cy.intercept('GET', 'de.json', { fixture: 'de.json' });
  cy.intercept('GET', 'languages.json', { fixture: 'languages.json' });
  cy.visit('/');
  cy.get('main.cookie-banner + footer button.button--primary').click();

  cy.injectAxe();
});

describe('Test Side Navigation', () => {
  it('test arrow down key navigation to test circular navigation', () => {
    cy.get('[data-test="navigationbutton"]').click();
    cy.get('[data-test="logButton"]').focus();
    cy.get('[data-test="logButton"]').type('{downarrow}');
    cy.get('[data-test="menuItem"]').first()
      .should('have.focus');
    cy.get('[data-test="menuItem"]').each(($item, index, $list) => {
      cy.wrap($item).type('{downarrow}');
      if (index === $list.length - 1) {
        cy.get('[data-test="openEditmodeButton"]').should('have.focus');
      } else {
        cy.get('[data-test="menuItem"]').eq(index + 1)
          .should('have.focus');
      }
    });
    cy.get('[data-test="openEditmodeButton"]').should('have.focus');
    cy.get('[data-test="openEditmodeButton"]').type('{downarrow}');
    cy.get('[data-test="logButton"]').should('have.focus');
  });

  it('test arrow up key navigation to test circular navigation', () => {
    cy.get('[data-test="navigationbutton"]').click();
    cy.get('[data-test="logButton"]').focus();
    cy.get('[data-test="logButton"]').type('{uparrow}');
    cy.get('[data-test="openEditmodeButton"]').first()
      .should('have.focus');
    cy.get('[data-test="openEditmodeButton"]').type('{uparrow}');
    cy.get('[data-test="menuItem"]').last()
      .should('have.focus');
    cy.get('[data-test="menuItem"]').then(($items) => {
      // Iterate through items in reverse order (from last to first)
      for (let i = $items.length - 1; i >= 0; i -= 1) {
        cy.get('[data-test="menuItem"]').eq(i)
          .type('{uparrow}');
        if (i === 0) {
          cy.get('[data-test="logButton"]').should('have.focus');
        } else {
          cy.get('[data-test="menuItem"]').eq(i - 1)
            .should('have.focus');
        }
      }
    });
    cy.get('[data-test="logButton"]').should('have.focus');
    cy.get('[data-test="logButton"]').type('{uparrow}');
    cy.get('[data-test="openEditmodeButton"]').should('have.focus');
  });

  it.skip('test tab key navigation to test circular navigation', () => {
    // tab navigation not working yet. waiting for cypress update
  });

  it('make a11y test', () => {
    // Inject the axe-core library
    // first a11y test
    cy.checkA11y('.edit-mode-side-navigation__form',
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
});
