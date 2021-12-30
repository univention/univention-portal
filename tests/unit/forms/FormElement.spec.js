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

import FormElement from '@/components/forms/FormElement';
import { mount } from '@vue/test-utils';

describe('FormElement Component', () => { 

test('TextBox in Form', async () => {
  const widget  = {
    type: 'TextBox',
    name: 'userInput',
    label: 'userInput',
    invalidMessage: '',
    required: true,
  };
  
  const widgetValue = '';
  
  const wrapper = await mount(FormElement, {
    propsData: {
        widget,
        modelValue: widgetValue,
      },
    }
    );
    const expectedComponent = widget;
    
    delete expectedComponent.type;
    delete expectedComponent.label;
    delete expectedComponent.validators;
    
    // Based by the values in the widget object we have following expectacions
    expect(wrapper.vm.widget).toStrictEqual(widget);
    expect(wrapper.vm.modelValue).toBe('');
    expect(wrapper.vm.component).toStrictEqual(expectedComponent);
    expect(wrapper.vm.invalid).toBe(false);
    expect(wrapper.vm.invalidMessage).toBe('');
    
    // By setting a message in invalidMessage wrapper.vm.invalid should be true. 
    const updatedWidget  = {
      type: 'TextBox',
      name: 'userInput',
      label: 'userInput',
      invalidMessage: 'Test String.',
      required: true,
    };

    await wrapper.setProps({widget: updatedWidget});
    expect(wrapper.vm.invalidMessage).toBe('Test String.');
    expect(wrapper.vm.invalid).toBe(true);

  });
});