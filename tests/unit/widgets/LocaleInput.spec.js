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

import   { mount } from '@vue/test-utils';

import LocaleInput from '@/components/widgets/LocaleInput';
import Vuex from 'vuex';
import locale from '@/store/modules/locale';
import modal from '@/store/modules/modal';
import activity from '@/store/modules/activity';


const localeInputProps = {
  modelValue: {
    'en_US': '',
  },
  name: 'Name of LocaleInput',
  i18nLabel: 'Label of LocaleInput',

};

const localeState = {
  locale: 'de_DE'
};

const modalActions = {
  setShowModalPromise: jest.fn(),
  hideAndClearModal: jest.fn(),
};

const activityActions = {
  setRegion: jest.fn(),
};

const store = new Vuex.Store({
  modules: {
    locale: {
        localeState,
        getters: locale.getters,
        namespaced: true
      },
    modal:{
        modalActions,
        getters: modal.getters,
        namespaced: true
      },
    activity: {
        activityActions,
        getters: activity.getters,
        namespaced: true
      },  
    }
})

const mountComponent = () => {
  return ( mount(LocaleInput, {
    global: {
      plugins: [store]
    },
    propsData: localeInputProps,
  }) );
}

describe('LocaleInput Component', () => {
  test('it sets the es_US translation in modelValue correctly', async () => {
      // mount component with empty modelValue
      const wrapper = mountComponent();
      const localeInput = await wrapper.find('[data-test="locale-input"]');
      const input = await localeInput.find('input');
      input.setValue('english word');

      const expected = {en_US:'english word'};
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.modelValue.en_US).toBe(expected.en_US);
  });

  test('the modalLevel is correct', async () => {
    // if isInModal is true the modalLevel should be 2
    // if not the modalLevel should be 1
    // mount component without inInModal Props
    const wrapper = mountComponent();
    
    expect(wrapper.vm.translationEditingDialogLevel).toBe(2);
    
    // change is in ModalProp 
    wrapper.setProps({ isInModal: false });
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.translationEditingDialogLevel).toBe(1);
  });
  
  test('if the correct object will be given to translationEditingDialog', async () =>{
    // the translationEditingDialog accepts only a certain type of object, therefore we need
    // to ensure, that the modelValueData is set correctly
    const wrapper = mountComponent();


    // TODO 
    /*
    1. mount component only with english locale 
    -> modelValueData should have only one key    
    
    2. mount component with english and german locale
    -> modelValueData should habe both keys
    await wrapper.vm.$nextTick();
    console.log('###', wrapper.vm.isLink);
    console.log('###', wrapper.vm.correctModelValue);
    console.log('###', wrapper.vm.modelValue);
    console.log('###', wrapper.vm.modelValueData);
    
    expect(wrapper.vm.correctModelValue).toMatchObject({
      en_US: expect.any(String),
      de_DE: expect.any(String)
    });
    
    wrapper.setProps({ isLink: false });
    expect(wrapper.vm.correctModelValue).not.toMatchObject({
      en_US: expect.any(String),
      de_DE: expect.any(String)
    });
    
    expect(wrapper.vm.correctModelValue).toMatchObject({
      en_US: expect.any(String),
    });
    */
    
  });

  /*
  Test if adjustDataStructureForLinks is working well
  Pass a a link object type as modelValue
  expect new object to be ass needed for LocaleInput  
  */


  /*

  Test if openTranslationEditingDialog can be called 
  Test if setShowModalPromise is called correctly with neccecary input. 
  Test if hideAndClearModal is called correcrly
  
  Test if I18N_LABEL is returning the Label

  Test if TRANSLATE_TEXT_INPUT is returning the test 

  */
  
});











