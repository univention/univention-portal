<template>
  <header
    id="portal-header"
    class="portal-header"
  >
    <div
      class="portal-header__left"
      tabindex="0"
    >
      <!-- Nav Tabs -->
      <header-tabs
        v-for="(item, index) in tabs"
        :key="index"
        :tab-index="index"
        :tab-token="item.tabToken"
        :tab-icon="item.tabIcon"
        :tab-label="item.tabLabel"
        :aria-label="item.ariaLabel"
        :tab-static="item.tabStatic"
        :tab-image="item.tabImage"
      />
    </div>
    <div class="portal-header__stretch" />
    <div class="portal-header__right">
      <header-button
        aria-label="Button for Searchbar"
        icon="search"
        @click="dismissBubble"
      />
      <header-button
        aria-label="Open notifications"
        icon="bell"
        @click="dismissBubble"
      />
      <header-button
        aria-label="Button for navigation"
        icon="menu"
        @click="dismissBubble"
      />
    </div>

    <notification-bubble>
      <template #bubble-standalone>
        <notification-bubble-slot bubble-container="standalone" />
      </template>
    </notification-bubble>

    <flyout-wrapper :is-visible="activeSearchButton">
      <!-- TODO Semantic headlines -->
      <portal-search v-if="activeSearchButton" />
    </flyout-wrapper>

    <portal-modal
      :is-active="activeNotificationButton || activeMenuButton"
      @click="closeModal()"
    >
      <flyout-wrapper
        :is-visible="activeNotificationButton || activeMenuButton"
        class="flyout-wrapper__notification"
      >
        <!-- TODO Semantic headlines -->
        <div
          v-if="activeNotificationButton"
          class="portal-header__title"
        >
          {{ notificationsLabel }}
        </div>
        <notification-bubble
          v-if="activeNotificationButton"
          class="flyout-wrapper__bubble"
        >
          <template #bubble-embedded>
            <notification-bubble-slot bubble-container="embedded" />
          </template>
        </notification-bubble>
        <side-navigation v-if="activeMenuButton" />
      </flyout-wrapper>
    </portal-modal>
  </header>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

import Notifications from '@/assets/mocks/notifications.json';

import HeaderButton from '@/components/header/HeaderButton.vue';
import HeaderTabs from '@/components/header/HeaderTabs.vue';

import FlyoutWrapper from '@/components/navigation/FlyoutWrapper.vue';
import SideNavigation from '@/components/navigation/SideNavigation.vue';
import PortalModal from '@/components/globals/PortalModal.vue';
import NotificationBubble from '@/components/globals/NotificationBubble.vue';
import PortalSearch from '@/components/search/PortalSearch.vue';
import NotificationBubbleSlot from '@/components/globals/NotificationBubbleSlot.vue';
import _ from '@/jsHelper/i18n.js';

import notificationMixin from '@/mixins/notificationMixin.vue';

@Options({
  name: 'PortalHeader',
  components: {
    HeaderButton,
    HeaderTabs,
    FlyoutWrapper,
    SideNavigation,
    PortalModal,
    NotificationBubble,
    NotificationBubbleSlot,
    PortalSearch,
  },
  mixins: [
    notificationMixin,
  ],
  computed: {
    ...mapGetters({
      activeButton: 'navigation/getActiveButton',
      tabs: 'tabs/getAllTabs',
    }),
    notificationsLabel(): string {
      return _('Notifications').value;
    },
    setIconHeight(): string {
      return this.iconHeight ? this.iconHeight : this.iconWidth;
    },
    activeSearchButton(): boolean {
      return this.activeButton === 'search';
    },
    activeNotificationButton(): boolean {
      return this.activeButton === 'bell';
    },
    activeMenuButton(): boolean {
      return this.activeButton === 'menu';
    },
  },
  created() {
    this.setBubbleStandaloneContent();
  },
  methods: {
    closeModal() {
      this.$store.dispatch('navigation/setActiveButton', '');
    },
    setBubbleStandaloneContent() {
      // TODO: replace with dynamic content from e.g. an API
      this.$store.dispatch('notificationBubble/setContent', Notifications);
    },
  },
})
export default class PortalHeader extends Vue {}
</script>

<style lang="stylus" scoped>
.portal-header
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background-color: var(--bgc-content-header);
  color: var(--font-color-contrast-high);
  height: var(--portal-header-height);
  display: flex;
  padding: 0 calc(2 * var(--layout-spacing-unit));

  &__left
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    cursor: pointer;
  &__right
    display: flex;
    align-items: center;
  &__stretch
    flex: 1 1 auto;
  &__bubble-container
    width: 360px;

  &__title
    margin: calc(2 * var(--layout-spacing-unit)) 0
    margin-left: calc(2.5 * var(--layout-spacing-unit))
    font-size: 20px
</style>
