<template>
  <div
    :class="{ 'header-button--is-active': isActiveButton }"
    class="header-button"
  >
    <span
      class="header-button__inner"
      role="presentation"
    >
      <button
        :aria-expanded="isActiveButton"
        :aria-label="ariaLabel"
        class="header-button__button"
      >
        <portal-icon
          :icon="icon"
          :icon-color="setIconColor"
          icon-width="2rem"
        />
      </button>
    </span>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PortalIcon from '@/components/globals/PortalIcon.vue';

@Options({
  name: 'HeaderButton',
  components: {
    PortalIcon,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    ariaLabel: {
      type: String,
      required: true,
    },
    activeButton: {
      type: String,
      required: true,
    },
  },

  computed: {
    setIconColor() {
      return this.activeButton === this.icon ? '#7ab51d' : '#ffffff';
    },
    isActiveButton() {
      return this.activeButton === this.icon;
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

  &--is-active
      z-index:1000;

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
