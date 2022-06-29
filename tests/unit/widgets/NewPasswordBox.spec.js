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

const setNewPasswordModelValue = {
  newPassword: '',
  retypePassword: '',
};

describe('NewPasswordBox Component', () => {
  test('if user can set value in two inputfields', async () => {
    const wrapper = await mount(NewPasswordBox, {
      propsData: {
        modelValue: setNewPasswordModelValue,
        name: 'newPassword',
        forAttrOfLabel: '',
        invalidMessageId: '',
      },
    });

    const newPasswordBox = await wrapper.find('[data-test="new-password-box"]');
    const retypePasswordBox = await wrapper.find('[data-test="retype-password-box"]');

    // Expect input value to be empty on mount.
    expect(newPasswordBox.element.value).toBe('');
    expect(retypePasswordBox.element.value).toBe('');

    await newPasswordBox.setValue('passwordValuewNew');
    await retypePasswordBox.setValue('passwordValuewRetype');

    expect(newPasswordBox.element.value).toBe('passwordValuewNew');
    expect(retypePasswordBox.element.value).toBe('passwordValuewRetype');

    wrapper.unmount();
  });

  test('is components uses computed properties correctly', async () => {
    const wrapper = await mount(NewPasswordBox, {
      propsData: {
        modelValue: setNewPasswordModelValue,
        name: 'password',
        forAttrOfLabel: '',
        invalidMessageId: '',
      },
    });

    // Expect Aria-Invalid to be set correctly
    expect(wrapper.vm.invalidNew).toBe(false);
    await wrapper.setProps({ invalidMessage: { invalidMessageNew: 'is invalid', invalidMessageRetype: '' } });
    expect(wrapper.vm.invalidNew).toBe(true);
    
    expect(wrapper.vm.invalidRetype).toBe(false);
    await wrapper.setProps({ invalidMessage: { invalidMessageNew: '', invalidMessageRetype: 'is invalid' } });
    expect(wrapper.vm.invalidRetype).toBe(true);
  });

  test('They are both actually a password input field', async () => {
    const wrapper = await mount(NewPasswordBox, {
      propsData: {
        modelValue: setNewPasswordModelValue,
        name: 'password',
        forAttrOfLabel: '',
        invalidMessageId: '',
      },
    });
    const passwordBoxNew = await wrapper.find('[data-test="new-password-box"]');
    const passwordBoxRetype = await wrapper.find('[data-test="retype-password-box"]');

    expect(passwordBoxNew.attributes('type')).toBe('password');
    expect(passwordBoxRetype.attributes('type')).toBe('password');
  });

  test('show/hide password icon button', async () => {
    const wrapper = await mount(NewPasswordBox, {
      propsData: {
        modelValue: setNewPasswordModelValue,
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

    const passwordBoxNew = await wrapper.find('[data-test="new-password-box"]');
    const passwordBoxButton = await wrapper.find('[data-test="password-box-icon"]');

    expect(passwordBoxButton.attributes('aria-label')).toBe('Show password');
    expect(passwordBoxNew.attributes('type')).toBe('password');

    await passwordBoxButton.trigger('click');

    expect(passwordBoxButton.attributes('aria-label')).toBe('Hide password');
    expect(passwordBoxNew.attributes('type')).toBe('text');
  });
});
