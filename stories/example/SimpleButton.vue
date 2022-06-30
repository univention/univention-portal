<template>
  <button  :class="classes">
    {{ title }}
  </button>
</template>

<script>

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SimpleButton',
  props: {
    title: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      default: 'default',
      validator (value) {
        return ['default', 'light', 'dark'].indexOf(value) !== -1;
      },
    },
    size: {
      type: String,
      default: 'medium',
      validator (value) {
        return ['small', 'medium', 'large'].indexOf(value) !== -1;
      },
    },
  },
  computed: {
    classes() {
      return {
        'simple-button': true,
        [`simple-button--${this.variant || 'default'}`]: true,
        [`simple-button--${this.size || 'medium'}`]: true,
      };
    },
  },
});
</script>

<style lang="stylus">
.simple-button {
  padding: 4px;
  background-color: #00c8ff;
  color: #FFFFFF;
  font-size: 20px;
  width: fit-content;
  cursor: pointer;
  border: solid #00c8ff 4px;

  &--light {
    background-color: #FFFFFF;
    color: #000000;
    border: solid #000000 4px;
  }

  &--dark {
    background-color: #000000;
    color: #FFFFFF;
    border: solid #000000 4px;
  }

  &--small {
    font-size: 16px;
  }

  &--large {
    font-size: 24px;
    padding: 8px;
  }

  &:focus-visible {
    outline: solid purple 4px;
    outline-offset: -4px;
  }
}
</style>
