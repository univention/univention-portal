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
      />
      <HeaderButton
        ariaLabel="Button for navigation"
        icon="menu"
        @openFlyout="openFlyout('navigation')"
      />
    </div>
    <FlyoutWrapper :isVisible="burgerMenuClicked">
      <Navigation v-if="activeFlyoutContent === 'navigation'" />
      <h1 v-if="activeFlyoutContent === 'search'">HALLO</h1>
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
      console.log("buttonType", buttonType);
      this.activeFlyoutContent = buttonType;

      if (buttonType === this.activeFlyoutContent) {
        console.log("true");
        this.burgerMenuClicked = this.burgerMenuClicked
          ? (this.burgerMenuClicked = false)
          : (this.burgerMenuClicked = true);
      } else {
        console.log("this.activeFlyoutContent", this.activeFlyoutContent);
        console.log("buttonType", buttonType);
        console.log("this.burgerMenuClicked", this.burgerMenuClicked);
      }
      return this.burgerMenuClicked;
    },
  },
})
export default class Header extends Vue {}
</script>
<style lang="stylus">
.header
    position: fixed
    top: 0
    left: 0
    right: 0
    z-index: 1
    background-color: var(--bgc-content-header)
    color: var(--font-color-contrast-high)
    height: var(--portal-header-height)
    display: flex
    padding: 0 calc(2 * var(--layout-spacing-unit))

    &__left
        flex: 0 0 auto
        display: flex
        align-items: center
        cursor: pointer

        &__image
            display: none
    &__right
        display: flex
        align-items: center
    &__stretch
        flex: 1 1 auto
</style>
