// SPDX-License-Identifier: AGPL-3.0-only
// SPDX-FileCopyrightText: 2025 Univention GmbH

import { shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';

import PortalHeader from '@/components/PortalHeader.vue';

// Mock the login helper
jest.mock('@/jsHelper/login', () => ({
  login: jest.fn(),
  logout: jest.fn(),
}));

test('PortalHeader renders without LeftSidebar if not specified', async () => {
  const featureToggles = {
    left_sidebar: false,
  };

  // Create a mock Vuex store with required getters
  const store = createStore({
    modules: {
      tabs: {
        namespaced: true,
        getters: {
          activeTabId: () => 0,
          allTabs: () => [],
          savedScrollPosition: () => 0,
          numTabs: () => 0,
        },
      },
      portalData: {
        namespaced: true,
        getters: {
          editMode: () => false,
          portalAnnouncements: () => [],
        },
      },
      navigation: {
        namespaced: true,
        getters: {
          getActiveButton: () => '',
        },
        actions: {
          closeNotificationsSidebar: jest.fn(),
          setActiveButton: jest.fn(),
        },
      },
      notifications: {
        namespaced: true,
        getters: {
          numNotifications: () => 0,
        },
      },
      featureToggles: {
        namespaced: true,
        getters: {
          featureToggles: () => featureToggles,
        },
      },
    },
  });

  const wrapper = shallowMount(PortalHeader, {
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
      stubs: {
        region: {
          template: '<div><slot /></div>',
        },
        'header-button': true,
        'header-tab': true,
        'portal-search': true,
        'choose-tabs': true,
        'portal-title': true,
        'left-sidebar-navigation-button': true,
        'announcement': true,
        'tabindex-element': true,
      },
    },
  });

  // Test that when native_html_list is true, the navigation container is a ul element
  const navigationContainer = wrapper.find('[data-test="left-sidebar-button"]');
  expect(navigationContainer.exists()).toBe(false);
});

test('PortalHeader renders correctly', async () => {
  const featureToggles = {
    left_sidebar: true,
  };

  // Create a mock Vuex store with required getters
  const store = createStore({
    modules: {
      tabs: {
        namespaced: true,
        getters: {
          activeTabId: () => 0,
          allTabs: () => [],
          savedScrollPosition: () => 0,
          numTabs: () => 0,
        },
      },
      portalData: {
        namespaced: true,
        getters: {
          editMode: () => false,
          portalAnnouncements: () => [],
        },
      },
      navigation: {
        namespaced: true,
        getters: {
          getActiveButton: () => '',
        },
        actions: {
          closeNotificationsSidebar: jest.fn(),
          setActiveButton: jest.fn(),
        },
      },
      notifications: {
        namespaced: true,
        getters: {
          numNotifications: () => 0,
        },
      },
      featureToggles: {
        namespaced: true,
        getters: {
          featureToggles: () => featureToggles,
        },
      },
    },
  });

  const wrapper = shallowMount(PortalHeader, {
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
      stubs: {
        region: {
          template: '<div><slot /></div>',
        },
        'header-button': true,
        'header-tab': true,
        'portal-search': true,
        'choose-tabs': true,
        'portal-title': true,
        'left-sidebar-navigation-button': true,
        'announcement': true,
        'tabindex-element': true,
      },
    },
  });

  // Test that when native_html_list is true, the navigation container is a ul element
  const navigationContainer = wrapper.find('[data-test="left-sidebar-button"]');
  expect(navigationContainer.exists()).toBe(true);
});