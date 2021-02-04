<template>
  <header class="header">
    <div class="header__left" tabindex="0">
      <img class="header__left__image" alt="Portal logo" />
      <h2>{{ portalName }}</h2>
    </div>
    <div class="header__stretch"></div>
    <div class="header__right">
      <HeaderButton
        ariaLabel="Button for Seachbar"
        icon="search"
        @openFlyout="openFlyout('search')"
        :activeButton="activeFlyoutContent"
      />
      <HeaderButton
        ariaLabel="Open notifications"
        icon="bell"
        @openFlyout="openFlyout('bell')"
        :activeButton="activeFlyoutContent"
      />
      <HeaderButton
        ariaLabel="Button for navigation"
        icon="menu"
        @openFlyout="openFlyout('menu')"
        :activeButton="activeFlyoutContent"
      />
    </div>
    <FlyoutWrapper :isVisible="burgerMenuClicked">
      <h1 v-if="activeFlyoutContent === 'search'">Inputfield</h1>
      <h1 v-if="activeFlyoutContent === 'bell'">notifications</h1>
      <Navigation v-if="activeFlyoutContent === 'menu'" />
    </FlyoutWrapper>
  </header>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HeaderButton from "@/components/navigation/HeaderButton.vue";
import FlyoutWrapper from "@/components/navigation/FlyoutWrapper.vue";
import Navigation from "@/components/navigation/Navigation.vue";

@Options({
  components: {
    HeaderButton,
    FlyoutWrapper,
    Navigation,
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
      this.burgerMenuClicked = this.burgerMenuClicked
        ? (this.burgerMenuClicked = false)
        : (this.burgerMenuClicked = true);
    },
  },
})
export default class Header extends Vue {}
</script>
<style lang="stylus">
.header
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
