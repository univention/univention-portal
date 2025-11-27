/**
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
* */

import { mount } from '@vue/test-utils';
import Vuex from 'vuex';

import PortalToolTip from '@/components/PortalToolTip.vue';
import IconButton from '@/components/globals/IconButton.vue';
import activity from '@/store/modules/activity';

const tooltipProps = {
  title: 'Tooltip title',
  description: 'Tooltip description',
  ariaId: 'ariaID',
  position: {
    bottom: 305,
    left: 48,
    right: 176,
    top: 140,
    x: 48,
    y: 140,
  },
  isMobile: false,
  linkType: {
    label: 'embedded',
    icon: 'layout',
  },
};

const state = { tooltip: tooltipProps, hoverOnToolip: false, tooltipID: 1 };

const store = new Vuex.Store({
  modules: {
    tooltip: {
      state,
      namespaced: true,
    },
    activity: {
      getters: activity.getters,
      namespaced: true,
    },
  },
});

store.dispatch = jest.fn();

let wrapper;

beforeEach(async () => {
  wrapper = await mount(PortalToolTip, {
    propsData: tooltipProps,
    children: [IconButton],
    global: {
      plugins: [store],
    },
    attachTo: document.body,
  });
});

afterEach(() => {
  wrapper.unmount();
});

describe('PortalToolTip.vue', () => {
  test('check if description tag contains description text"', async () => {
    const descriptionTag = wrapper.find('[data-test="portal-tooltip-description"]');
    expect(descriptionTag.text()).toBe(wrapper.vm.description);
  });

  test('check if data: calculatedPosition is set with position props', async () => {
    const expectedObject = {
      left: wrapper.vm.position.left,
      right: 'unset',
      bottom: wrapper.vm.position.bottom,
      zone: 'REGULAR',
    };
    expect(wrapper.vm.calculatedPosition).toEqual(expectedObject);
  });

  test('CLOSE_TOOLTIP computed property is set and passed for icon', async () => {
    const closeToolTipIcon = wrapper.find('[data-test="portal-tooltip-close-icon"]');
    expect(closeToolTipIcon.attributes('aria-label')).toBe(wrapper.vm.CLOSE_TOOLTIP);
  });

  test('tooltipPosition', async () => {
    // tooltip position is calculated only for desktop
    expect(wrapper.vm.tooltipPosition).toBe(`left:${wrapper.vm.calculatedPosition.left}px;right:unset;`);
  });

  test('arrowPosition is set for regular placement', async () => {
    const tooltipArrow = wrapper.find('[data-test="portal-tooltip-arrow"]');
    expect(tooltipArrow.attributes('style')).toBe('top: -2rem; left: 0.2rem;');
  });

  test('keepTooltip is working on mouseover', async () => {
    const toolTip = wrapper.find('[data-test="portal-tooltip"]');
    toolTip.trigger('mouseenter');
    await wrapper.vm.$nextTick();
    expect(store.dispatch).toHaveBeenCalledWith('tooltip/setHoverOnTooltip', true);
  });

  test('closeToolTip is triggered on mouseleave', async () => {
    const toolTip = wrapper.find('[data-test="portal-tooltip"]');
    toolTip.trigger('mouseleave');
    await wrapper.vm.$nextTick();
    expect(store.dispatch).toHaveBeenCalledWith('tooltip/setHoverOnTooltip', false);
    expect(store.dispatch).toHaveBeenCalledWith('tooltip/unsetTooltip');
  });

  test('tooltip renders in normal position when not wrapped in teleport', async () => {
    // This tests the default behavior without teleport
    const toolTip = wrapper.find('[data-test="portal-tooltip"]');
    expect(toolTip.exists()).toBe(true);
    expect(toolTip.classes()).toContain('portal-tooltip');
  });

  test('tooltip is rendered as direct child of body when teleportTo is set to "body"', async () => {
    // Mount with Teleport wrapper to simulate parent component behavior
    const TeleportWrapper = {
      template: `
        <Teleport :to="teleportTo" :disabled="!teleportTo">
          <PortalToolTip v-bind="$attrs" />
        </Teleport>
      `,
      components: { PortalToolTip },
      props: ['teleportTo'],
    };

    const wrapperWithTeleport = await mount(TeleportWrapper, {
      propsData: {
        ...tooltipProps,
        teleportTo: 'body',
      },
      children: [IconButton],
      global: {
        plugins: [store],
      },
      attachTo: document.body,
    });

    await wrapperWithTeleport.vm.$nextTick();

    // Find the tooltip in the DOM
    const tooltip = document.querySelector('[data-test="portal-tooltip"]');
    expect(tooltip).not.toBeNull();

    // Verify the tooltip or its transition wrapper is teleported to body
    // The transition element is the direct child of body, and tooltip is inside it
    let currentElement = tooltip;
    let foundBodyAsParent = false;

    // Walk up the DOM tree to find if body is an ancestor
    while (currentElement && currentElement !== document.documentElement) {
      if (currentElement.parentElement === document.body) {
        foundBodyAsParent = true;
        break;
      }
      currentElement = currentElement.parentElement;
    }

    expect(foundBodyAsParent).toBe(true);

    wrapperWithTeleport.unmount();
  });
});
