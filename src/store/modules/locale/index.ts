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
import { updateLocale } from '@/i18n/translations';
import { getCookie, setCookie } from '@/jsHelper/tools';
import { PortalModule } from '@/store/root.models';
import { Locale } from './locale.models';

interface LocaleDefinition {
  id: string;
  label: string;
  default?: boolean;
}

export interface LocaleState {
  locale: Locale;
  defaultLocale: Locale | null;
  availableLocales: Locale[];
}

const locale: PortalModule<LocaleState> = {
  namespaced: true,
  state: {
    locale: 'en_US',
    defaultLocale: null,
    availableLocales: ['en_US'],
  },

  mutations: {
    NEWLOCALE(state, payload): void {
      state.locale = payload;
    },
    DEFAULT_LOCALE(state, payload) {
      state.defaultLocale = payload;
    },
    AVAILABLE_LOCALES(state, payload) {
      state.availableLocales = payload;
    },
  },

  getters: {
    getLocale: (state) => state.locale,
    getDefaultLocale: (state) => state.defaultLocale,
    getAvailableLocales: (state) => state.availableLocales,
  },

  actions: {
    setLocale({ commit, dispatch }, payload: Locale) {
      commit('NEWLOCALE', payload);
      const lang = payload.replace('_', '-');
      dispatch('menu/setDisabled', [`menu-item-language-${lang}`], { root: true });
      setCookie('UMCLang', lang);
      const localePrefix = payload.slice(0, 2);
      // TODO create helper function
      const html = document.documentElement;
      html.setAttribute('lang', localePrefix);
      return updateLocale(localePrefix);
    },
    setInitialLocale({ getters, dispatch }) {
      if (getters.getAvailableLocales.length === 1) {
        console.log('setInitialLocale', 'single');
        dispatch('setLocale', getters.getAvailableLocales[0]);
      }
      const umcLang = getCookie('UMCLang');
      if (umcLang) {
        console.log('setInitialLocale', 'cookie');
        return dispatch('setLocale', umcLang.replace('-', '_'));
      }
      if (getters.getDefaultLocale) {
        console.log('setInitialLocale', 'default');
        return dispatch('setLocale', getters.getDefaultLocale);
      }
      if (window.navigator.languages) {
        let preferred = null;
        window.navigator.languages.some((language) => {
          preferred = getters.getAvailableLocales.find((loc) => loc === language.replace('-', '_') || loc.slice(0, 2) === language);
          return !!preferred;
        });
        if (preferred) {
          console.log('setInitialLocale', 'browser');
          return dispatch('setLocale', preferred);
        }
      }
      console.log('setInitialLocale', 'fallback');
      return dispatch('setLocale', 'en_US');
    },
    setAvailableLocale({ dispatch, commit }, payload: LocaleDefinition[]) {
      const locales = payload.map((loc) => loc.id.replace('-', '_'));
      commit('AVAILABLE_LOCALES', locales);
      const defaultLocale = payload.find((loc) => loc.default);
      if (defaultLocale) {
        commit('DEFAULT_LOCALE', defaultLocale.id.replace('-', '_'));
      }
      // TODO create helper function
      const html = document.documentElement;
      html.setAttribute('lang', 'en'); // setting document lang to en, because it is also set in line 47, 48
      return dispatch('setInitialLocale');
    },
  },
};

export default locale;
