/*
 * Copyright 2021 Univention GmbH
 *
 * https://www.univention.de/
 *
 * All rights reserved.
 *
 * The source code of this program is made available
 * under the terms of the GNU Affero General Public License version 3
 * (GNU AGPL V3) as published by the Free Software Foundation.
 *
 * Binary versions of this program provided by Univention to you as
 * well as other copyrighted, protected or trademarked materials like
 * Logos, graphics, fonts, specific documentations and configurations,
 * cryptographic keys etc. are subject to a license agreement between
 * you and Univention and not subject to the GNU AGPL V3.
 *
 * In the case you use this program under the terms of the GNU AGPL V3,
 * the program is provided in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License with the Debian GNU/Linux or Univention distribution in file
 * /usr/share/common-licenses/AGPL-3; if not, see
 * <https://www.gnu.org/licenses/>.
 */
import { PortalModule } from '@/store/root.models';
import { Tab } from './tabs.models';

export interface TabState {
  activeTabIndex: number;
  tabs: Tab[];
}

const tabs: PortalModule<TabState> = {
  namespaced: true,
  state: {
    activeTabIndex: 0,
    tabs: [],
  },

  mutations: {
    ACTIVE_TAB(state, index: number) {
      state.activeTabIndex = index;
    },
    ADD_TAB(state, tab: Tab) {
      const index = state.tabs.findIndex((stateTab) => stateTab.tabLabel === tab.tabLabel);
      if (index === -1) {
        state.tabs.push(tab);
        state.activeTabIndex = state.tabs.length;
      } else {
        state.activeTabIndex = index + 1;
      }
    },
    DELETE_TAB(state, index: number) {
      state.tabs.splice(index - 1, 1);
      if (state.activeTabIndex === index) {
        state.activeTabIndex = 0;
      } else if (state.activeTabIndex > index) {
        state.activeTabIndex -= 1;
      }
    },
  },

  getters: {
    allTabs: (state) => state.tabs,
    numTabs: (state) => state.tabs.length,
    activeTabIndex: (state) => state.activeTabIndex,
  },

  actions: {
    setActiveTab({ commit, dispatch }, index: number) {
      dispatch('modal/hideAndClearModal', undefined, { root: true });
      commit('ACTIVE_TAB', index);
    },
    addTab({ commit }, tab: Tab) {
      commit('ADD_TAB', tab);
    },
    deleteTab({ commit }, index: number) {
      commit('DELETE_TAB', index);
    },
  },
};

export default tabs;
