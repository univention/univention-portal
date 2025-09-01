/*
  Copyright 2025 Univention GmbH

  https://www.univention.de/

  All rights reserved.

  The source code of this program is made available
  under the terms of the GNU Affero General Public License version 3
  (GNU AGPL V3) as published by the Free Software Foundation.

  Binary versions of this program provided by Univention to you as
  well as other copyrighted, protected or trademarked materials like
  Logos, graphics, fonts, specific documentations and configurations,
  cryptographic keys etc. are subject to a license agreement between
  you and Univention and not subject to the GNU AGPL V3.

  In the case you use this program under the terms of the GNU AGPL V3,
  the program is provided in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License with the Debian GNU/Linux or Univention distribution in file
  /usr/share/common-licenses/AGPL-3; if not, see
  <https://www.gnu.org/licenses/>.
*/

describe('Test api/me endpoint', () => {
  it('Does not call api/me when feature toggle is disabled', () => {
    cy.intercept('GET', 'portal.json', { fixture: 'portal.json' }).as('portal');
    cy.intercept('GET', '**/api/me.json', { fixture: 'api-me.json' }).as('apiMe');
    cy.visit('/');
    cy.wait('@portal');
    cy.get('@apiMe.all').should('have.length', 0);
  });

  it('Calls api/me when feature toggle is enabled', () => {
    cy.intercept('GET', 'portal.json', {
      fixture: 'portal-api-me-enabled.json',
    }).as('portal');
    cy.intercept('GET', '**/api/me.json', { fixture: 'api-me.json' }).as('apiMe');
    cy.visit('/');
    cy.wait('@portal');
    cy.wait('@apiMe');
  });

  it('Correctly stores user data from api/me', () => {
    cy.intercept('GET', 'portal.json', {
      fixture: 'portal-api-me-enabled.json',
    }).as('portal');
    cy.intercept('GET', '**/api/me.json', { fixture: 'api-me.json' }).as('apiMe');
    cy.visit('/');
    cy.wait('@portal');
    cy.wait('@apiMe');
    cy.window()
      .its('store.state.user.user')
      .should('deep.include', { firstname: 'Test', lastname: 'User' });
  });

  it('Handles api/me error gracefully when feature toggle is enabled', () => {
    cy.intercept('GET', 'portal.json', {
      fixture: 'portal-api-me-enabled.json',
    });
    cy.intercept('GET', '**/api/me.json', { statusCode: 500 });
    cy.visit('/');
  });
});
