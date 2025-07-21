/**
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
* */

import { mount } from '@vue/test-utils';

import ToggleButton from '@/components/widgets/ToggleButton.vue';
import IconButton from '@/components/globals/IconButton.vue';
import Vuex from 'vuex';
import activity from '@/store/modules/activity';

const store = new Vuex.Store({
  modules: {
    activity: {
      getters: activity.getters,
      namespaced: true,
    },
  },
});

const toggleLabelProp = {
  initial: 'Display as List',
  toggled: 'Display as Grid',
};
const toggleIconProp = {
  initial: 'list',
  toggled: 'grid',
};

describe('ToggleButton Component', () => {
  test('Button displays initial Icon and text', async () => {
    const wrapper = await mount(ToggleButton, {
      props: {
        isToggled: false,
        toggleLabels: toggleLabelProp,
        toggleIcons: toggleIconProp,
        'onUpdate:isToggled': (value) => wrapper.setProps({ isToggled: value }),
      },
      children: [IconButton],
      global: {
        plugins: [store],
      },
    });

    const button = await wrapper.find('[data-test="toggle-button"]');
    const svgChild = await wrapper.find('use');
    expect(button.attributes('aria-label')).toBe('Display as List');
    expect(svgChild.attributes('href')).toBe('media/feather-sprite.svg#list');

    await button.trigger('click');

    expect(button.attributes('aria-label')).toBe('Display as Grid');
    expect(svgChild.attributes('href')).toBe('media/feather-sprite.svg#grid');
    wrapper.unmount();
  });
});
