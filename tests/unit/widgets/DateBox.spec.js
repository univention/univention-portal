/**
  Copyright 2021 Univention GmbH

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
**/

import { mount } from '@vue/test-utils';

import DateBox from '@/components/widgets/DateBox';

describe('DateBox Component', () => {
  test('test input value', async () => {
      // to check focus, we need to attach to an actual document, normally we don't do this
      const div = document.createElement('div');
      div.id = 'root';
      document.body.appendChild(div);


      const wrapper = await mount(DateBox, {
        propsData: {
          modelValue: '',
        },
        attachTo: "#root"
      });

      const dateBox = await wrapper.find('[data-test="date-box"]');
      
      // Expect input value to be empty on mount. 
      expect(dateBox.element.value).toBe("");
      await dateBox.setValue('2017-06-01');
      expect(dateBox.element.value).toBe("2017-06-01");
      
      await dateBox.setValue('text string');
      expect(dateBox.element.value).not.toBe("text string");
      expect(dateBox.element.value).toBe("0");
      
      wrapper.unmount();

  });

  test('computed property', async () => {
    const wrapper = await mount(DateBox, {
      propsData: {
        modelValue: '',
      },
    });

    // Expect Aria-Invalid to be set correctly
    expect(wrapper.vm.invalid).toBe(false);
    await wrapper.setProps({ invalidMessage: "Invalid Message" })
    expect(wrapper.vm.invalid).toBe(true);
  });

  test('its actually a date input field', async () => {
    const wrapper = await mount(DateBox, {
      propsData: {
        modelValue: '',
      },
    });
    const dateBox = await wrapper.find('[data-test="date-box"]');
  
    expect(dateBox.attributes('type')).toBe('date');
  });
});
