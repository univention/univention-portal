<template>
  <div
    class="accordions"
  >
    <slot name="header">
      <div class="accordions-header">
        <h2 class="accordions-header__title">
          {{ title }}
        </h2>
      </div>
    </slot>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Accordions',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
});
</script>

<style lang="stylus">
.accordions
  &-header
    padding: calc(2 * var(--layout-spacing-unit));
    &__title
      font-size: var(--font-size-1)
      line-height: var(--font-lineheight-header);
      font-weight: 600;
</style>
