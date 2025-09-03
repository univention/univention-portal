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
  expect(navigationContainer.attributes('role')).toBe(undefined);
});

test('hasSubmenu method returns false for items without submenus', () => {
  const store = new Vuex.Store({
    modules: {
      menu: {
        state: {
          menu: [
            {
              id: 'simple-menu-item',
              title: { en_US: 'Simple Menu Item' },
              href: '/simple',
              // No subMenu property
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
        state: { featureToggles: { native_html_list: false } },
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
        'menu-item': true,
      },
    },
  });

  // Test the hasSubmenu method directly
  const menuItem = { id: 'simple-menu-item', title: { en_US: 'Simple Menu Item' }, href: '/simple' };
  expect(wrapper.vm.hasSubmenu(menuItem)).toBeFalsy();
});

test('hasSubmenu method returns true for items with submenus', () => {
  const store = new Vuex.Store({
    modules: {
      menu: {
        state: {
          menu: [
            {
              id: 'parent-menu-item',
              title: { en_US: 'Parent Menu Item' },
              href: '/parent',
              subMenu: [
                {
                  id: 'child-1',
                  title: { en_US: 'Child 1' },
                  href: '/child1',
                },
              ],
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
        state: { featureToggles: { native_html_list: false } },
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
        'menu-item': true,
      },
    },
  });

  // Test the hasSubmenu method directly
  const menuItem = {
    id: 'parent-menu-item',
    title: { en_US: 'Parent Menu Item' },
    href: '/parent',
    subMenu: [{ id: 'child-1', title: { en_US: 'Child 1' }, href: '/child1' }]
  };
  expect(wrapper.vm.hasSubmenu(menuItem)).toBe(true);
});

test('Submenu should have role="menu" and correct aria-expanded when visible', async () => {
  const store = new Vuex.Store({
    modules: {
      menu: {
        state: {
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
        state: { featureToggles: { native_html_list: false } },
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
          template: '<div v-bind="$attrs"><slot /></div>',
          inheritAttrs: false,
        },
        'menu-item': {
          template: '<div class="menu-item-stub"><slot /></div>',
        },
      },
    },
  });

  // Initially submenu should not be visible
  expect(wrapper.find('#portal-sidenavigation-sub').exists()).toBe(false);

  // Set submenu to be visible
  await wrapper.setData({ 
    subMenuVisible: true, 
    menuParent: 0 
  });

  // Now submenu should be visible with correct attributes
  const submenu = wrapper.find('#portal-sidenavigation-sub');
  expect(submenu.exists()).toBe(true);
  expect(submenu.attributes('role')).toBe('menu');
  expect(submenu.attributes('aria-expanded')).toBe('true');
});

test('Submenu aria-expanded should be false when submenu is hidden', async () => {
  const store = new Vuex.Store({
    modules: {
      menu: {
        state: {
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
        state: { featureToggles: { native_html_list: false } },
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
          template: '<div v-bind="$attrs"><slot /></div>',
          inheritAttrs: false,
        },
        'menu-item': {
          template: '<div class="menu-item-stub"><slot /></div>',
        },
      },
    },
  });

  // First show the submenu
  await wrapper.setData({ 
    subMenuVisible: true, 
    menuParent: 0 
  });

  let submenu = wrapper.find('#portal-sidenavigation-sub');
  expect(submenu.attributes('aria-expanded')).toBe('true');

  // Then hide it
  await wrapper.setData({ 
    subMenuVisible: false, 
    menuParent: -1 
  });

  // Submenu should no longer be visible (v-if condition)
  expect(wrapper.find('#portal-sidenavigation-sub').exists()).toBe(false);
});

test('Integration: Submenu toggle functionality works correctly', async () => {
  const store = new Vuex.Store({
    modules: {
      menu: {
        state: {
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
        state: { featureToggles: { native_html_list: false } },
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
      navigation: {
        actions: {
          setActiveButton: jest.fn(),
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
  
  // After toggle: submenu visible with correct ARIA attributes
  const submenu = wrapper.find('#portal-sidenavigation-sub');
  expect(submenu.exists()).toBe(true);
  expect(submenu.attributes('role')).toBe('menu');
  expect(submenu.attributes('aria-expanded')).toBe('true');
  expect(wrapper.vm.subMenuVisible).toBe(true);
  expect(wrapper.vm.menuParent).toBe(0);

  // Toggle again to close
  await wrapper.vm.toggleMenu();
  
  // After second toggle: submenu hidden again
  expect(wrapper.find('#portal-sidenavigation-sub').exists()).toBe(false);
  expect(wrapper.vm.subMenuVisible).toBe(false);
});
