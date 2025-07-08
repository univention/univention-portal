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
  inModal: true, // Set to true to make content visible
};

test('PortalFolder renders li when native_html_list is true', async () => {
  const featureToggles = {
    native_html_list: true,
  };

  const store = new Vuex.Store({
    modules: {
      featureToggles: {
        state: { featureToggles },
        getters: {
          featureToggles: (featureTogglesState) => featureTogglesState.featureToggles,
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
        state: { editMode: false },
        getters: {
          editMode: (portalState) => portalState.editMode,
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

  const wrapper = mount(PortalFolder, {
    props: {
      ...mockProps,
      tiles: [
        {
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
        },
      ],
    },
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
      stubs: {
        'tabindex-element': {
          template: '<div><slot /></div>', // Render slot content instead of stubbing
        },
      },
    },
  });

  // Test that when native_html_list is true, the folder items are li elements
  const folderItems = wrapper.findAll('[data-test="portalFolder"]');
  expect(folderItems.length).toBeGreaterThan(0);
  expect(folderItems[0].element.tagName.toLowerCase()).toBe('ul');
});

test('PortalFolder renders div when native_html_list is false', async () => {
  const featureToggles = {
    native_html_list: false,
  };

  const store = new Vuex.Store({
    modules: {
      featureToggles: {
        state: { featureToggles },
        getters: {
          featureToggles: (featureTogglesState) => featureTogglesState.featureToggles,
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
        state: { editMode: false },
        getters: {
          editMode: (portalState) => portalState.editMode,
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

  const wrapper = mount(PortalFolder, {
    props: {
      ...mockProps,
      tiles: [
        {
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
        },
      ],
    },
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
      stubs: {
        'tabindex-element': {
          template: '<div><slot /></div>', // Render slot content instead of stubbing
        },
      },
    },
  });

  // Test that when native_html_list is false, the folder items are div elements
  const folderItems = wrapper.findAll('[data-test="portalFolder"]');
  expect(folderItems.length).toBeGreaterThan(0);
  expect(folderItems[0].element.tagName.toLowerCase()).toBe('div');
});

test('PortalFolder renders editmode-wrapper when editMode is true and native_html_list is true', async () => {
  const featureToggles = {
    native_html_list: true,
  };

  const store = new Vuex.Store({
    modules: {
      featureToggles: {
        state: { featureToggles },
        getters: {
          featureToggles: (featureTogglesState) => featureTogglesState.featureToggles,
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
        state: { editMode: true },
        getters: {
          editMode: (portalState) => portalState.editMode,
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

  const wrapper = mount(PortalFolder, {
    props: {
      ...mockProps,
      tiles: [
        {
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
        },
      ],
    },
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
      stubs: {
        'tabindex-element': {
          template: '<div><slot /></div>', // Render slot content instead of stubbing
        },
      },
    },
  });

  // Test that when editMode is true and native_html_list is true, the editmode-wrapper (div with portal-folder__thumbnails class) exists
  const editmodeWrapper = wrapper.find('[data-test="editmode-wrapper"]');
  expect(editmodeWrapper.exists()).toBe(true);
  expect(editmodeWrapper.element.tagName.toLowerCase()).toBe('div');
  expect(editmodeWrapper.classes()).toContain('portal-folder__thumbnails');

  // The inner folder container should still be a ul
  const folderContainer = wrapper.find('[data-test="portalFolder"]');
  expect(folderContainer.exists()).toBe(true);
  expect(folderContainer.element.tagName.toLowerCase()).toBe('ul');
});

test('PortalFolder does not render editmode-wrapper when editMode is true and native_html_list is false', async () => {
  const featureToggles = {
    native_html_list: false,
  };

  const store = new Vuex.Store({
    modules: {
      featureToggles: {
        state: { featureToggles },
        getters: {
          featureToggles: (featureTogglesState) => featureTogglesState.featureToggles,
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
        state: { editMode: true },
        getters: {
          editMode: (portalState) => portalState.editMode,
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

  const wrapper = mount(PortalFolder, {
    props: {
      ...mockProps,
      tiles: [
        {
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
        },
      ],
    },
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
      stubs: {
        'tabindex-element': {
          template: '<div><slot /></div>', // Render slot content instead of stubbing
        },
      },
    },
  });

  // Test that when editMode is true and native_html_list is false, the editmode-wrapper should not exist
  // (because it uses TemplateWrapper instead of div)
  const editmodeWrapper = wrapper.find('[data-test="editmode-wrapper"]');
  expect(editmodeWrapper.exists()).toBe(false);
  // The folder container should be a div (not ul since native_html_list is false)
  const folderContainer = wrapper.find('[data-test="portalFolder"]');
  expect(folderContainer.exists()).toBe(true);
  expect(folderContainer.element.tagName.toLowerCase()).toBe('div');
});
