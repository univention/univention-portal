/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

import { mount } from '@vue/test-utils';
import Vuex from 'vuex';

import PortalTile from '@/components/PortalTile.vue';

const props = {
  id: 'tile-id',
  layoutId: 'layout-id',
  dn: 'cn=tile',
  superDn: 'cn=category',
  title: { en_US: 'Tile' },
  description: { en_US: 'Description' },
  keywords: { en_US: '' },
  links: [{ locale: 'en_US', value: 'http://example.com' }],
  linkTarget: 'samewindow',
  originalLinkTarget: 'samewindow',
};

function mountTile(tooltipIsHovered) {
  const store = new Vuex.Store({
    modules: {
      tooltip: {
        namespaced: true,
        getters: {
          tooltip: () => ({}),
          tooltipIsHovered: () => tooltipIsHovered,
          getTooltipID: () => 1,
        },
      },
      dragndrop: {
        namespaced: true,
        getters: {
          inDragnDropMode: () => false,
          inKeyboardDragnDropMode: () => false,
          getId: () => ({ layoutId: null }),
          getLastDir: () => null,
        },
      },
      device: { namespaced: true, getters: { isTouchDevice: () => false } },
      portalData: { namespaced: true, getters: { editMode: () => false } },
      metaData: { namespaced: true, getters: { getMeta: () => ({ fqdn: 'example.com' }) } },
      locale: { namespaced: true, getters: { getLocale: () => 'en_US' } },
    },
  });
  store.dispatch = jest.fn();
  const wrapper = mount(PortalTile, {
    props,
    global: {
      plugins: [store],
      mocks: { $localized: (obj) => obj.en_US },
      stubs: { 'tabindex-element': { template: '<div><slot /></div>' } },
    },
  });
  return { store, tile: wrapper.find('[data-test="tileLink"]') };
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('PortalTile.vue tooltip on mouseleave', () => {
  test('closes only after the grace period', async () => {
    const { store, tile } = mountTile(false);
    await tile.trigger('mouseleave');
    expect(store.dispatch).not.toHaveBeenCalledWith('tooltip/unsetTooltip');
    jest.advanceTimersByTime(150);
    expect(store.dispatch).toHaveBeenCalledWith('tooltip/unsetTooltip');
  });

  test('stays open when the pointer reached the tooltip', async () => {
    const { store, tile } = mountTile(true);
    await tile.trigger('mouseleave');
    jest.advanceTimersByTime(150);
    expect(store.dispatch).not.toHaveBeenCalledWith('tooltip/unsetTooltip');
  });
});
