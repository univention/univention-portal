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
import MultiSelect from '@/components/widgets/MultiSelect';

const fullModelValue = ["cn=Backup Join,cn=groups,dc=dev,dc=upx,dc=mydemoenv,dc=net","cn=Computers,cn=groups,dc=dev,dc=upx,dc=mydemoenv,dc=net","cn=DC Backup Hosts,cn=groups,dc=dev,dc=upx,dc=mydemoenv,dc=net","cn=DC Slave Hosts,cn=groups,dc=dev,dc=upx,dc=mydemoenv,dc=net"];

const multiSelectProps = {
  label: 'multi select',
  modelValue: [],
}

let wrapper;

beforeEach( async () => {
  wrapper = await mount(MultiSelect, {
    propsData: multiSelectProps,
  });
});

afterEach(() => {
  wrapper.unmount();
});

describe('MultiInput.vue', () => {
  test('if Button with label "Add entry" exists', async () => {
    const addMoreButton = await wrapper.find('[data-test="multi-select-add-more-button"]');

    expect(addMoreButton.text()).toContain('Add more');
    expect(addMoreButton.text()).toContain('Add Groups');
    expect(addMoreButton.find('[aria-hidden="true"]').exists()).toBeTruthy();
    expect(addMoreButton.find('[class="sr-only sr-only-mobile"]').exists()).toBeTruthy();
  });
  
  test('if Button with label "Remove" exists', async () => {
    const removeButton = await wrapper.find('[data-test="multi-select-remove-button"]');
    
    expect(removeButton.text()).toContain('Remove');
    expect(removeButton.text()).toContain('Remove selection');
    expect(removeButton.find('[aria-hidden="true"]').exists()).toBeTruthy();
    expect(removeButton.find('[class="sr-only sr-only-mobile"]').exists()).toBeTruthy();
  });
    

  test('if elementsSelected returns true when this.selection.length greater than 0', async () => {
      expect(wrapper.vm.elementsSelected).toBe(false);

      // setup props and trigger selection to expect elementsSelected to Be true
      await wrapper.setProps({modelValue: fullModelValue});

      const firstCheckbox = await wrapper.find('input');
      await firstCheckbox.trigger('change');
      expect(wrapper.vm.elementsSelected).toBe(true);
  });
    
    test('if toggleSelection is called correctly', async () => {
      const toggleSelectionSpy = jest.spyOn(wrapper.vm, 'toggleSelection');
      await wrapper.setProps({modelValue: fullModelValue});
      await wrapper.vm.$nextTick();


      const firstCheckbox = await wrapper.find('input');
      await firstCheckbox.trigger('change');
      
      expect(toggleSelectionSpy).toHaveBeenCalled();
      expect(wrapper.vm.selection).toEqual(["cn=Backup Join,cn=groups,dc=dev,dc=upx,dc=mydemoenv,dc=net"]);
    });
      
    it.todo('if dnToLabel returning string correctly');
      // recieves argument
      // retrieves the desired label
     // label is rendered in after checkbox
        
    it.todo('if add is working as expected');
    //  // add is called on @click
    //  // Props are ready
    //  // calls dispatch setShowModalPromise
    //  // hideAndClearModal is called
    //  // update:modelValue is called with newValues
    // // dispatch setMessage is called
          
    it.todo('if remove is working as expected');
            //  // remove is called on @click
            //  // values are modified as expacted
            //  // update:modelValue is emmitted with values
            // // dispatch setMessage is called
                  
  });
