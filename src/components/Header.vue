<template>
  <header class="portal__header">
    <div class="portal__header__left" tabindex="0">
      <img class="portal__header__left__image" alt="Portal logo" />
      <h2>Univention Portal</h2>
    </div>
    <div class="portal__header__stretch"></div>
    <div class="portal__header__right">
      <NavigationHamburgerButton @openMenu="openMenu()" />
    </div>
  </header>
  <Navigation :isVisible="burgerMenuClicked"></Navigation>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import NavigationHamburgerButton from "@/components/navigation/NavigationHamburgerButton.vue";
import Navigation from "@/components/navigation/Navigation.vue";

@Options({
  components: {
    NavigationHamburgerButton,
    Navigation,
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
    openMenu(): boolean {
      return this.burgerMenuClicked
        ? (this.burgerMenuClicked = false)
        : (this.burgerMenuClicked = true);
    },
  },
})
export default class Header extends Vue {}
</script>
<style lang="stylus">
.portal
    &__header
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

    &__header__left
        flex: 0 0 auto
        display: flex
        align-items: center
        cursor: pointer

        &__image
            display: none
    &__header__right
        display: flex
        align-items: center
    &__header__stretch
        flex: 1 1 auto
</style>
