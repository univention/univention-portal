import ChooseTabs from '@/components/ChooseTabs';
import _ from '@/jsHelper/translate';
import Vuex from 'vuex';
import tabs from '@/store/modules/tabs';

export default {
  title: 'Components/ChooseTabs',
  components: ChooseTabs,
};

const state = { 
  activeTabIndex: 1,
  tabs: [{
    tabLabel: 'Wikipedia',
    backgroundColor: 'red',
    logo: '',
    target: '',
    iframeLink: 'wikipedia.de'
  }],
  scrollPosition: 0,
 };


const Template = (args) => ({
  components: { ChooseTabs },
  setup() {
    return {args};
  },
  template: '<choose-tabs v-bind="args" />',
  store: new Vuex.Store({
    modules: {
      tabs: {
        namespaced: true,
        getters: {
          tabs: () => {
            return state.tabs;
          },
          activeTab: () => {
            return state.activeTabIndex;
          }
        },
        state,
      }
    }
  })
});

export const Basic = Template.bind({});
Basic.args = {
};
