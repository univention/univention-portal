/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

import { mount } from '@vue/test-utils';

import PortalFolder from '@/components/PortalFolder.vue';
import Vuex from 'vuex';

// Mock the helper functions that filter tiles
jest.mock('@/jsHelper/portalCategories', () => ({
  doesTitleMatch: jest.fn(() => true),
  doesKeywordsMatch: jest.fn(() => true),
  doesDescriptionMatch: jest.fn(() => true),
}));

const mockProps = {
  layoutId: 'test-layout-id',
  dn: 'cn=test-folder,cn=entry,cn=portals,cn=univention,dc=test,dc=de',
  superDn: 'cn=category,cn=portals,cn=univention,dc=test,dc=de',
  title: {
    en_US: 'Test Folder',
    de_DE: 'Test Ordner',
  },
  description: {
    en_US: 'Test folder description',
    de_DE: 'Test Ordner Beschreibung',
  },
  keywords: {
    en_US: 'test keywords',
    de_DE: 'Test Schlüsselwörter',
  },
  links: [{ href: 'http://example.com', text: 'Example' }],
  originalLinkTarget: 'samewindow',
  tiles: [],
  id: 'test-folder-id',
  inModal: true,
};

const mockTile = {
  id: 'test-tile-1',
  layoutId: 'test-layout-id',
  dn: 'cn=test-tile,cn=entry,cn=portals,cn=univention,dc=test,dc=de',
  title: { en_US: 'Test Tile' },
  description: { en_US: 'Test Description' },
  keywords: { en_US: 'test keywords' },
  links: [
    { locale: 'en_US', value: 'http://example.com' },
    { locale: 'de_DE', value: 'http://beispiel.de' },
  ],
  activated: true,
  anonymous: false,
  backgroundColor: '#ffffff',
  allowedGroups: [],
  linkTarget: 'samewindow',
  target: '_self',
  originalLinkTarget: 'samewindow',
  pathToLogo: '/path/to/logo.png',
};

// Helper function to create a Vuex store with configurable options
function createMockStore({ featureToggles = {}, editMode = false } = {}) {
  const store = new Vuex.Store({
    modules: {
      featureToggles: {
        state: { featureToggles },
        getters: {
          featureToggles: (state) => state.featureToggles,
        },
        namespaced: true,
      },
      dragndrop: {
        state: {
          inDragnDropMode: false,
          inKeyboardDragnDropMode: false,
          id: null,
          lastDir: null,
        },
        getters: {
          inDragnDropMode: (state) => state.inDragnDropMode,
          inKeyboardDragnDropMode: (state) => state.inKeyboardDragnDropMode,
          getId: (state) => state.id || { layoutId: null },
          getLastDir: (state) => state.lastDir,
        },
        namespaced: true,
      },
      search: {
        state: {
          searchQuery: '',
        },
        getters: {
          searchQuery: (state) => state.searchQuery,
        },
        namespaced: true,
      },
      portalData: {
        state: { editMode },
        getters: {
          editMode: (state) => state.editMode,
        },
        namespaced: true,
      },
      metaData: {
        state: {
          meta: {
            fqdn: 'test.example.com',
          },
        },
        getters: {
          getMeta: (state) => state.meta,
        },
        namespaced: true,
      },
      locale: {
        state: {
          locale: 'en_US',
        },
        getters: {
          getLocale: (state) => state.locale,
        },
        namespaced: true,
      },
      tooltip: {
        state: {
          tooltipID: null,
        },
        getters: {
          getTooltipID: (state) => state.tooltipID,
        },
        namespaced: true,
      },
    },
  });
  store.dispatch = jest.fn();
  return store;
}

// Helper function to create mount options
function createMountOptions({ store, props = {}, stubTemplate = '<div><slot /></div>' } = {}) {
  return {
    props: {
      ...mockProps,
      ...props,
    },
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
      stubs: {
        'tabindex-element': {
          template: stubTemplate,
        },
      },
    },
  };
}

test('PortalFolder renders li when native_html_list is true', async () => {
  const store = createMockStore({ featureToggles: { native_html_list: true } });
  const wrapper = mount(PortalFolder, createMountOptions({
    store,
    props: { tiles: [mockTile] },
  }));

  const folderItems = wrapper.findAll('[data-test="portalFolder"]');
  expect(folderItems.length).toBeGreaterThan(0);
  expect(folderItems[0].element.tagName.toLowerCase()).toBe('ul');
});

test('PortalFolder renders div when native_html_list is false', async () => {
  const store = createMockStore({ featureToggles: { native_html_list: false } });
  const wrapper = mount(PortalFolder, createMountOptions({
    store,
    props: { tiles: [mockTile] },
  }));

  const folderItems = wrapper.findAll('[data-test="portalFolder"]');
  expect(folderItems.length).toBeGreaterThan(0);
  expect(folderItems[0].element.tagName.toLowerCase()).toBe('div');
});

test('PortalFolder renders editmode-wrapper when editMode is true and native_html_list is true', async () => {
  const store = createMockStore({
    featureToggles: { native_html_list: true },
    editMode: true,
  });
  const wrapper = mount(PortalFolder, createMountOptions({
    store,
    props: { tiles: [mockTile] },
  }));

  const editmodeWrapper = wrapper.find('[data-test="editmode-wrapper"]');
  expect(editmodeWrapper.exists()).toBe(true);
  expect(editmodeWrapper.element.tagName.toLowerCase()).toBe('div');
  expect(editmodeWrapper.classes()).toContain('portal-folder__thumbnails');

  const folderContainer = wrapper.find('[data-test="portalFolder"]');
  expect(folderContainer.exists()).toBe(true);
  expect(folderContainer.element.tagName.toLowerCase()).toBe('ul');
});

test('PortalFolder does not render editmode-wrapper when editMode is true and native_html_list is false', async () => {
  const store = createMockStore({
    featureToggles: { native_html_list: false },
    editMode: true,
  });
  const wrapper = mount(PortalFolder, createMountOptions({
    store,
    props: { tiles: [mockTile] },
  }));

  const editmodeWrapper = wrapper.find('[data-test="editmode-wrapper"]');
  expect(editmodeWrapper.exists()).toBe(false);

  const folderContainer = wrapper.find('[data-test="portalFolder"]');
  expect(folderContainer.exists()).toBe(true);
  expect(folderContainer.element.tagName.toLowerCase()).toBe('div');
});

test('PortalFolder has correct ARIA attributes when inModal is true', async () => {
  const store = createMockStore();
  const wrapper = mount(PortalFolder, createMountOptions({
    store,
    props: { inModal: true },
    stubTemplate: '<div v-bind="$attrs" data-test="portal-folder"><slot /></div>',
  }));

  const folderBox = wrapper.find('[data-test="portal-folder"]');
  expect(folderBox.exists()).toBe(true);
  expect(folderBox.attributes('role')).toBe('dialog');
  expect(folderBox.attributes('aria-modal')).toBe('true');
  expect(folderBox.attributes('aria-labelledby')).toBe('test-folder-id-content');
});

test('PortalFolder has correct ARIA attributes when inModal is false', async () => {
  const store = createMockStore();
  const wrapper = mount(PortalFolder, createMountOptions({
    store,
    props: { inModal: false },
    stubTemplate: '<div v-bind="$attrs" data-test="portal-folder"><slot /></div>',
  }));

  const folderBox = wrapper.find('[data-test="portal-folder"]');
  expect(folderBox.exists()).toBe(true);
  expect(folderBox.attributes('role')).toBe('dialog');
  expect(folderBox.attributes('aria-modal')).toBeUndefined();
  expect(folderBox.attributes('aria-labelledby')).toBeUndefined();
  expect(folderBox.attributes('aria-label')).toBeTruthy();
});
