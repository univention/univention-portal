/**
  Copyright 2021-2024 Univention GmbH

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
* */

import { shallowMount } from '@vue/test-utils';

import SideNavigation from '@/components/navigation/SideNavigation.vue';
import Vuex from 'vuex';

// Mock the login helper
jest.mock('@/jsHelper/login', () => ({
  login: jest.fn(),
  logout: jest.fn(),
}));

test('SideNavigation renders ul when native_html_list is true', async () => {
  const featureToggles = {
    native_html_list: true,
  };

  const store = new Vuex.Store({
    modules: {
      menu: {
        state: {
          menu: [
            {
              id: 'test-menu-1',
              title: { en_US: 'Test Menu Item' },
              href: '/test',
            },
          ],
        },
        getters: {
          getMenu: (state) => state.menu,
        },
        namespaced: true,
      },
      user: {
        state: {
          userState: { displayName: 'Test User' },
          isLoggedIn: true,
        },
        getters: {
          userState: (state) => state.userState,
          isLoggedIn: (state) => state.isLoggedIn,
        },
        namespaced: true,
      },
      featureToggles: {
        state: { featureToggles },
        getters: {
          featureToggles: (featureTogglesState) => featureTogglesState.featureToggles,
        },
        namespaced: true,
      },
      modal: {
        actions: {
          disableBodyScrolling: jest.fn(),
        },
        namespaced: true,
      },
      activity: {
        actions: {
          setRegion: jest.fn(),
        },
        namespaced: true,
      },
    },
  });
  store.dispatch = jest.fn();

  const wrapper = shallowMount(SideNavigation, {
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
      stubs: {
        region: {
          template: '<div><slot /></div>',
        },
      },
    },
  });

  // Test that when native_html_list is true, the navigation container is a ul element
  const navigationContainer = wrapper.find('[data-test="sideNavigation"]');
  expect(navigationContainer.exists()).toBe(true);
  expect(navigationContainer.element.tagName.toLowerCase()).toBe('ul');
  expect(navigationContainer.attributes('role')).toBe('list');
});

test('SideNavigation renders div when native_html_list is false', async () => {
  const featureToggles = {
    native_html_list: false,
  };

  const store = new Vuex.Store({
    modules: {
      menu: {
        state: {
          menu: [
            {
              id: 'test-menu-1',
              title: { en_US: 'Test Menu Item' },
              href: '/test',
            },
          ],
        },
        getters: {
          getMenu: (state) => state.menu,
        },
        namespaced: true,
      },
      user: {
        state: {
          userState: { displayName: 'Test User' },
          isLoggedIn: true,
        },
        getters: {
          userState: (state) => state.userState,
          isLoggedIn: (state) => state.isLoggedIn,
        },
        namespaced: true,
      },
      featureToggles: {
        state: { featureToggles },
        getters: {
          featureToggles: (featureTogglesState) => featureTogglesState.featureToggles,
        },
        namespaced: true,
      },
      modal: {
        actions: {
          disableBodyScrolling: jest.fn(),
        },
        namespaced: true,
      },
      activity: {
        actions: {
          setRegion: jest.fn(),
        },
        namespaced: true,
      },
    },
  });
  store.dispatch = jest.fn();

  const wrapper = shallowMount(SideNavigation, {
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
      stubs: {
        region: {
          template: '<div><slot /></div>',
        },
      },
    },
  });

  // Test that when native_html_list is false, the navigation container is a div element
  const navigationContainer = wrapper.find('[data-test="sideNavigation"]');
  expect(navigationContainer.exists()).toBe(true);
  expect(navigationContainer.element.tagName.toLowerCase()).toBe('div');
  expect(navigationContainer.attributes('role')).toBe('toolbar');
});
