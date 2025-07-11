// SPDX-License-Identifier: AGPL-3.0-only
// SPDX-FileCopyrightText: 2025 Univention GmbH

import { mount } from '@vue/test-utils';

import PortalCategory from '@/components/PortalCategory.vue';
import navigation from '@/store/modules/navigation';
import Vuex from 'vuex';

const mockProps = {
  layoutId: 'test-layout-id',
  dn: 'cn=test-category,cn=category,cn=portals,cn=univention,dc=test,dc=de',
  title: {
    en_US: 'Test Category',
    de_DE: 'Test Kategorie',
  },
  virtual: false,
  tiles: [],
  categoryIndex: 0,
  useNativeHtmlList: true,
  fromFolder: false,
};

test('PortalCategory renders ul when native_html_list is true', async () => {
  const featureToggles = {
    native_html_list: true,
  };

  const store = new Vuex.Store({
    modules: {
      navigation: {
        state: { featureToggles },
        getters: navigation.getters,
        namespaced: true,
      },
      featureToggles: {
        state: { featureToggles },
        getters: {
          featureToggles: (featureTogglesState) => featureTogglesState.featureToggles,
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
    },
  });
  store.dispatch = jest.fn();

  const wrapper = mount(PortalCategory, {
    props: mockProps,
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
    },
  });

  const tilesContainer = wrapper.find(`[data-test="portal-category__tiles-${mockProps.layoutId}"]`);
  expect(tilesContainer.exists()).toBe(true);
  expect(tilesContainer.element.tagName.toLowerCase()).toBe('ul');
});

test('PortalCategory renders div when native_html_list is false', async () => {
  const featureToggles = {
    native_html_list: false,
  };

  const store = new Vuex.Store({
    modules: {
      navigation: {
        state: { featureToggles },
        getters: navigation.getters,
        namespaced: true,
      },
      featureToggles: {
        state: { featureToggles },
        getters: {
          featureToggles: (featureTogglesState) => featureTogglesState.featureToggles,
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
    },
  });
  store.dispatch = jest.fn();

  const wrapper = mount(PortalCategory, {
    props: {
      ...mockProps,
      useNativeHtmlList: false,
    },
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
    },
  });

  // Test that when native_html_list is false, the tiles container is a div element
  const tilesContainer = wrapper.find(`[data-test="portal-category__tiles-${mockProps.layoutId}"]`);
  expect(tilesContainer.exists()).toBe(true);
  expect(tilesContainer.element.tagName.toLowerCase()).toBe('div');
});

test('PortalCategory renders editmode-wrapper when editMode is true and native_html_list is true', async () => {
  const featureToggles = {
    native_html_list: true,
  };

  const store = new Vuex.Store({
    modules: {
      navigation: {
        state: { featureToggles },
        getters: navigation.getters,
        namespaced: true,
      },
      featureToggles: {
        state: { featureToggles },
        getters: {
          featureToggles: (featureTogglesState) => featureTogglesState.featureToggles,
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
      dragndrop: {
        state: {
          inDragnDropMode: false,
          inKeyboardDragnDropMode: false,
          id: null,
        },
        getters: {
          inDragnDropMode: (state) => state.inDragnDropMode,
          inKeyboardDragnDropMode: (state) => state.inKeyboardDragnDropMode,
          getId: (state) => state.id || { layoutId: null },
        },
        namespaced: true,
      },
    },
  });
  store.dispatch = jest.fn();

  const wrapper = mount(PortalCategory, {
    props: mockProps,
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
    },
  });

  // Test that when editMode is true and native_html_list is true, the editmode-wrapper (div with portal-category__tiles class) exists
  const editmodeWrappers = wrapper.findAll('.portal-category__tiles');
  expect(editmodeWrappers.length).toBeGreaterThan(0);
  const editmodeWrapper = editmodeWrappers[0];
  expect(editmodeWrapper.exists()).toBe(true);
  expect(editmodeWrapper.element.tagName.toLowerCase()).toBe('div');
  // The inner tiles container should still be a ul
  const tilesContainer = wrapper.find(`[data-test="portal-category__tiles-${mockProps.layoutId}"]`);
  expect(tilesContainer.exists()).toBe(true);
  expect(tilesContainer.element.tagName.toLowerCase()).toBe('ul');
});

test('PortalCategory does not render editmode-wrapper when editMode is true and native_html_list is false', async () => {
  const featureToggles = {
    native_html_list: false,
  };

  const store = new Vuex.Store({
    modules: {
      navigation: {
        state: { featureToggles },
        getters: navigation.getters,
        namespaced: true,
      },
      featureToggles: {
        state: { featureToggles },
        getters: {
          featureToggles: (featureTogglesState) => featureTogglesState.featureToggles,
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
      dragndrop: {
        state: {
          inDragnDropMode: false,
          inKeyboardDragnDropMode: false,
          id: null,
        },
        getters: {
          inDragnDropMode: (state) => state.inDragnDropMode,
          inKeyboardDragnDropMode: (state) => state.inKeyboardDragnDropMode,
          getId: (state) => state.id || { layoutId: null },
        },
        namespaced: true,
      },
    },
  });
  store.dispatch = jest.fn();

  const wrapper = mount(PortalCategory, {
    props: mockProps,
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
    },
  });

  // Test that when editMode is true and native_html_list is false, the editmode-wrapper should not exist
  // (because it uses TemplateWrapper instead of div)
  const editmodeWrappers = wrapper.findAll('.portal-category__tiles');
  // When native_html_list is false, only the inner div should have the class (not the outer wrapper)
  // The outer wrapper should be TemplateWrapper, so there should be only 1 element with this class
  expect(editmodeWrappers.length).toBe(1);
  const innerContainer = editmodeWrappers[0];
  expect(innerContainer.element.tagName.toLowerCase()).toBe('div');

  const tilesContainer = wrapper.find(`[data-test="portal-category__tiles-${mockProps.layoutId}"]`);
  expect(tilesContainer.exists()).toBe(true);
  expect(tilesContainer.element.tagName.toLowerCase()).toBe('div');
});
