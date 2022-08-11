<template>
  <div class="grid-table">
    <div class="grid-table-header">
      <div class="grid-table-header-checkbox">
        <GridCheckbox
          :checked="tableHeaderCheckbox"
          :is-header="true"
          @update:checked="$emit('update:tableHeaderCheckbox', $event)"
        />
      </div>
      <div class="grid-table-header-name">
        <span>Name</span>
      </div>
      <div class="grid-table-header-value">
        <span>{{ columnLabel }}</span>
      </div>
    </div>
    <div class="grid-table-body">
      <div
        v-for="item in items"
        :key="item.name"
        class="grid-table-body-row"
      >
        <div
          class="grid-table-body-row-checkbox"
          @click="onItemSelected(item, false)"
        >
          <GridCheckbox
            :checked="item.selected"
          />
        </div>
        <div
          class="grid-table-body-row-name"
          @click="onItemSelected(item)"
        >
          {{ item.name }}
        </div>
        <div
          class="grid-table-body-row-value"
          @click="onItemSelected(item)"
        >
          {{ item.path }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import GridCheckbox from './GridCheckbox.vue';
import { GridItem, HeaderCheckboxState } from './types';

export default defineComponent({
  name: 'GridTable',
  components: {
    GridCheckbox,
  },
  props: {
    columnLabel: {
      type: String as PropType<string>,
      required: true,
    },
    items: {
      type: Array as PropType<GridItem[]>,
      default: () => [],
    },
    tableHeaderCheckbox: {
      type: Boolean as PropType<HeaderCheckboxState>,
      required: true,
    },
    onItemSelected: {
      type: Function as PropType<(item: GridItem, deselectAll?: boolean) => void>,
      required: true,
    },
  },
  emits: ['update:tableHeaderCheckbox'],
});
</script>

<style lang="stylus">
.grid-table
  width: 100%
  border-top: 1px solid var(--bgc-content-body);

  &-header
    display: flex
    padding: calc(1.5 * var(--layout-spacing-unit-small)) calc(3 * var(--layout-spacing-unit-small))
    border-bottom: 1px solid var(--bgc-content-body);
    font-size: var(--font-size-3)

    &-checkbox
      display: flex
      align-items: center
      width: calc(6 * var(--layout-spacing-unit));
      padding-left: var(--layout-spacing-unit);
      padding-right: calc(2 * var(--layout-spacing-unit));

    &-name
      // subtract the width of the scrollbar
      width: calc(100% - 35px)

    &-value
      width: 100%

  &-body
    width: 100%
    max-height: 30em
    overflow: auto
    &-row
      display: flex
      padding: calc(1.5 * var(--layout-spacing-unit-small)) calc(3 * var(--layout-spacing-unit-small))
      border-bottom: 1px solid var(--bgc-content-body);
      transition: all 250ms ease-in-out;
      &-checkbox
        width: calc(6 * var(--layout-spacing-unit));
        padding-left: var(--layout-spacing-unit);
        padding-right: calc(2 * var(--layout-spacing-unit));

      &-name, &-value
        width: 100%
      &:hover
        background-color: var(--bgc-grid-row-hover)

</style>
