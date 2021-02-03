<template>
  <div
    class="navigation-hamburger-button ucsButton ucsIconButton dijitToggleButton"
  >
    <span
      class="navigation-hamburger-button__inner dijitReset"
      role="presentation"
    >
      <span
        class="navigation-hamburger-button__button"
        role="button"
        tabindex="0"
        id="umc_widgets_ToggleButton_1"
      >
        <Icon class="navigation-hamburger-button__menu" icon="menu" />
      </span>
    </span>
  </div>
</template>
<script lang="ts">
import Icon from "@/components/Icon.vue";
export default {
  name: "NavigationHamburgerButton",
  components: {
    Icon,
  },
};
</script>
<style lang="stylus">
.navigation-hamburger-button
  --font-size-button-icon: var(--font-size-big)
  margin: 0 var(--layout-spacing-unit-small)
  --bgc: transparent;
  --bgc-state: transparent;
  box-shadow: none;
  border-radius: var(--button-icon-border-radius);

  &__inner
    border: none;
    border-radius: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--button-bgc-transition);
    background-color: var(--bgc-state);
    transition: opacity 250ms;
    font-size: var(--button-font-size);
    --button-size: var(--g-button-size);
    --button-iconSize: 1rem;

  &__input
    position: absolute !important;
    left: -10000px !important;
    top: -10000px !important;

  &__button
    width: var(--button-size);
    height: var(--button-size);
    display: flex;
    align-items: center;
    justify-content: center;
  &__menu
    width: var(--button-iconSize);
    height: var(--button-iconSize);
</style>
