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
import { ActionContext } from 'vuex';

import { PortalModule, RootState } from '../../root.models';

export interface Activity {
  level: string,
  focus: Record<string, string>,
  region: string | null,
}

type ActivityActionContext = ActionContext<Activity, RootState>;

interface SaveFocusArgs {
  region?: string,
  id: string,
}

const activity: PortalModule<Activity> = {
  namespaced: true,
  state: {
    level: 'portal',
    focus: {},
    region: 'portal-header',
  },

  mutations: {
    ADD_REGION(state: Activity, region: string): void {
      console.log('Adding region', region);
      state.focus[region] = state.focus[region] || '';
      console.log('CHECKING ACTIVITY STATE', state.focus);
    },
    SET_REGION(state: Activity, region: string | null): void {
      state.region = region;
    },
    SET_LEVEL(state: Activity, level: string): void {
      state.level = level;
    },
    SAVE_FOCUS(state: Activity, payload: SaveFocusArgs): void {
      let region = payload.region;
      const targetElem = document.getElementById(payload.id);
      if (!region && state.region) {
        const regionElem = document.getElementById(state.region);
        if (regionElem) {
          if (regionElem.contains(targetElem)) {
            region = state.region;
          }
        }
      }
      if (!region) {
        let foundRegion: HTMLElement | null = null;
        Object.entries(state.focus).forEach(([focusRegion, id]) => {
          const regionElem = document.getElementById(focusRegion);
          if (regionElem) {
            if (foundRegion && regionElem.contains(foundRegion)) {
              return;
            }
            if (regionElem.contains(targetElem)) {
              region = focusRegion;
              foundRegion = regionElem;
            }
          }
        });
      }
      if (region) {
        state.focus[region] = payload.id;
      }
    },
  },

  getters: {
    level: (state: Activity) => state.level,
    focus: (state: Activity) => state.focus,
    region: (state: Activity) => state.region,
  },

  actions: {
    addRegion({ commit }: ActivityActionContext, region: string): void {
      commit('ADD_REGION', region);
    },
    setRegion({ dispatch, commit }: ActivityActionContext, region: string | null): void {
      console.log('setRegion', region);
      commit('SET_REGION', region);
      dispatch('focusElement', region);
    },
    setLevel({ commit }: ActivityActionContext, level: string): void {
      commit('SET_LEVEL', level);
    },
    async focusElement({ getters }: ActivityActionContext, region: string | null): Promise<void> {
      if (!region) {
        return;
      }
      setTimeout(() => {
        const id = getters.focus[region];
        let elem = document.getElementById(id);
        if (!elem) {
          const regionElem = document.getElementById(region);
          const activeElem = regionElem?.querySelector('[tabindex="0"][id]');
          if (activeElem) {
            elem = document.getElementById(activeElem.id);
          }
        }
        console.log('focusElement', elem);
        elem?.focus();
      }, 50);
    },
    saveFocus({ commit }: ActivityActionContext, payload: SaveFocusArgs): void {
      if (payload.id) {
        commit('SAVE_FOCUS', payload);
      }
    },
  },
};

export default activity;
