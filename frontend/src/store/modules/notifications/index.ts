/*
 * Copyright 2021-2023 Univention GmbH
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
import { v4 as uuidv4 } from 'uuid';
import { ActionContext } from 'vuex';

import { Notification as BackendNotification, NotificationSeverity } from '@/apis/notifications';

import { PortalModule, RootState } from '../../root.models';
import { FullNotification, Notification, WeightedNotification } from './notifications.models';
import notificationsApi, { connectEventSource, connectEventListener } from './apiclient';

export const defaultHideAfter = 4;

export type PortalActionContext<S> = ActionContext<S, RootState>;

export interface Notifications {
  notifications: Array<FullNotification>;
  backendNotifications: Array<BackendNotification>;
  eventSource?: EventSource;
}

export const severityMapping = Object.fromEntries([
  [NotificationSeverity.Info, 'default'],
  [NotificationSeverity.Success, 'success'],
  [NotificationSeverity.Warning, 'warning'],
  [NotificationSeverity.Error, 'error'],
]);

const importanceFromSeverity = function (severity: NotificationSeverity) {
  return severityMapping[severity];
};

const generateNotificationToken = function (): string {
  return uuidv4();
};

export const mapBackendNotification = function (notification: BackendNotification): FullNotification {
  const localNotification: FullNotification = {
    title: notification.title,
    description: notification.details,
    hidingAfter: notification.popup ? defaultHideAfter : -1,
    importance: importanceFromSeverity(notification.severity),
    visible: !!notification.popup,
    token: notification.id,
    link: undefined,
    onClick: () => null,
    isBackendNotification: true,
  };
  if (notification.link) {
    localNotification.link = {
      url: new URL(notification.link.url),
      text: notification.link.text ?? notification.link.url,
      target: notification.link.target ?? '_blank',
    };
  }
  return localNotification;
};

const removeFromArray = function (array, item) {
  const indexContent = array.indexOf(item);
  if (indexContent < 0) {
    return;
  }
  array.splice(indexContent, 1);
};

export const mutations = {
  ADD_NOTIFICATION(state: Notifications, notification: FullNotification): void {
    state.notifications.push(notification);
  },
  REMOVE_NOTIFICATION(state: Notifications, notification: FullNotification): void {
    removeFromArray(state.notifications, notification);
  },
  HIDE_NOTIFICATION(state: Notifications, notification: FullNotification): void {
    notification.hidingAfter = -1;
    notification.visible = false;
  },

  SET_BACKEND_NOTIFICATIONS(
    state: Notifications, backendNotifications: Array<BackendNotification>,
  ): void {
    state.backendNotifications = backendNotifications;
  },
  ADD_BACKEND_NOTIFICATION(
    state: Notifications, backendNotification: BackendNotification,
  ): void {
    state.backendNotifications.push(backendNotification);
  },
  UPDATE_BACKEND_NOTIFICATION(
    state: Notifications, newNotification: BackendNotification,
  ): void {
    const id = newNotification.id;
    const index = state.backendNotifications.findIndex((n) => n.id === id);
    if (index < 0) {
      return;
    }
    state.backendNotifications[index] = newNotification;
  },
  REMOVE_BACKEND_NOTIFICATION(
    state: Notifications, backendNotification: BackendNotification,
  ): void {
    removeFromArray(state.backendNotifications, backendNotification);
  },
  HIDE_BACKEND_NOTIFICATION(
    state: Notifications, backendNotification: BackendNotification,
  ): void {
    // TODO: Interim implemented in the UI locally. This will have to be
    // replaced with a call back to the API.
    backendNotification.popup = false;
  },

  SET_EVENT_SOURCE(state: Notifications, eventSource: EventSource): void {
    state.eventSource = eventSource;
  },
};

export const actions = {
  addWeightedNotification({ commit, dispatch, rootGetters }: PortalActionContext<Notifications>, item: WeightedNotification): void {
    const notification = { ...item, visible: true, token: generateNotificationToken() };
    commit('ADD_NOTIFICATION', notification);
    if (rootGetters['navigation/getActiveButton'] === 'bell') {
      dispatch('hideNotification', notification.token);
    }
  },
  addErrorNotification({ dispatch }: PortalActionContext<Notifications>, item: Notification): void {
    dispatch('addWeightedNotification', { hidingAfter: defaultHideAfter, ...item, importance: 'error' });
  },
  addSuccessNotification({ dispatch }: PortalActionContext<Notifications>, item: Notification): void {
    dispatch('addWeightedNotification', { hidingAfter: defaultHideAfter, ...item, importance: 'success' });
  },
  addNotification({ dispatch }: PortalActionContext<Notifications>, item: Notification): void {
    dispatch('addWeightedNotification', { hidingAfter: defaultHideAfter, ...item, importance: 'default' });
  },
  removeAllNotifications({ commit, dispatch, getters }: PortalActionContext<Notifications>): void {
    [...getters.allNotifications].forEach((notification) => {
      dispatch('removeNotification', notification.token);
    });
  },
  hideAllNotifications({ commit, dispatch, getters }: PortalActionContext<Notifications>): void {
    getters.visibleNotifications.forEach((notification) => {
      dispatch('hideNotification', notification.token);
    });
  },
  async removeNotification(
    { commit, getters, state }: PortalActionContext<Notifications>, token: string,
  ) {
    const notification = getters.allNotifications.find((n) => n.token === token);
    if (!notification) {
      return;
    }
    if (notification.isBackendNotification) {
      const backendNotification = state.backendNotifications.find((n) => n.id === token);
      if (backendNotification) {
        commit('REMOVE_BACKEND_NOTIFICATION', backendNotification);
        const response = await notificationsApi.deleteNotificationV1NotificationsIdDelete(
          backendNotification.id,
        );
      }
    } else {
      commit('REMOVE_NOTIFICATION', notification);
    }
  },
  async hideNotification(
    { commit, getters, state }: PortalActionContext<Notifications>, token: string,
  ) {
    const notification = getters.allNotifications.find((n) => n.token === token);
    if (!notification) {
      return;
    }
    if (notification.isBackendNotification) {
      const backendNotification = state.backendNotifications.find((n) => n.id === token);
      if (backendNotification) {
        commit('HIDE_BACKEND_NOTIFICATION', backendNotification);
        const response = await notificationsApi.hideNotificationV1NotificationsIdHidePost(
          backendNotification.id,
        );
      }
    } else {
      commit('HIDE_NOTIFICATION', notification);
    }
  },

  async connectNotificationsApi({ commit, dispatch }) {
    await dispatch('fetchNotifications');
    await dispatch('connectEventStream');
  },
  async fetchNotifications({ commit }) {
    const response = await notificationsApi.getNotificationsV1NotificationsGet();
    const latestBackendNotifications = response.data;
    commit('SET_BACKEND_NOTIFICATIONS', latestBackendNotifications);
  },
  connectEventStream({ commit, dispatch }) {
    const eventSource = connectEventSource();
    commit('SET_EVENT_SOURCE', eventSource);

    connectEventListener(
      eventSource, 'new_notification', 'newBackendNotificationEvent', dispatch,
    );
    connectEventListener(
      eventSource, 'updated_notification', 'updateBackendNotificationEvent', dispatch,
    );
    connectEventListener(
      eventSource, 'deleted_notification', 'deleteBackendNotificationEvent', dispatch,
    );
  },
  newBackendNotificationEvent({ commit, state }, eventData) {
    const item = state.backendNotifications.find((n) => n.id === eventData.id);
    if (item) {
      console.warn('Received "new_notification" event for an existing notification', eventData);
    } else {
      commit('ADD_BACKEND_NOTIFICATION', eventData);
    }
  },
  updateBackendNotificationEvent({ commit, state }, eventData) {
    const item = state.backendNotifications.find((n) => n.id === eventData.id);
    if (!item) {
      console.warn('Received "update_notification" event for a non-existing notification', eventData);
    } else {
      commit('UPDATE_BACKEND_NOTIFICATION', eventData);
    }
  },
  deleteBackendNotificationEvent({ commit, state }, eventData) {
    const id = eventData.id;
    const notification = state.backendNotifications.find((n) => n.id === eventData.id);
    if (!notification) {
      console.warn(
        'Received "delete_notification" event for a non-existing notification', eventData,
      );
    } else {
      commit('REMOVE_BACKEND_NOTIFICATION', notification);
    }
  },
};

export const getters = {
  allNotifications: (state) => {
    const backendNotifications : Array<FullNotification> = state.backendNotifications.map(
      (notification) => mapBackendNotification(notification),
    );
    const allNotifications = state.notifications.concat(backendNotifications);
    return allNotifications;
  },
  visibleNotifications: (state, storeGetters) => (
    storeGetters.allNotifications.filter((notification) => notification.visible)
  ),
  numNotifications: (state, storeGetters) => storeGetters.allNotifications.length,
};

const notifications: PortalModule<Notifications> = {
  namespaced: true,
  state: {
    notifications: [],
    backendNotifications: [],
  },
  mutations,
  getters,
  actions,
};

export default notifications;
