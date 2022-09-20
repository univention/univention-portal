<template>
  <div
    class="grid-table"
    role="grid"
  >
    <div
      class="grid-table-header"
      role="row"
    >
      <slot
        name="table-header"
      />
    </div>
    <div class="grid-table-body">
      <slot name="table-body" />
    </div>
  </div>
</template>

<script lang="ts">
import { GridItem, TableHeaderColumn } from 'components/widgets/Grid/types';
import { defineComponent, PropType } from 'vue';
import { ContextMenu, TableBody, TableHeader } from './index';

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

</style>
