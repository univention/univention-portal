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
// vue
// modules
import axios from 'axios';
import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import { getAdminState } from '@/jsHelper/admin';
import activity from './modules/activity';
import dragndrop from './modules/dragndrop';
import featureToggles from './modules/featureToggles';
import locale from './modules/locale';
import menu from './modules/menu';
import metaData from './modules/metaData';
import navigation from './modules/navigation';
import modal from './modules/modal';
import notifications from './modules/notifications';
import oidc from './modules/oidc';
import portalData from './modules/portalData';
import search from './modules/search';
import tabs from './modules/tabs';
import tooltip from './modules/tooltip';
import umcSession from './modules/umcSession';
import user from './modules/user';
import { initialRootState, LoadPortalPayload, RootState } from './root.models';
import {
  extractUserData,
  languageJsonPath,
  portalApiMePath,
  portalJsonPath,
  portalJsonRequest,
  portalLeftSidebarPath,
  portalMetaPath,
  portalUrl,
} from './utils';

export const key: InjectionKey<Store<RootState>> = Symbol('');

const mutations = {
  SET_LOADING_STATE(state: RootState, active: boolean) {
    state.loadingState = active;
  },
  SET_INITIAL_LOAD_DONE(state: RootState, done: boolean) {
    state.initialLoadDone = done;
  },
};

const getters = {
  getLoadingState: (state: RootState) => state.loadingState,
  getInitialLoadDone: (state: RootState) => state.initialLoadDone,
};

export const actions = {
  activateLoadingState({ commit }) {
    commit('SET_LOADING_STATE', true);
  },
  deactivateLoadingState({ commit }) {
    commit('SET_LOADING_STATE', false);
  },
  initialLoadDone({ commit }) {
    commit('SET_INITIAL_LOAD_DONE', true);
  },
  shouldRedirectToLogin({ rootGetters }) {
    if (rootGetters['portalData/portalEnsureLogin'] && !rootGetters['user/isLoggedIn']) {
      return true;
    }
    return false;
  },
  loadPortal: ({ commit, dispatch, rootGetters }, payload: LoadPortalPayload) => new Promise((resolve, reject) => {
    // Get portal data
    const portalRequest = portalJsonRequest(payload.adminMode)
      .catch((error) => error);
    const portalPromises = [
      `${portalUrl}${portalMetaPath}`, // Get meta data
      `${portalUrl}${languageJsonPath}`, // Get locale data
      `${portalUrl}${portalApiMePath}`, // Get user details from api endpoint "me"
      `${portalUrl}${portalLeftSidebarPath}`, // Get left sidebar navigation items
    ].map((url) => axios.get(url).catch((error) => error));
    portalPromises.push(portalRequest);

    Promise.all(portalPromises).then(async ([
      metaResponse, languageResponse, portalApiMeResponse, portalLeftSidebarResponse, portalResponse,
    ]) => {
      const [meta, availableLocales, leftSidebar, portal] = [metaResponse.data, languageResponse.data, portalLeftSidebarResponse.data, portalResponse.data];
      const apiMe = portalApiMeResponse.data;
      const userData = extractUserData(portal, apiMe);

      if (languageResponse.isAxiosError) {
        console.warn(`Failed to fetch ${portalUrl}${languageJsonPath}`);
      } else {
        await dispatch('locale/setAvailableLocale', availableLocales);
      }
      if (metaResponse.isAxiosError) {
        console.warn(`Failed to fetch ${portalUrl}${portalMetaPath}`, metaResponse);
      } else {
        dispatch('metaData/setMeta', meta);
      }

      if (portalLeftSidebarResponse.isAxiosError) {
        console.warn(`Failed to fetch ${portalUrl}${portalLeftSidebarPath}`, portalLeftSidebarResponse);
      } else {
        dispatch('portalData/setLeftSidebarItems', leftSidebar);
      }

      dispatch('menu/setMenu', {
        portal,
        availableLocales: availableLocales ?? [],
      });
      if (portalResponse.isAxiosError) {
        console.warn(`Failed to fetch ${portalUrl}${portalJsonPath}`);
        dispatch('portalData/setPortalErrorDisplay', 502);
        dispatch('deactivateLoadingState');
      } else {
        if (portal.feature_toggles) {
          commit('featureToggles/setFeatureToggles', portal.feature_toggles);
        } else {
          console.warn('Key "feature_toggles" missing in portal data.');
        }
        dispatch('portalData/setPortal', { portal, adminMode: payload.adminMode || getAdminState() });
        dispatch('user/setUser', userData);
        if (portal.username) {
          dispatch('userIsLoggedIn');
        }
        dispatch('initialLoadDone');
        resolve(portal);
        const currentLocale = rootGetters['locale/getLocale'] || 'en_US';
        document.title = rootGetters['portalData/portalName']?.[currentLocale] ?? 'Univention Portal';
      }
    })
      .catch((error) => {
        // We won't get here at the moment because we call .catch on
        // all promises in Promise.all
        dispatch('portalData/setPortalErrorDisplay', 502);
        dispatch('deactivateLoadingState');
        reject(error);
      });
  }),
  userIsLoggedIn: ({ dispatch, state, rootGetters }) => {
    const keycloakUrl = process.env.VUE_APP_KEYCLOAK_URL;
    if (keycloakUrl) {
      if (rootGetters['user/userState'].authMode === 'saml') {
        dispatch('oidc/tryLogin');
      }
    } else {
      console.info('No Keycloak URL defined, not trying to login via OIDC.');
    }

    if (state.featureToggles.notifications_api) {
      console.info('Feature use notifications api activated.');
      dispatch('notifications/connectNotificationsApi');
    } else {
      console.info('Feature use notifications api disabled.');
    }

    if (state.featureToggles.umc_session_refresh) {
      console.info('Feature UMC Session refresh activated.');
      if (rootGetters['user/userState'].authMode === 'saml') {
        console.debug('User is authenticated via SAML, triggering automatic session refresh.');
        dispatch('umcSession/startSessionRefresh');
      } else {
        console.debug('User is not authenticated via SAML, skipping automatic session refresh.');
      }
    } else {
      console.info('Feature UMC Session refresh disabled.');
    }

    if (state.featureToggles.native_html_list) {
      console.info('Using native HTML list for portal tiles.');
    } else {
      console.info('Using divs with aria roles for portal tiles.');
    }

    if (state.featureToggles.left_sidebar) {
      console.info('Feature left sidebar activated.');
    } else {
      console.info('Feature left sidebar disabled.');
    }
  },
};

export const store = createStore<RootState>({
  strict: process.env.NODE_ENV !== 'production',
  state: initialRootState,
  mutations,
  actions,
  getters,
  modules: {
    activity,
    featureToggles,
    dragndrop,
    locale,
    menu,
    metaData,
    modal,
    navigation,
    notifications,
    oidc,
    portalData,
    search,
    tabs,
    tooltip,
    umcSession,
    user,
  },
});

// Define your own `useStore` composition function
export function useStore(): Store<RootState> {
  return baseUseStore(key);
}
