<template>
  <div class="grid-table">
    <div class="grid-table-header">
      <slot name="header" />
    </div>
    <div class="grid-table-body">
      <slot name="body" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GridTable',
});
</script>

<style lang="stylus">
.grid-table
  width: 100%
  border-top: 1px solid var(--bgc-content-body)

  &-header
    display: flex
    padding: calc(1.5 * var(--layout-spacing-unit-small)) calc(3 * var(--layout-spacing-unit-small))
    border-bottom: 1px solid var(--bgc-content-body)
    font-size: var(--font-size-3)

    > div
      display: flex
      align-items: center

    &-checkbox
      display: flex
      align-items: center
      width: calc(6 * var(--layout-spacing-unit));
      padding-left: var(--layout-spacing-unit);
      padding-right: calc(2 * var(--layout-spacing-unit));

    &-name
      // subtract the width of the scrollbar
      width: calc(100% - 35px)
      cursor: pointer

    &-value
      width: 100%
      cursor: pointer

    &-sort-icon
      margin-right: 5px
      transition: transform 250ms
      &-asc
        transform: rotate(180deg)
      &-desc
        transform: rotate(0deg)

  &-body
    width: 100%
    max-height: 30em
    overflow: auto

    &-row
      display: flex
      align-items: center
      padding: calc(1.5 * var(--layout-spacing-unit-small)) calc(3 * var(--layout-spacing-unit-small))
      border-bottom: 1px solid var(--bgc-content-body)
      transition: all 250ms

      > div
        display: flex
        align-items: center

      &-checkbox
        width: calc(6 * var(--layout-spacing-unit))
        padding-left: var(--layout-spacing-unit)
        padding-right: calc(2 * var(--layout-spacing-unit))

      &-name, &-value
        width: 100%

      &:hover
        background-color: var(--bgc-grid-row-hover)

</style>
