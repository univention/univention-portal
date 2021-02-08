<template>
  <header class="portal-header">
    <div class="portal-header__left" tabindex="0">
      <img class="portal-header__left__image" alt="Portal logo" />
      <h2>{{ portalName }}</h2>
    </div>
    <div class="portal-header__stretch" />
    <div class="portal-header__right">
      <header-button
        :activeButton="activeFlyoutContent"
        ariaLabel="Button for Seachbar"
        icon="search"
        @openFlyout="openFlyout('search')"
      />
      <header-button
        :activeButton="activeFlyoutContent"
        ariaLabel="Open notifications"
        icon="bell"
        @openFlyout="openFlyout('bell')"
      />
      <header-button
        :activeButton="activeFlyoutContent"
        ariaLabel="Button for navigation"
        icon="menu"
        @openFlyout="openFlyout('menu')"
      />
    </div>
    <portal-modal
      :isActive="this.$store.getters.modalState"
      @changeMenuState="changeMenuState"
    >
      <flyout-wrapper :isVisible="this.$store.getters.modalState">
        <!-- TODO Semantic headlines -->

        <h1 v-if="activeFlyoutContent === 'bell'">
          notifications
        </h1>
        <side-navigation v-if="activeFlyoutContent === 'menu'" />
      </flyout-wrapper>
    </portal-modal>
    <flyout-wrapper :isVisible="this.$store.getters.modalState">
      <!-- TODO Semantic headlines -->
      <portal-search v-if="activeFlyoutContent === 'search'">
        Inputfield
      </portal-search>
    </flyout-wrapper>
  </header>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HeaderButton from "@/components/navigation/HeaderButton.vue";
import FlyoutWrapper from "@/components/navigation/FlyoutWrapper.vue";
import SideNavigation from "@/components/navigation/SideNavigation.vue";
import PortalModal from "@/components/globals/PortalModal.vue";
import PortalSearch from "@/components/search/PortalSearch.vue";

@Options({
  name: "PortalHeader",
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
      default: "Univention Portal",
    },
  },
  data() {
    return {
      burgerMenuClicked: false,
      activeFlyoutContent: "",
    };
  },
  computed: {
    setIconHeight(): string {
      return this.iconHeight ? this.iconHeight : this.iconWidth;
    },
  },
  methods: {
    openFlyout(buttonType: string): boolean {
      if (buttonType === this.activeFlyoutContent || !this.burgerMenuClicked) {
        this.changeMenuState();
        this.activeFlyoutContent = buttonType;
      } else {
        this.changeMenuState();
        setTimeout(() => {
          this.changeMenuState();
          this.activeFlyoutContent = buttonType;
        }, 100);
      }

      return this.burgerMenuClicked;
    },
    changeMenuState(): void {
      if (this.burgerMenuClicked) {
        this.burgerMenuClicked = false;
        this.$store.commit("hideModal");
        this.activeFlyoutContent = "";
      } else {
        this.burgerMenuClicked = true;
        this.$store.commit("showModal");
      }
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

        &__image
            display: none;
    &__right
        display: flex;
        align-items: center;
    &__stretch
        flex: 1 1 auto;
</style>
