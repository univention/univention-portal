<template>
  <div class="header-button">
    <span class="header-button__inner" role="presentation">
      <button
        class="header-button__button"
        aria-expanded="false"
        aria-label="Button for Main Menu"
        @click="openFlyout"
      >
        <Icon icon="menu" iconWidth="2rem" />
      </button>
    </span>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Icon from "@/components/Icon.vue";

@Options({
  name: "HeaderButton",
  components: {
    Icon,
  },
  methods: {
    openFlyout() {
      this.$emit("openFlyout");
    },
  },
})
export default class HeaderButton extends Vue {}
</script>
<style lang="stylus">
.header-button
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
