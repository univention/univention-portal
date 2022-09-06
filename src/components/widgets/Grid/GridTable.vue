<template>
  <div class="grid-table">
    <div class="grid-table-header">
      <slot name="table-header" />
    </div>
    <div class="grid-table-body">
      <slot name="table-body" />
    </div>
    <ContextMenu
      :is-open="isContextMenuOpen"
      :context-menu-options="contextMenuOptions"
      :position="contextMenuPosition"
      parent-element="grid-table-body"
      @on-open="onOpenContextMenu"
      @on-outside-click="isContextMenuOpen = false"
      @on-operation="(operation) => $emit('onOperation', operation)"
    />
  </div>
</template>

<script lang="ts">
import { GridItem, TableHeaderColumn } from 'components/widgets/Grid/types';
import { defineComponent, PropType } from 'vue';
import { ContextMenu, TableBody, TableHeader } from './components';

export default defineComponent({
  name: 'GridTable',
  components: {
    ContextMenu,
    TableHeader,
    TableBody,
  },
  props: {
    columns: {
      type: Array as PropType<TableHeaderColumn[]>,
      default: () => [],
    },
    items: {
      type: Array as PropType<GridItem[]>,
      required: true,
    },
    onItemSelected: {
      type: Function as PropType<(item: GridItem, deselectAll?: boolean) => void>,
      required: true,
    },
  },
  emits: ['onOperation', 'onSort'],
  data() {
    return {
      isContextMenuOpen: false,
      contextMenuOptions: [
        { label: 'Edit', icon: 'edit-2', operation: 'edit' },
        { label: 'Delete', icon: 'trash', operation: 'remove' },
        { label: 'Edit in new tab', icon: '', operation: 'edit' },
        { label: 'Move to...', icon: '', operation: 'move' },
        { label: 'Copy', icon: '', operation: 'copy' },
        { label: 'Create report', icon: 'file-text', operation: 'search' },
      ],
      contextMenuPosition: {
        x: 0, y: 0,
      },
    };
  },
  methods: {
    onOpenContextMenu(position: {x: number, y: number}) {
      this.contextMenuPosition = position;
      this.isContextMenuOpen = true;
    },
  },
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

</style>
