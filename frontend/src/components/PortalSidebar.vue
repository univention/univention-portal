<!--
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
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
      :full="activeLeftMenuButton"
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
      return [];
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
