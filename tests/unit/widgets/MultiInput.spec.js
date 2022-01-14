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
import MultiInput from '@/components/widgets/MultiInput';
import IconButton from '@/components/globals/IconButton.vue';
import Vuex from 'vuex';
import activity from '@/store/modules/activity';


const multiInputProps = {
  modelValue: [""],
  subtypes: [{"type":"TextBox","name":"","label":"","required":false,"readonly":false}],
  invalidMessage: {"all":"","values":[]},
}

const store = new Vuex.Store({
  modules: {
    activity: {
        getters: activity.getters,
        namespaced: true
      }
    }
})

beforeEach(() => {
  wrapper = await mount(MultiInput, {
    propsData: multiInputProps,
    children: [IconButton],
    global: {
      plugins: [store]
    },
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe('MultiInput.vue', () => {
 
  test('if Button with label "Add entry" exists', async () =>{
    const addEntryButton = await wrapper.find('[data-test="multi-input-add-entry-button"]');
    expect(addEntryButton.text()).toContain('Add entry');
  });
      
  test('if remove-entry button exists', async () =>{
    const removeEntryButton = await wrapper.find('[data-test="multi-input-remove-entry-button-0"]');
    expect(removeEntryButton.attributes('aria-label')).toBe('Remove entry');
  });
    
  test('if the .multi-input__row is working for singleline', async () =>{
    //  1. Prop subtypes must have only one Element
    wrapper.setProps('');
    //  2. .multi-input__row has class .multi-input__row--singleline
  });

  // test('if the onUpdate is called correctly', async () =>{
  // //  1. onUpdate is called on @update
  // //  2. update:modelValue is emitted with desired value
  // });
      
        // test('if the addEntry is called correctly', async () =>{
          // //  1. addEntry is called on @click
          // //  2. update:modelValue is emitted with desired value
          // });
          
          // test('if the newRow is called correctly', async () =>{
            // //  1. should call the function "initialValue"
            // //  2. return desired element
            // });
            
            // test('if the removeEntry is called correctly', async () =>{
              // //  1. onUpdate is called on @click
              // //  2. update:modelValue is emitted with desired value
              // });
              
              // test('if the rowInvalidMessage is called correctly', async () =>{
                // //  1. is called with parameter
                // //  2. show invalidMessage for row only if we have multiple subtypes
                // //  3. invalidMessage is passed as Object
                // //  4. return message or empty string depending on this.invalidMessage.values[valIdx]
                // //  5. .multi-input__row as also .multi-input__row--invalid if rowInvalidMessage !== ''
                // });
                
                // test('if the getSubtypeWidget is called correctly', async () =>{
                  // //  1. is called with required arguments
                  // //  2. returns desired object
                  // });
                  
                  
                    
                    // test('if the .multi-input__row is working for multiline', async () =>{
                      // //  1. Prop subtypes must have more than one element
                      // //  2. .multi-input__row has class .multi-input__row--multiline
                      // });

                      // test('if the .multi-input__row is working for multiline', async () =>{
                        // //  1. Prop subtypes must have more than one element
                        // //  2. .multi-input__row has class .multi-input__row--multiline
                        // });
                        
});
                        
                        
                        
                        