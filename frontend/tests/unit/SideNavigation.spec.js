// SPDX-License-Identifier: AGPL-3.0-only
// SPDX-FileCopyrightText: 2025 Univention GmbH

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
