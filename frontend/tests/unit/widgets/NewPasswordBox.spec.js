/**
  Copyright 2021-2022 Univention GmbH

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

import { mount } from '@vue/test-utils';

import NewPasswordBox from '@/components/widgets/NewPasswordBox.vue';
import ToggleButton from '@/components/widgets/ToggleButton.vue';
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

describe('NewPasswordBox Component', () => {
  test('input value', async () => {

    const wrapper = mount(NewPasswordBox, {
      props: {
        name: 'new password box',
        modelValue: {},
        forAttrOfLabel: '',
        invalidMessageId: '',
        disabled: false,
        tabindex: 0,
        required: true,
        canShowPassword: false,
      },
    });

    const inputValue = 'test input value';

    const passwordBox = await wrapper.find('[data-test="new-password-box"]');
    expect(passwordBox.element.value).toBe('');
    await passwordBox.setValue(inputValue);
    expect(passwordBox.element.value).toBe(inputValue);

    const retypeBox = await wrapper.find('[data-test="retype-password-box"]');
    expect(retypeBox.element.value).toBe('');
    await retypeBox.setValue(inputValue);
    expect(retypeBox.element.value).toBe(inputValue);

    wrapper.unmount();
  });

  test('computed property', async () => {
    const wrapper = mount(NewPasswordBox, {
      props: {
        name: 'new password box',
        modelValue: {},
        forAttrOfLabel: '',
        invalidMessageId: '',
        disabled: false,
        tabindex: 0,
        required: true,
        canShowPassword: false,
      },
    });

    // Expect Aria-Invalid to be set correctly
    expect(wrapper.vm.invalid).toBe(true);
    await wrapper.setProps({ invalidMessage: {} });
    expect(wrapper.vm.invalid).toBe(true);
  });

  test('its actually a password input field', async () => {
    const wrapper = await mount(NewPasswordBox, {
      propsData: {
        modelValue: '',
        name: 'password',
        forAttrOfLabel: '',
        invalidMessageId: '',
      },
    });
    const passwordBox = await wrapper.find('[data-test="new-password-box"]');

    expect(passwordBox.attributes('type')).toBe('password');
  });

  test('show/hide password icon button', async () => {
    const wrapper = await mount(NewPasswordBox, {
      propsData: {
        modelValue: '',
        name: 'password',
        forAttrOfLabel: '',
        invalidMessageId: '',
        canShowPassword: true,
      },
      children: [ToggleButton],
      global: {
        plugins: [store],
      },
    });

    const passwordBox = await wrapper.find('[data-test="new-password-box"]');
    const passwordBoxButton = await wrapper.find('[data-test="password-box-icon"]');

    expect(passwordBoxButton.attributes('aria-label')).toBe('Show password');
    expect(passwordBox.attributes('type')).toBe('password');

    await passwordBoxButton.trigger('click');

    expect(passwordBoxButton.attributes('aria-label')).toBe('Hide password');
    expect(passwordBox.attributes('type')).toBe('text');
  });
});
