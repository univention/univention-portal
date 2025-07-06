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

  const wrapper = shallowMount(PortalCategory, {
    props: mockProps,
    global: {
      plugins: [store],
      mocks: {
        $localized: (obj) => obj.en_US || obj.de_DE || '',
      },
    },
  });

  // Test that when native_html_list is true, the tiles container is a ul element
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

  const wrapper = shallowMount(PortalCategory, {
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
