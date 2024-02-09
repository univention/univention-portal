/*
 * Copyright 2021-2024 Univention GmbH
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
import { Commit } from 'vuex';

export interface MetaDataState {
  meta: Record<string, unknown>;
}

const metaData: PortalModule<MetaDataState> = {
  namespaced: true,
  state: {
    meta: {
      cookieBanner: {
        show: false,
        title: { en: '' },
        text: { en: '' },
        domains: [],
      },
    },
  },

  mutations: {
    META(state: MetaDataState, payload: Record<string, unknown>): void {
      state.meta = payload;
    },
  },

  getters: { getMeta: (state) => state.meta },

  actions: {
    setMeta({ commit }: { commit: Commit }, payload: Record<string, unknown>): void {
      commit('META', payload);
    },
  },
};

export default metaData;
