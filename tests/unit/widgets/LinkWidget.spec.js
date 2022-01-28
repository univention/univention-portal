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
* */

import { mount } from '@vue/test-utils';

import LinkWidget from '@/components/widgets/LinkWidget.vue';
import Vuex from 'vuex';
import locale from '@/store/modules/locale';

const modelValueLinkWidget = [{ locale: 'en_US', value: 'http://10.200.4.60/owncloud' }, { locale: 'en_US', value: 'https://master60.intranet.portal.de/owncloud' }, { locale: 'en_US', value: 'www.duckduckgo.com' }];

const linkWidgetProps = {
  extraLabel: 'Links',
  modelValue: modelValueLinkWidget,
  name: 'links',
};

let wrapper;

const store = new Vuex.Store({
  modules: {
    locale: {
      getters: locale.getters,
      namespaced: true,
    },
  },
});

beforeEach(async () => {
  wrapper = await mount(LinkWidget, {
    propsData: linkWidgetProps,
    global: {
      plugins: [store],
    },
  });
});

afterEach(() => {
  wrapper.unmount();
});

describe('LinkWidget.vue', () => {
  test('if Remove-Button exists and is working as expected', async () => {
    const removeButton = wrapper.find('[data-test="link-widget-remove-button-1"]');

    // Since we have no text we we still want to know if the right icon exists. 
    expect(removeButton.find('[xlink:href="feather-sprite.svg#trash"]').exists()).toBeTruthy();
    
    expect(removeButton.attributes('aria-label')).toBe('Link 2: Remove');

    // each Button removes it's own line, so after clicking on the button we expect,
    // that modelvalue is reduced by one
    const amountOfValues = modelValueLinkWidget.length;
    
    console.log('wrapper.vm.modelValue.length', wrapper.vm.modelValue);
    await removeButton.trigger('click');
    console.log('wrapper.vm.modelValue.length', wrapper.vm.modelValue);
    await wrapper.vm.$nextTick();

    console.log('wrapper.vm.modelValue.length', wrapper.vm.modelValue);
    expect(wrapper.vm.modelValue.length).toBe(amountOfValues - 1);
  });

  it('if ADD_LINK is returned as expected', async () => {
    const addFieldButton = wrapper.find('[data-test="add-field"]');

    expect(addFieldButton.text()).toContain('Add link');
  });
  //   // RESULTS returns a i18n String

  it.todo('if LINKS is returned as expected');
  //   // RESULTS returns a i18n String

  it.todo('if created remodels the given modalValueObject');

  it.todo('addField');
  // is called on @click
  // updated this.modelValueData
  // sets the correct element focus

  it.todo('removeField');
  // is called on @click
  // updates this.modelValueData

  it.todo('LINK');
  // returns the correct index and link label

  it.todo('localeSelect');
  // returns correct localeSelect string with index

  it.todo('linkInput');
  // returns correct string with index

  it.todo('removeLink');
  // returns correct string with index

  it.todo('if option has correct attributes');
  // :selected="modelValueData[index].locale || select

  it.todo('if select has correct attributes');
  // :aria-label="localeSelect(index)

  it.todo('if input has correct attributes');
  // :aria-label="linkInput(index)"
});
