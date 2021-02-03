<template>
  <div class="navigation-hamburger-button">
    <span class="navigation-hamburger-button__inner" role="presentation">
      <button
        class="navigation-hamburger-button__button"
        id="toggle"
        aria-expanded="false"
        aria-label="Button for Main Menu"
        @click="openNavigation"
      >
        <Icon
          class="navigation-hamburger-button__menu"
          icon="menu"
          iconWidth="2rem"
        />
      </button>
    </span>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Icon from "@/components/Icon.vue";

@Options({
  name: "NavigationHamburgerButton",
  components: {
    Icon,
  },
  methods: {
    openNavigation() {
      console.log("lol");
    },
  },
})
export default class NavigationHamburgerButton extends Vue {}
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

  &__input
    position: absolute !important;
    left: -10000px !important;
    top: -10000px !important;

  &__button
    width: 4rem;
    height: 4rem;
    background: none;
    border: none;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover,
    &:focus
      border-radius: 100%;
      background-color: var(--bgc-content-body);

    &:hover
      cursor: pointer;
</style>
