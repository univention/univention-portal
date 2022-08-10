<template>
  <div
    class="checkbox"
    aria-disabled="false"
    :aria-checked="checked"
    role="checkbox"
    tabindex="0"
    @click="onCheck"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'GridCheckbox',
  props: {
    checked: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  emits: ['update:checked'],
  methods: {
    onCheck() {
      this.$emit('update:checked', !this.checked);
    },
  },
});
</script>

<style lang="stylus">
.checkbox
  --local-border-color: var(--font-color-contrast-low)
  --local-background-color: transparent
  width: var(--font-size-4)
  height: var(--font-size-4)
  background-color: var(--local-background-color)
  transition: all 250ms ease-in-out
  margin-right: var(--layout-spacing-unit-small)
  border: 2px solid
  border-radius: 2px

  &:hover
    background-color: var(--bgc-checkbox-hover)
  &[aria-checked=false]
    border-color: var(--local-border-color)
  &[aria-checked=true]
    border-color: var(--color-accent)
    &::after
      opacity: 1

  &::after
    content: "✓"
    display: block
    width: 100%
    height: 100%
    line-height: 120%
    font-size: 0.85rem
    font-weight: bold
    text-align: center
    color: var(--color-accent)
    opacity: 0

</style>
