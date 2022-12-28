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
import { notificationApi } from '@/apis';
import { Notification } from '@/apis/notifications';
import { ActionContext } from 'vuex';

import { PortalModule, RootState } from '../../root.models';

export type PortalActionContext<S> = ActionContext<S, RootState>;

export interface Notifications {
  notifications: Notification[];
  eventSource: EventSource | null;
}

const notifications: PortalModule<Notifications> = {
  namespaced: true,
  state: {
    notifications: [],
    eventSource: null,
  },

  mutations: {
    SET_NOTIFICATIONS: (state, newNotifications: Notification[]) => {
      state.notifications = newNotifications;
    },
    RECEIVE_NOTIFICATION: (state, notification: Notification) => {
      if (state.notifications.find((n) => n.id === notification.id)) {
        return;
      }
      state.notifications.push(notification);
    },
    SET_EVENT_SOURCE: (state, eventSource: EventSource) => {
      state.eventSource = eventSource;
    },
  },

  actions: {
    async fetchNotifications({ commit }) {
      const latestNotifications = await notificationApi.getLatestNotificationsForUserV1NotificationsLatestGet();
      commit('SET_NOTIFICATIONS', latestNotifications);
    },

    async beginReceiveNotifications({ commit }) {
      const eventSource = new EventSource(`${process.env.VUE_APP_NOTIFICATION_API_URL}/v1/notifications/stream`);
      commit('SET_EVENT_SOURCE', eventSource);
      eventSource.addEventListener('new_notification', (baseEvent) => {
        // TODO: Looks like something is missing here to make Typescript aware of the type
        // Compare: https://stackoverflow.com/questions/66465969/eventsource-named-events-using-typescript
        // Currently using a type assertion as interim way to make it work
        const event = (baseEvent as MessageEvent);
        const data = JSON.parse(event.data);
        commit('RECEIVE_NOTIFICATION', data);
      });
    },

    async stopReceiveNotifications({ commit, state }) {
      const eventSource = state.eventSource;
      if (eventSource) {
        eventSource.close();
        commit('SET_EVENT_SOURCE', null);
      }
    },
  },
};

export default notifications;
