<!--
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
-->
<template>
  <region
    :id="`notifications-${!isInNotificationBar ? 'visible' : 'all'}`"
    :aria-live="ariaLiveStatus"
    direction="topdown"
    class="notifications"
    @keydown.esc="closeNotifications"
  >
    <div
      v-if="isInNotificationBar && notifications.length > 1"
      class="notifications__close-all"
    >
      <button
        type="button"
        @click.prevent="closeAll"
      >
        <portal-icon
          icon="trash"
        />
        <span>
          {{ REMOVE_ALL_NOTIFICATIONS }}
        </span>
      </button>
    </div>
    <notification
      v-for="notification in notifications"
      :key="notification.token"
      v-bind="notification"
      @alertRemovedNotification="alertRemovedNotification"
    />
    <span
      v-if="isInNotificationBar && notifications.length === 0"
      class="notifications__no-notifications"
    >
      {{ NO_NOTIFICATIONS }}
    </span>
    <div
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        v-if="allNotificationsRemovedAtOnce"
        class="sr-only sr-only-mobile"
      >
        {{ NOTIFICATIONS_REMOVED }}
      </span>
      <span
        v-if="closedNotification"
        class="sr-only sr-only-mobile"
      >
        {{ NOTIFICATION_REMOVED }}
      </span>
    </div>
  </region>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import _ from '@/jsHelper/translate';

import Region from '@/components/activity/Region.vue';
import Notification from '@/components/notifications/Notification.vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';

interface NotificationsData {
  closedNotification: boolean,
  allNotificationsRemovedAtOnce: boolean,
}

export default defineComponent({
  name: 'Notifications',
  components: {
    Notification,
    Region,
    PortalIcon,
  },
  props: {
    isInNotificationBar: {
      type: Boolean,
      required: true,
    },
  },
  data(): NotificationsData {
    return {
      closedNotification: false,
      allNotificationsRemovedAtOnce: false,
    };
  },
  computed: {
    ...mapGetters({
      allNotifications: 'notifications/allNotifications',
      visibleNotifications: 'notifications/visibleNotifications',
      activeButton: 'navigation/getActiveButton',
    }),
    notifications() {
      if (!this.isInNotificationBar) {
        return this.visibleNotifications;
      }
      return this.allNotifications;
    },
    REMOVE_ALL_NOTIFICATIONS(): string {
      return _('Remove all');
    },
    NO_NOTIFICATIONS(): string {
      return _('No notifications');
    },
    NOTIFICATIONS_REMOVED(): string {
      return _('Notifications removed');
    },
    NOTIFICATION_REMOVED(): string {
      return _('Notification removed');
    },
    ariaLiveStatus(): string {
      return !this.isInNotificationBar ? 'polite' : 'off';
    },
  },
  created() {
    if (this.isInNotificationBar) {
      this.$store.dispatch('modal/disableBodyScrolling');
    }
  },
  methods: {
    closeAll(): void {
      this.$store.dispatch('notifications/removeAllNotifications');
      this.allNotificationsRemovedAtOnce = true;
      setTimeout(() => {
        this.allNotificationsRemovedAtOnce = false;
      }, 100);
    },
    closeNotifications(): void {
      if (this.activeButton === 'bell') {
        this.$store.dispatch('navigation/setActiveButton', '');
      }
    },
    alertRemovedNotification() {
      this.closedNotification = true;
      setTimeout(() => {
        this.closedNotification = false;
      }, 100);
    },
  },
});

</script>

<style lang="stylus">
.notifications
  position: fixed
  z-index: $zindex-4
  top: calc(var(--layout-height-header) + 1rem)
  right: var(--layout-spacing-unit)
  width: 90vw
  max-width: 300px
  max-height: 100%
  overflow-y: auto
  padding-right: calc(3 * var(--layout-spacing-unit))

  @media $mqSmartphone
    padding-right: 0
    right: 0
    left: calc(3 * var(--layout-spacing-unit))
    width: 73vw
    font-size: var(--font-size-5)

  &__close-all
    display: flex
    justify-content: flex-start
    margin-bottom: calc(4 * var(--layout-spacing-unit))

  &__no-notifications
    font-size: var(--font-size-2)

  .flyout-wrapper &
    top: calc(4 * var(--layout-spacing-unit));
    height: calc(100vh - var(--layout-height-header) - 10 * var(--layout-spacing-unit))

.test
  display: flex
</style>
