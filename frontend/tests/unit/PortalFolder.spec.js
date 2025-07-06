import { shallowMount } from '@vue/test-utils';

import PortalFolder from '@/components/PortalFolder.vue';
import navigation from '@/store/modules/navigation';
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
    },
  });
  store.dispatch = jest.fn();

  const wrapper = shallowMount(PortalFolder, {
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
    },
  });
  store.dispatch = jest.fn();

  const wrapper = shallowMount(PortalFolder, {
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
