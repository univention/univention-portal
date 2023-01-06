/*
 * Copyright 2021-2022 Univention GmbH
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
import { FullNotification, Notification, WeightedNotification, ExternalNotification } from './notifications.models';

export type PortalActionContext<S> = ActionContext<S, RootState>;

export interface Notifications {
  notifications: Array<FullNotification>;
}

export interface ExternalNotifications {
  externalNotifications: Array<ExternalNotification>;
}

const notifications: PortalModule<Notifications> = {
  namespaced: true,
  state: {
    notifications: [],
  },

  mutations: {
    ADD_NOTIFICATION(state: Notifications, notification: FullNotification): void {
      state.notifications.push(notification);
    },
    REMOVE_NOTIFICATION(state: Notifications, notification: FullNotification): void {
      const indexContent = state.notifications.indexOf(notification);
      state.notifications.splice(indexContent, 1);
    },
    HIDE_NOTIFICATION(state: Notifications, notification: FullNotification): void {
      notification.hidingAfter = -1;
      notification.visible = false;
    },
  },
  getters: {
    allNotifications: (state) => state.notifications,
    visibleNotifications: (state) => state.notifications.filter((notification) => notification.visible),
    numNotifications: (state) => state.notifications.length,
  },

  actions: {
    addWeightedNotification({ commit, rootGetters }: PortalActionContext<Notifications>, item: WeightedNotification): void {
      const notification = { ...item, visible: true, token: Math.random() };
      commit('ADD_NOTIFICATION', notification);
      if (rootGetters['navigation/getActiveButton'] === 'bell') {
        commit('HIDE_NOTIFICATION', notification);
      }
    },
    addErrorNotification({ dispatch }: PortalActionContext<Notifications>, item: Notification): void {
      dispatch('addWeightedNotification', { hidingAfter: 4, ...item, importance: 'error' });
    },
    addSuccessNotification({ dispatch }: PortalActionContext<Notifications>, item: Notification): void {
      dispatch('addWeightedNotification', { hidingAfter: 4, ...item, importance: 'success' });
    },
    addNotification({ dispatch }: PortalActionContext<Notifications>, item: Notification): void {
      dispatch('addWeightedNotification', { hidingAfter: 4, ...item, importance: 'default' });
    },
    removeAllNotifications({ commit, getters }: PortalActionContext<Notifications>): void {
      [...getters.allNotifications].forEach((notification) => {
        commit('REMOVE_NOTIFICATION', notification);
      });
    },
    hideAllNotifications({ commit, getters }: PortalActionContext<Notifications>): void {
      getters.visibleNotifications.forEach((notification) => {
        commit('HIDE_NOTIFICATION', notification);
      });
    },
    removeNotification({ commit, getters }: PortalActionContext<Notifications>, token: number): void {
      const notification = getters.allNotifications.find((ntfctn) => ntfctn.token === token);
      if (!notification) {
        return;
      }
      commit('REMOVE_NOTIFICATION', notification);
    },
    hideNotification({ commit, getters }: PortalActionContext<Notifications>, token: number): void {
      const notification = getters.allNotifications.find((ntfctn) => ntfctn.token === token);
      if (!notification) {
        return;
      }
      commit('HIDE_NOTIFICATION', notification);
    },
  },
};

// const externalNotifications: PortalModule<ExternalNotifications> = {
//   namespaced: true,
//   state: {
//     externalNotifications: [],
//   },
//   mutations: {
//     ADD_NOTIFICATION(state: ExternalNotifications, notification: ExternalNotification): void {
//       state.externalNotifications.push(notification);
//     },
//     REMOVE_NOTIFICATION(state: ExternalNotifications, notification: ExternalNotification): void {
//       const indexContent = state.externalNotifications.indexOf(notification);
//       state.externalNotifications.splice(indexContent, 1);
//     }
//   },
//   getters: {
//     allNotifications: (state) => state.externalNotifications,
//     visibleNotifications: (state) => state.externalNotifications.filter((externalNotification) => externalNotification.visible),
//     numNotifications: (state) => state.externalNotifications.length,
//   },
//   actions: {

//   },

// }

export default notifications;
