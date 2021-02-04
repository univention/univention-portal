<template>
  <header class="header">
    <div class="header__left" tabindex="0">
      <img class="header__left__image" alt="Portal logo" />
      <h2>{{ portalName }}</h2>
    </div>
    <div class="header__stretch"></div>
    <div class="header__right">
      <HeaderButton @openFlyout="openFlyout()" />
    </div>
    <FlyoutWrapper :isVisible="burgerMenuClicked">
      <Navigation />
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
    };
  },
  computed: {
    setIconHeight(): string {
      return this.iconHeight ? this.iconHeight : this.iconWidth;
    },
  },
  methods: {
    openFlyout(): boolean {
      return this.burgerMenuClicked
        ? (this.burgerMenuClicked = false)
        : (this.burgerMenuClicked = true);
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
