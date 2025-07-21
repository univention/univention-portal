/**
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
* */

import { mount } from '@vue/test-utils';
import Vuex from 'vuex';

import NewPasswordBox from '@/components/widgets/NewPasswordBox.vue';
import ToggleButton from '@/components/widgets/ToggleButton.vue';
import activity from '@/store/modules/activity';

const store = new Vuex.Store({
  modules: {
    activity: {
      getters: activity.getters,
      namespaced: true,
    },
  },
});

const optionsBase = {
  propsData: {
    name: 'password',
    modelValue: {},
    invalidMessage: {
      invalidMessageNew: '',
      invalidMessageRetype: '',
    },
    forAttrOfLabel: '',
    invalidMessageId: '',
    tabindex: 0,
  },
};

const optionsPwVisibilityToggle = {
  propsData: {
    ...optionsBase.propsData,
    canShowPassword: true,
  },
  children: [ToggleButton],
  global: {
    plugins: [store],
  },
};

async function withNewPasswordBox(options, callback) {
  const wrapper = mount(NewPasswordBox, options);
  try {
    return await callback(wrapper);
  } finally {
    wrapper.unmount();
  }
}

describe('NewPasswordBox widget', () => {
  test('accepts password entry', async () => {
    await withNewPasswordBox(optionsBase, async (wrapper) => {
      const inputValue = 'test password';

      const passwordBox = await wrapper.get('[data-testid="new-password-box"]');
      expect(passwordBox.element.value).toBe('');
      await passwordBox.setValue(inputValue);
      expect(passwordBox.element.value).toBe(inputValue);

      const retypeBox = await wrapper.get('[data-testid="retype-password-box"]');
      expect(retypeBox.element.value).toBe('');
      await retypeBox.setValue(inputValue);
      expect(retypeBox.element.value).toBe(inputValue);
    });
  });

  test('computes property aria-invalid correctly', async () => {
    await withNewPasswordBox(optionsBase, async (wrapper) => {
      expect(wrapper.vm.invalid).toBe(false);
      await wrapper.setProps({
        invalidMessage: {
          invalidMessageNew: 'required',
          invalidMessageRetype: 'required',
        },
      });
      expect(wrapper.vm.invalid).toBe(true);
    });
  });

  test('renders password input field with correct type', async () => {
    await withNewPasswordBox(optionsBase, async (wrapper) => {
      const passwordBox = await wrapper.get('[data-testid="new-password-box"]');
      expect(passwordBox.attributes('type')).toBe('password');
    });
  });

  test('does not allow to show password by default', async () => {
    await withNewPasswordBox(optionsBase, async (wrapper) => {
      expect(wrapper.find('[data-test="password-box-icon"]').exists()).toBe(false);
    });
  });

  test('is able to toggle password visiblity correctly', async () => {
    await withNewPasswordBox(optionsPwVisibilityToggle, async (wrapper) => {
      const passwordBox = await wrapper.get('[data-testid="new-password-box"]');
      const passwordBoxButton = await wrapper.get('[data-test="password-box-icon"]');

      expect(passwordBoxButton.attributes('aria-label')).toBe('Show password');
      expect(passwordBox.attributes('type')).toBe('password');

      await passwordBoxButton.trigger('click');

      expect(passwordBoxButton.attributes('aria-label')).toBe('Hide password');
      expect(passwordBox.attributes('type')).toBe('text');
    });
  });

  test('can call .focus()', async () => {
    await withNewPasswordBox(optionsBase, async (wrapper) => {
      // call `focus` assuming valid inputs
      await wrapper.setProps({ invalidMessage: { invalidMessageNew: '', invalidMessageRetype: '' } });
      expect(wrapper.vm.invalidNew).toBe(false);
      expect(wrapper.vm.invalidRetype).toBe(false);
      wrapper.vm.focus();
      // call `focus` assuming invalid first input
      await wrapper.setProps({ invalidMessage: { invalidMessageNew: 'missing field', invalidMessageRetype: '' } });
      expect(wrapper.vm.invalidNew).toBe(true);
      expect(wrapper.vm.invalidRetype).toBe(false);
      wrapper.vm.focus();
      // call `focus` assuming invalid retyped input
      await wrapper.setProps({ invalidMessage: { invalidMessageNew: '', invalidMessageRetype: 'missing field' } });
      expect(wrapper.vm.invalidNew).toBe(false);
      expect(wrapper.vm.invalidRetype).toBe(true);
      wrapper.vm.focus();
      // call `focus` assuming both invalid inputs
      await wrapper.setProps({ invalidMessage: { invalidMessageNew: 'missing field', invalidMessageRetype: 'missing field' } });
      expect(wrapper.vm.invalidNew).toBe(true);
      expect(wrapper.vm.invalidRetype).toBe(true);
      wrapper.vm.focus();

      // Note: we cannot test that the browser actually sets the focus, as the DOM is not rendered here.
    });
  });

});
