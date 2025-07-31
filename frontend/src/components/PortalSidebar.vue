<!--
Copyright 2021-2024 Univention GmbH

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
  <div class="portal-sidebar">
    <modal-wrapper
      :is-active="
        activeNotificationButton ||
          activeMenuButton ||
          activeEditModeButton ||
          activeLeftMenuButton
      "
      @backgroundClick="closeSidebar"
    >
      <transition
        name="slide-left"
        appear
      >
        <flyout-wrapper
          v-if="activeLeftMenuButton"
          :is-visible="activeLeftMenuButton"
          :from-left="true"
          class="portal-sidebar__flyout"
        >
          <left-side-navigation
            :links="leftMenuItems"
            :is-left-sidebar="true"
          />
        </flyout-wrapper>
      </transition>
      <transition
        name="slide"
        appear
      >
        <flyout-wrapper
          v-if="activeNotificationButton"
          :is-visible="activeNotificationButton"
          class="portal-sidebar__flyout"
        >
          <notifications :is-in-notification-bar="true" />
        </flyout-wrapper>
      </transition>

      <transition
        name="slide"
        appear
      >
        <flyout-wrapper
          v-if="activeMenuButton"
          :is-visible="activeMenuButton"
          class="portal-sidebar__flyout"
        >
          <side-navigation
            :links="menuItems"
          />
        </flyout-wrapper>
      </transition>

      <transition
        name="slide"
        appear
      >
        <flyout-wrapper
          v-if="activeEditModeButton"
          :is-visible="activeEditModeButton"
          class="portal-sidebar__flyout"
        >
          <edit-mode-side-navigation v-if="activeEditModeButton" />
        </flyout-wrapper>
      </transition>
    </modal-wrapper>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import FlyoutWrapper from '@/components/navigation/FlyoutWrapper.vue';
import ModalWrapper from '@/components/modal/ModalWrapper.vue';
import Notifications from '@/components/notifications/Notifications.vue';
import SideNavigation from '@/components/navigation/SideNavigation.vue';
import LeftSideNavigation from '@/components/navigation/LeftSideNavigation.vue';
import EditModeSideNavigation from '@/components/navigation/EditModeSideNavigation.vue';
import { mockLeftSidebarMenu } from '../jsHelper/mockLeftSidebarMenu';

export default defineComponent({
  name: 'PortalSidebar',
  components: {
    FlyoutWrapper,
    ModalWrapper,
    Notifications,
    SideNavigation,
    LeftSideNavigation,
    EditModeSideNavigation,
  },
  computed: {
    ...mapGetters({
      activeButton: 'navigation/getActiveButton',
      menuItems: 'menu/getMenu',
    }),
    leftMenuItems() {
      return mockLeftSidebarMenu || [];
    },
    activeNotificationButton(): boolean {
      return this.activeButton === 'bell';
    },
    activeLeftMenuButton(): boolean {
      return this.activeButton === 'left-menu';
    },
    activeMenuButton(): boolean {
      return this.activeButton === 'menu';
    },
    activeEditModeButton(): boolean {
      return this.activeButton === 'settings';
    },
  },
  methods: {
    closeSidebar(): void {
      this.$store.dispatch('navigation/setActiveButton', '');
    },
  },
});
</script>

<style lang="stylus">
.portal-sidebar

  &__title
    margin: calc(2 * var(--layout-spacing-unit)) 0
    margin-left: calc(2.5 * var(--layout-spacing-unit))
    font-size: 20px
    font-weight: normal

.slide-enter-active,
.slide-leave-active {
  transition: transform var(--portal-transition-duration) ease
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(22rem)
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform var(--portal-transition-duration) ease
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-22rem)
}
</style>
