// SPDX-License-Identifier: AGPL-3.0-only
// SPDX-FileCopyrightText: 2026 Univention GmbH

import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';

import PortalCornerLinks from '@/components/PortalCornerLinks.vue';

jest.mock('@/jsHelper/translate', () => ({
  __esModule: true,
  default: (text) => (text.startsWith('Nubus Core Edition by Univention -') ? `DE: ${text}` : text),
}));

const operatorEntry = {
  dn: 'cn=documentation,dc=test',
  name: { en_US: 'Documentation' },
  description: { en_US: 'Documentation' },
  links: [{ locale: 'en_US', value: 'https://docs.example.com/' }],
  icon_url: null,
  linkTarget: 'newwindow',
};

const TabindexElementStub = {
  name: 'TabindexElement',
  props: ['tag', 'activeAt'],
  template: '<a v-bind="$attrs"><slot /></a>',
};

function mountCornerLinks({ cornerLinks = [], editionNotice = true, locale = 'en_US' } = {}) {
  const store = createStore({
    modules: {
      portalData: {
        namespaced: true,
        getters: {
          cornerLinks: () => cornerLinks,
          portalEntries: () => [operatorEntry],
          editionNotice: () => editionNotice,
        },
      },
    },
  });
  return mount(PortalCornerLinks, {
    global: {
      plugins: [store],
      stubs: { TabindexElement: TabindexElementStub },
      mocks: {
        $localized: (input) => input[locale] || input.en_US,
      },
    },
  });
}

describe('PortalCornerLinks', () => {
  test('shows the edition notice without operator corner links', () => {
    const wrapper = mountCornerLinks();
    const link = wrapper.find('[data-test="portal-corner-link-edition"]');
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe('Nubus Core Edition by Univention');
    expect(link.attributes('href')).toBe('https://www.univention.com/core-edition-portal-corner-link/');
    expect(link.attributes('target')).toBe('_blank');
    expect(link.attributes('rel')).toBe('noopener');
    const icon = link.find('[data-test="portal-corner-link-edition-icon"]');
    expect(icon.attributes('src')).toBe('./media/univention-u.svg');
    expect(icon.attributes('alt')).toBe('');
  });

  test('uses the German landing page and tooltip, but keeps the link text', () => {
    const wrapper = mountCornerLinks({ locale: 'de_DE' });
    const link = wrapper.find('[data-test="portal-corner-link-edition"]');
    expect(link.attributes('href')).toBe('https://www.univention.de/core-edition-portal-corner-link/');
    expect(link.text()).toBe('Nubus Core Edition by Univention');
    expect(link.find('span').attributes('title')).toBe(
      'DE: Nubus Core Edition by Univention - in use without warranties or support. Learn more!',
    );
  });

  test('is the last corner link after operator defined corner links', () => {
    const wrapper = mountCornerLinks({ cornerLinks: [operatorEntry.dn] });
    const items = wrapper.findAll('.portal-corner__item');
    expect(items).toHaveLength(2);
    expect(items[0].text()).toBe('Documentation');
    expect(items[1].find('[data-test="portal-corner-link-edition"]').exists()).toBe(true);
  });

  test('is hidden with a valid enterprise subscription', () => {
    const wrapper = mountCornerLinks({ cornerLinks: [operatorEntry.dn], editionNotice: false });
    expect(wrapper.find('[data-test="portal-corner-link-edition"]').exists()).toBe(false);
    expect(wrapper.findAll('.portal-corner__item')).toHaveLength(1);
  });

  test('renders nothing without corner links and with a valid enterprise subscription', () => {
    const wrapper = mountCornerLinks({ editionNotice: false });
    expect(wrapper.find('.portal-corner').exists()).toBe(false);
  });
});
