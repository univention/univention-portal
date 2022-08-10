<template>
  <div class="grid-table">
    <div class="grid-table-header">
      <div class="grid-table-header-checkbox">
        <GridCheckbox
          :checked="isAllItemsSelected"
          @update:checked="$emit('update:isAllItemsSelected', $event)"
        />
      </div>
      <div class="grid-table-header-name">
        <span>Name</span>
      </div>
      <div class="grid-table-header-value">
        <span>{{ columnLabel }}</span>
      </div>
    </div>
    <div
      v-for="item in items"
      :key="item.name"
      class="grid-table-row"
      @click="onItemSelected(item)"
    >
      <div class="grid-table-row-checkbox">
        <GridCheckbox
          :checked="item.selected"
        />
      </div>
      <div class="grid-table-row-name">
        {{ item.name }}
      </div>
      <div class="grid-table-row-value">
        {{ item.path }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import GridCheckbox from './GridCheckbox.vue';
import { GridItem } from './types';

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
    isAllItemsSelected: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
    onItemSelected: {
      type: Function as PropType<(item: GridItem) => void>,
      required: true,
    },
  },
  emits: ['update:isAllItemsSelected'],
});
</script>

<style lang="stylus">
.grid-table
  width: 100%
  border-top: 1px solid var(--bgc-content-body);
  max-height: 30em
  overflow: auto

  &-header, &-row
    display: flex
    padding: calc(1.5 * var(--layout-spacing-unit-small)) calc(3 * var(--layout-spacing-unit-small))
    border-bottom: 1px solid var(--bgc-content-body);

    &-checkbox
      width: calc(6 * var(--layout-spacing-unit));
      padding-left: var(--layout-spacing-unit);
      padding-right: calc(2 * var(--layout-spacing-unit));

    &-name, &-value
      width: 100%

</style>
