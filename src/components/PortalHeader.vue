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
      <portal-search v-if="activeSearchButton" />
    </flyout-wrapper>

    <portal-modal
      :is-active="this.$store.getters.modalState"
      @changeMenuState="changeMenuState"
    >
      <flyout-wrapper :is-visible="this.$store.getters.modalState">
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
      console.log('this.buttonIsClicked(buttonType)', this.buttonIsClicked(buttonType));
      this.changeMenuState(buttonType, hasModal);
      this.setFocus(buttonType);
    },
    changeMenuState(buttonType: string, hasModal): void {
      if (!this.sameButtonClicked(buttonType) && this.activeFlyout) {
        console.log('TESTCHECK');
        if (buttonType === 'search') {
          this.$store.commit('hideModal');
        } else {
          this.$store.commit('showModal');
        }
        this.activeFlyoutContent = buttonType;
      } else if (this.activeFlyout && this.activeFlyoutContent.length >= 0) {
        console.log('test');
        this.activeFlyout = false;
        if (hasModal) {
          this.$store.commit('hideModal');
        }
        setTimeout(() => {
          this.setActiveButton('');
        }, 100);
      } else {
        this.activeFlyout = true;
        if (hasModal) {
          this.$store.commit('showModal');
        }
        // store flyout state
        this.setFlyoutState();
        setTimeout(() => {
          this.setActiveButton(buttonType);
        }, 100);
      }
      console.log('buttonisClicked, changeMenuState');
      console.log('____________________________________________');
      console.log('activeFlyoutContent', this.activeFlyoutContent);
      console.log('this.activeFlyout', this.activeFlyout);
      console.log('this.buttonIsClicked', this.buttonIsClicked());
      console.log('____________________________________________');
    },
    setFocus(buttonType): void {
      console.log('Setting Focus on: ', buttonType);
    },
    setFlyoutState() {
      this.$store.dispatch('navigation/setShowFlyout', this.activeFlyout);
    },
    setActiveButton(buttonType) {
      console.log(buttonType);
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
