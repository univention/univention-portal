// SPDX-License-Identifier: AGPL-3.0-only
// SPDX-FileCopyrightText: 2026 Univention GmbH

import { shallowMount, mount } from '@vue/test-utils';
import Vuex from 'vuex';

import SideNavigation from '@/components/navigation/SideNavigation.vue';

// Mock the login helper
jest.mock('@/jsHelper/login', () => ({
  login: jest.fn(),
  logout: jest.fn(),
}));

// Helper function to create a Vuex store with default configuration
function createTestStore(overrides = {}) {
  const defaultConfig = {
    menu: [
      {
        id: 'test-menu-1',
        title: { en_US: 'Test Menu Item' },
        href: '/test',
      },
    ],
    featureToggles: {
      native_html_list: false,
    },
    userState: { displayName: 'Test User' },
    isLoggedIn: true,
    metaData: {
      fqdn: 'test.example.com',
      locale: 'en_US',
    },
  };

  const config = { ...defaultConfig, ...overrides };

  const store = new Vuex.Store({
    modules: {
      menu: {
        state: {
          menu: config.menu,
        },
        getters: {
          getMenu: (state) => state.menu,
        },
        namespaced: true,
      },
      user: {
        state: {
          userState: config.userState,
          isLoggedIn: config.isLoggedIn,
        },
        getters: {
          userState: (state) => state.userState,
          isLoggedIn: (state) => state.isLoggedIn,
        },
        namespaced: true,
      },
      featureToggles: {
        state: { featureToggles: config.featureToggles },
        getters: {
          featureToggles: (featureTogglesState) => featureTogglesState.featureToggles,
        },
        namespaced: true,
      },
      metaData: {
        state: {
          metaData: config.metaData,
        },
        getters: {
          getMeta: (state) => state.metaData,
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
      navigation: {
        actions: {
          setActiveButton: jest.fn(),
        },
        namespaced: true,
      },
    },
  });

  store.dispatch = jest.fn();
  return store;
}

// Helper function to create wrapper with default configuration
function createWrapper(mountType = shallowMount, storeOverrides = {}, wrapperOptions = {}) {
  const store = createTestStore(storeOverrides);

  const defaultOptions = {
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
  };

  const options = {
    ...defaultOptions,
    ...wrapperOptions,
    global: {
      ...defaultOptions.global,
      ...wrapperOptions.global,
    },
  };

  return mountType(SideNavigation, options);
}

test('SideNavigation renders ul when native_html_list is true', async () => {
  const wrapper = createWrapper(shallowMount, {
    featureToggles: { native_html_list: true },
  });

  const navigationContainer = wrapper.find('[data-test="sideNavigation"]');
  expect(navigationContainer.exists()).toBe(true);
  expect(navigationContainer.element.tagName.toLowerCase()).toBe('ul');
});

test('SideNavigation renders div when native_html_list is false', async () => {
  const wrapper = createWrapper(shallowMount, {
    featureToggles: { native_html_list: false },
  });

  const navigationContainer = wrapper.find('[data-test="sideNavigation"]');
  expect(navigationContainer.exists()).toBe(true);
  expect(navigationContainer.element.tagName.toLowerCase()).toBe('div');
  expect(navigationContainer.attributes('role')).toBe('list');
});

test('hasSubmenu method returns false for items without submenus', () => {
  const wrapper = createWrapper(shallowMount, {}, {
    global: {
      stubs: {
        region: {
          template: '<div><slot /></div>',
        },
        'menu-item': true,
      },
    },
  });

  const menuItem = { id: 'simple-menu-item', title: { en_US: 'Simple Menu Item' }, href: '/simple' };
  expect(wrapper.vm.hasSubmenu(menuItem)).toBeFalsy();
});

test('hasSubmenu method returns true for items with submenus', () => {
  const wrapper = createWrapper(shallowMount, {}, {
    global: {
      stubs: {
        region: {
          template: '<div><slot /></div>',
        },
        'menu-item': true,
      },
    },
  });

  const menuItem = {
    id: 'parent-menu-item',
    title: { en_US: 'Parent Menu Item' },
    href: '/parent',
    subMenu: [{ id: 'child-1', title: { en_US: 'Child 1' }, href: '/child1' }],
  };
  expect(wrapper.vm.hasSubmenu(menuItem)).toBe(true);
});

test('Submenu should not have have aria-role and aria-expanded', async () => {
  const wrapper = createWrapper(shallowMount, {
    menu: [
      {
        id: 'parent-with-submenu',
        title: { en_US: 'Parent with Submenu' },
        href: '/parent',
        subMenu: [
          {
            id: 'child-item',
            title: { en_US: 'Child Item' },
            href: '/child',
          },
        ],
      },
    ],
  }, {
    global: {
      stubs: {
        region: {
          template: '<div v-bind="$attrs"><slot /></div>',
          inheritAttrs: false,
        },
        'menu-item': {
          template: '<div class="menu-item-stub"><slot /></div>',
        },
      },
    },
  });

  expect(wrapper.find('#portal-sidenavigation-sub').exists()).toBe(false);

  await wrapper.setData({
    subMenuVisible: true,
    menuParent: 0,
  });

  const submenu = wrapper.find('#portal-sidenavigation-sub');
  expect(submenu.exists()).toBe(true);
  expect(submenu.attributes('role')).toBe(undefined);
  expect(submenu.attributes('aria-expanded')).toBe(undefined);
});

test('Integration: Submenu toggle functionality works correctly', async () => {
  const wrapper = createWrapper(shallowMount, {
    menu: [
      {
        id: 'toggleable-menu',
        title: { en_US: 'Toggleable Menu' },
        href: '/toggle',
        subMenu: [
          {
            id: 'sub-item-1',
            title: { en_US: 'Sub Item 1' },
            href: '/sub1',
          },
          {
            id: 'sub-item-2',
            title: { en_US: 'Sub Item 2' },
            href: '/sub2',
          },
        ],
      },
    ],
  }, {
    global: {
      stubs: {
        region: {
          template: '<div v-bind="$attrs"><slot /></div>',
          inheritAttrs: false,
        },
        'menu-item': {
          template: '<div class="menu-item-stub"><slot /></div>',
        },
      },
    },
  });

  // Initially: submenu hidden, parent has aria-haspopup
  expect(wrapper.find('#portal-sidenavigation-sub').exists()).toBe(false);

  // Simulate clicking on menu item with submenu (toggleMenu method)
  await wrapper.vm.toggleMenu(0);

  const submenu = wrapper.find('#portal-sidenavigation-sub');
  expect(submenu.exists()).toBe(true);
  expect(submenu.attributes('role')).toBe(undefined);
  expect(submenu.attributes('aria-expanded')).toBe(undefined);
  expect(wrapper.vm.subMenuVisible).toBe(true);
  expect(wrapper.vm.menuParent).toBe(0);

  // Toggle again to close
  await wrapper.vm.toggleMenu();

  // After second toggle: submenu hidden again
  expect(wrapper.find('#portal-sidenavigation-sub').exists()).toBe(false);
  expect(wrapper.vm.subMenuVisible).toBe(false);
});

test('Submenu button should have correct sr only label', async () => {
  const wrapper = createWrapper(mount, {
    menu: [
      {
        id: 'toggleable-menu',
        title: { en_US: 'Toggleable Menu' },
        href: '/toggle',
        subMenu: [
          {
            id: 'sub-item-1',
            title: { en_US: 'Sub Item 1' },
            href: '/sub1',
            linkTarget: 'newwindow',
          },
          {
            id: 'sub-item-2',
            title: { en_US: 'Sub Item 2' },
            href: '/sub2',
          },
        ],
      },
    ],
  });

  // Simulate clicking on menu item with submenu (toggleMenu method)
  await wrapper.vm.toggleMenu(0);

  wrapper.find('#portal-sidenavigation-sub');

  const submenuItemSrOnlyLabels = wrapper.findAll('.sr-only');
  expect(submenuItemSrOnlyLabels.at(0).text()).toBe('Close Submenu');
  expect(submenuItemSrOnlyLabels.at(1).text()).toBe('New Tab');
});

test('Menuitem with children should have correct aria attributes', async () => {
  const wrapper = createWrapper(mount, {
    menu: [
      {
        id: 'toggleable-menu',
        title: { en_US: 'Toggleable Menu' },
        href: '/toggle',
        subMenu: [
          {
            id: 'sub-item-1',
            title: { en_US: 'Sub Item 1' },
            href: '/sub1',
            linkTarget: 'newwindow',
          },
          {
            id: 'sub-item-2',
            title: { en_US: 'Sub Item 2' },
            href: '/sub2',
          },
        ],
      },
    ],
  });

  wrapper.find('#portal-sidenavigation');

  const menuItem = wrapper.findAll('[data-test="menuItem"]').at(0);
  expect(menuItem.attributes('aria-haspopup')).toBe(undefined);
  expect(menuItem.attributes('aria-expanded')).toBe('false');
});

test('Menuitem without children should not have aria-expanded', async () => {
  const wrapper = createWrapper(mount, {
    menu: [
      {
        id: 'toggleable-menu',
        title: { en_US: 'Toggleable Menu' },
        href: '/toggle',
        subMenu: [
          {
            id: 'sub-item-1',
            title: { en_US: 'Sub Item 1' },
            href: '/sub1',
            linkTarget: 'newwindow',
          },
          {
            id: 'sub-item-2',
            title: { en_US: 'Sub Item 2' },
            href: '/sub2',
          },
        ],
      },
      {
        id: 'simple-menu',
        title: { en_US: 'Simple Menu' },
        href: '/simple',
      },
    ],
  });

  wrapper.find('#portal-sidenavigation');

  const menuItem = wrapper.findAll('[data-test="menuItem"]').at(1);
  expect(menuItem.attributes('aria-haspopup')).toBe(undefined);
  expect(menuItem.attributes('aria-expanded')).toBe(undefined);
});

describe('User Display Name', () => {
  test('displays user displayName from userState when logged in', () => {
    const wrapper = createWrapper(mount, {
      userState: {
        username: 'anna',
        displayName: 'Anna Alster',
        mayEditPortal: false,
      },
      isLoggedIn: true,
    });

    const usernameElement = wrapper.find('.portal-sidenavigation--username');
    expect(usernameElement.exists()).toBe(true);
    expect(usernameElement.text()).toBe('Anna Alster');
  });

  test('displays username when no available display name', () => {
    const wrapper = createWrapper(mount, {
      userState: {
        username: 'testuser',
        displayName: undefined,
        mayEditPortal: false,
      },
      isLoggedIn: true,
    });

    const usernameElement = wrapper.find('.portal-sidenavigation--username');
    expect(usernameElement.exists()).toBe(true);
    expect(usernameElement.text()).toBe('testuser');
  });

  test('does not display username when not logged in', () => {
    const wrapper = createWrapper(mount, {
      userState: {
        username: '',
        displayName: '',
        mayEditPortal: false,
      },
      isLoggedIn: false,
    });

    const usernameElement = wrapper.find('.portal-sidenavigation--username');
    expect(usernameElement.exists()).toBe(false);
  });

  test('displays full name with special characters correctly', () => {
    const wrapper = createWrapper(mount, {
      userState: {
        username: 'jmüller',
        displayName: 'Jürgen Müller-Schmidt',
        mayEditPortal: false,
      },
      isLoggedIn: true,
    });

    const usernameElement = wrapper.find('.portal-sidenavigation--username');
    expect(usernameElement.exists()).toBe(true);
    expect(usernameElement.text()).toBe('Jürgen Müller-Schmidt');
  });

  test('displays user row with displayName and logout button when logged in', () => {
    const wrapper = createWrapper(mount, {
      userState: {
        username: 'anna',
        displayName: 'Anna Alster',
        mayEditPortal: false,
      },
      isLoggedIn: true,
    });

    const userRow = wrapper.find('.portal-sidenavigation__user-row');
    expect(userRow.exists()).toBe(true);

    const usernameElement = wrapper.find('.portal-sidenavigation--username');
    expect(usernameElement.text()).toBe('Anna Alster');

    const logoutButton = wrapper.find('.portal-sidenavigation__logout-link');
    expect(logoutButton.exists()).toBe(true);
  });

  test('displays login button instead of displayName when not logged in', () => {
    const wrapper = createWrapper(mount, {
      userState: {
        username: '',
        displayName: '',
        mayEditPortal: false,
      },
      isLoggedIn: false,
    });

    const userRow = wrapper.find('.portal-sidenavigation__user-row');
    expect(userRow.exists()).toBe(false);

    const loginButton = wrapper.find('.portal-sidenavigation__login');
    expect(loginButton.exists()).toBe(true);
  });
});
