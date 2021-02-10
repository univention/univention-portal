<template>
  <header class="portal-header">
    <div
      class="portal-header__left"
      tabindex="0"
    >
      <img
        class="portal-header__left-image"
        alt="Portal logo"
      >
      <h2>{{ portalName }}</h2>
    </div>
    <div class="portal-header__stretch" />
    <div class="portal-header__right">
      <header-button
        aria-label="Button for Searchbar"
        icon="search"
      />
      <header-button
        aria-label="Open notifications"
        icon="bell"
      />
      <header-button
        aria-label="Button for navigation"
        icon="menu"
      />
    </div>

    <flyout-wrapper :is-visible="activeSearchButton">
      <!-- TODO Semantic headlines -->
      <portal-search v-if="activeSearchButton" />
    </flyout-wrapper>

    <portal-modal
      :is-active="activeNotificationButton || activeMenuButton"
      @click="closeModal()"
    >
      <flyout-wrapper :is-visible="activeNotificationButton || activeMenuButton">
        <!-- TODO Semantic headlines -->
        <h1 v-if="activeNotificationButton">
          notifications
        </h1>
        <side-navigation v-if="activeMenuButton" />
      </flyout-wrapper>
    </portal-modal>
  </header>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

import HeaderButton from '@/components/navigation/HeaderButton.vue';
import FlyoutWrapper from '@/components/navigation/FlyoutWrapper.vue';
import SideNavigation from '@/components/navigation/SideNavigation.vue';
import PortalModal from '@/components/globals/PortalModal.vue';
import PortalSearch from '@/components/search/PortalSearch.vue';

@Options({
  name: 'PortalHeader',
  components: {
    HeaderButton,
    FlyoutWrapper,
    SideNavigation,
    PortalModal,
    PortalSearch,
  },
  props: {
    portalName: {
      type: String,
      default: 'Univention Portal',
    },
  },
  methods: {
    closeModal() {
      this.$store.dispatch('navigation/setActiveButton', '');
    },
  },
  computed: {
    ...mapGetters({
      activeButton: 'navigation/getActiveButton',
    }),
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
    setActiveButton(buttonType) {
      this.activeFlyoutContent = buttonType;
    },
    buttonIsClicked(buttonType): boolean {
      return this.activeFlyoutContent === buttonType;
    },
    sameButtonClicked(buttonType): boolean {
      return buttonType === this.activeFlyoutContent;
    },
  },
})
export default class PortalHeader extends Vue {}
</script>

<style lang="stylus">
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

    &-image
      display: none;
  &__right
    display: flex;
    align-items: center;
  &__stretch
    flex: 1 1 auto;
</style>
