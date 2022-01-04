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

import ComboBox from '@/components/widgets/ComboBox';
import CombinedStream from 'combined-stream';

const comboBoxOptions = [
  {
    id: 'red', 
    label: 'Red'
  }, 
  {
    id: 'green', 
    label: 'Green'
  }, 
  {
    id: 'blue', 
    label: 'Blue'
  }, 
]

describe('ComboBox Component', () => {
  test('test input value', async () => {
      const wrapper = await mount(ComboBox, {
        propsData: {
          modelValue: '',
          options: comboBoxOptions 
        },
      });

      const comboBox = await wrapper.find('[data-test="combo-box"]');
      const options = comboBox.findAll('option');
      await options[0].setSelected();
      expect(comboBox.element.value).toBe(comboBoxOptions[0].id);
  });

  test('computed property', async () => {
    const wrapper = await mount(ComboBox, {
      propsData: {
        modelValue: '',
        options: comboBoxOptions 
      },
    });

    // Expect Aria-Invalid to be set correctly
    expect(wrapper.vm.invalid).toBe(false);
    await wrapper.setProps({ invalidMessage: "Invalid Message" })
    expect(wrapper.vm.invalid).toBe(true);
  });

  test('No other values than option array are possible', async () => {
    const wrapper = await mount(ComboBox, {
      propsData: {
        modelValue: '',
        options: comboBoxOptions 
      },
    });
    const comboBox = await wrapper.find('[data-test="combo-box"]');
    
    const select = wrapper.find('select');
    
    await select.setValue('wrong-input');

    expect(comboBox.element.value).not.toBe('wrong-input');

  });
});
