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
        :active-button="activeFlyoutContent"
        aria-label="Button for Seachbar"
        icon="search"
        @click="openFlyout('search', false)"
      />
      <header-button
        :active-button="activeFlyoutContent"
        aria-label="Open notifications"
        icon="bell"
        @click="openFlyout('bell', true)"
      />
      <header-button
        :active-button="activeFlyoutContent"
        aria-label="Button for navigation"
        icon="menu"
        @click="openFlyout('menu', true)"
      />
    </div>

    <flyout-wrapper :is-visible="activeFlyout">
      <!-- TODO Semantic headlines -->
      <portal-search v-if="activeFlyoutContent === 'search'" />
    </flyout-wrapper>

    <portal-modal
      :is-active="this.$store.getters.modalState"
      @changeMenuState="changeMenuState"
    >
      <flyout-wrapper :is-visible="this.$store.getters.modalState">
        <!-- TODO Semantic headlines -->
        <h1 v-if="activeFlyoutContent === 'bell'">
          notifications
        </h1>
        <side-navigation v-if="activeFlyoutContent === 'menu'" />
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
  data() {
    return {
      activeFlyout: false,
      activeFlyoutContent: '',
    };
  },
  computed: {
    ...mapGetters({
      showFlyout: 'navigation/getFlyout',
    }),
    setIconHeight(): string {
      return this.iconHeight ? this.iconHeight : this.iconWidth;
    },
    activeSearchButton(): boolean {
      return this.activeFlyoutContent === 'search';
    },
  },
  methods: {
    openFlyout(buttonType: string, hasModal): void {
      // TODO: solve no-unused-expressions
      if (buttonType === this.activeFlyoutContent || !this.activeFlyout) {
        this.changeMenuState(hasModal);
        this.activeFlyoutContent = buttonType;
      } else {
        this.changeMenuState();
        setTimeout(() => {
          this.changeMenuState(hasModal);
          this.activeFlyoutContent = buttonType;
        }, 100);
      }

      // eslint-disable-next-line no-unused-expressions
      !this.activeFlyout ? (this.activeFlyoutContent = '') : null;
    },
    changeMenuState(hasModal): void {
      // TODO: solve no-unused-expressions
      if (this.activeFlyout) {
        this.activeFlyoutContent = '';
        setTimeout(() => {
          this.activeFlyout = false;
          // eslint-disable-next-line no-unused-expressions
          hasModal ? this.$store.commit('hideModal') : null;
          // store flyout state
          this.setFlyoutState();
        }, 50);
      } else {
        this.activeFlyout = true;
        // eslint-disable-next-line no-unused-expressions
        hasModal ? this.$store.commit('showModal') : null;
        // store flyout state
        this.setFlyoutState();
      }
    },
    setFlyoutState() {
      this.$store.dispatch('navigation/setShowFlyout', this.activeFlyout);
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
