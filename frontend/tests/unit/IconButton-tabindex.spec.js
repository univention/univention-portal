/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import IconButton from '@/components/globals/IconButton.vue';
import activity from '@/store/modules/activity';

describe('IconButton Tab Order and CSS Classes', () => {
  let store;

  beforeEach(() => {
    store = createStore({
      modules: {
        activity: {
          ...activity,
          state: {
            level: 'portal',
          },
        },
      },
    });
  });

  test('applies buttonClass prop to rendered button element', async () => {
    const wrapper = mount(IconButton, {
      props: {
        icon: 'x',
        ariaLabelProp: 'Close',
        buttonClass: 'button--icon--circle button--flat',
      },
      global: {
        plugins: [store],
        stubs: {
          PortalIcon: true,
        },
      },
    });

    const button = wrapper.find('button');
    expect(button.classes()).toContain('button--icon');
    expect(button.classes()).toContain('button--icon--circle');
    expect(button.classes()).toContain('button--flat');
  });

  test('applies explicit tabindex when provided', async () => {
    const wrapper = mount(IconButton, {
      props: {
        icon: 'x',
        ariaLabelProp: 'Close',
        tabindex: 0,
      },
      global: {
        plugins: [store],
        stubs: {
          PortalIcon: true,
        },
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('tabindex')).toBe('0');
  });

  test('overrides activity-based tabindex with explicit tabindex', async () => {
    // Set activity level to something different to test override
    store.commit('activity/SETLEVEL', 'different-level');

    const wrapper = mount(IconButton, {
      props: {
        icon: 'x',
        ariaLabelProp: 'Close',
        activeAt: ['portal'], // Won't match current level
        tabindex: 0, // Should override the -1 that would normally be set
      },
      global: {
        plugins: [store],
        stubs: {
          PortalIcon: true,
        },
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('tabindex')).toBe('0');
  });

  test('falls back to activity-based tabindex when no explicit tabindex', async () => {
    store.commit('activity/SETLEVEL', 'portal');

    const wrapper = mount(IconButton, {
      props: {
        icon: 'x',
        ariaLabelProp: 'Close',
        activeAt: ['portal'],
      },
      global: {
        plugins: [store],
        stubs: {
          PortalIcon: true,
        },
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('tabindex')).toBe('0');
  });

  test('sets tabindex to -1 when activity level does not match', async () => {
    store.commit('activity/SETLEVEL', 'different-level');

    const wrapper = mount(IconButton, {
      props: {
        icon: 'x',
        ariaLabelProp: 'Close',
        activeAt: ['portal'],
      },
      global: {
        plugins: [store],
        stubs: {
          PortalIcon: true,
        },
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('tabindex')).toBe('-1');
  });

  test('combines base classes with buttonClass prop', async () => {
    const wrapper = mount(IconButton, {
      props: {
        icon: 'search',
        ariaLabelProp: 'Search',
        buttonClass: 'button--icon--header-style button--flat',
        hasButtonStyle: true,
        sizeVariant: 'small',
      },
      global: {
        plugins: [store],
        stubs: {
          PortalIcon: true,
        },
      },
    });

    const button = wrapper.find('button');
    
    // Base class
    expect(button.classes()).toContain('button--icon');
    
    // Props-based classes
    expect(button.classes()).toContain('button--icon--inputfield-sized');
    expect(button.classes()).toContain('button--icon--small');
    
    // ButtonClass prop classes
    expect(button.classes()).toContain('button--icon--header-style');
    expect(button.classes()).toContain('button--flat');
  });

  test('handles empty buttonClass prop gracefully', async () => {
    const wrapper = mount(IconButton, {
      props: {
        icon: 'x',
        ariaLabelProp: 'Close',
        buttonClass: '',
      },
      global: {
        plugins: [store],
        stubs: {
          PortalIcon: true,
        },
      },
    });

    const button = wrapper.find('button');
    expect(button.classes()).toContain('button--icon');
    // Should not throw error with empty buttonClass
  });

  test('emits click event when clicked', async () => {
    const wrapper = mount(IconButton, {
      props: {
        icon: 'x',
        ariaLabelProp: 'Close',
      },
      global: {
        plugins: [store],
        stubs: {
          PortalIcon: true,
        },
      },
    });

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  test('renders with correct aria-label', async () => {
    const wrapper = mount(IconButton, {
      props: {
        icon: 'search',
        ariaLabelProp: 'Search Portal',
      },
      global: {
        plugins: [store],
        stubs: {
          PortalIcon: true,
        },
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('aria-label')).toBe('Search Portal');
  });
});