<template>
  <div class="grid">
    <GridHeader
      :is-any-item-selected="isAnyItemSelected"
      :number-items="gridItems.length"
      :number-items-selected="selectedItems.length"
      @on-operation="onOperation"
      @on-add-new-item="onAddNewItem"
    />
    <GridTable
      :items="gridItems"
      :columns="tableHeaderColumns"
      :on-item-selected="onItemSelected"
      @on-sort="onSort"
      @on-operation="onOperation"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { TableHeader } from './components';
import GridHeader from './GridHeader.vue';
import GridTable from './GridTable.vue';
import {
  GridItem,
  GridItemProps,
  HeaderCheckboxState,
  Operation,
  OperationProps,
  SortDirection,
  TableHeaderColumn,
  TableHeaderColumnProps,
} from './types';

interface Data {
  tableHeaderCheckbox: HeaderCheckboxState;
  gridItems: GridItem[];
  tableHeaderColumns: TableHeaderColumn[];
}

export default defineComponent({
  name: 'Grid',
  components: {
    GridHeader,
    GridTable,
    TableHeader,
  },
  props: {
    columns: {
      type: Array as PropType<TableHeaderColumnProps[]>,
      default: () => [],
    },
    items: {
      type: Array as PropType<GridItemProps[]>,
      default: () => [],
    },
    on: {
      type: Object as PropType<OperationProps>,
      required: true,
    },
    onAddNewItem: {
      type: Function as PropType<() => void>,
      required: true,
    },
  },
  data(): Data {
    return {
      tableHeaderCheckbox: false,
      gridItems: [],
      tableHeaderColumns: [],
    };
  },
  computed: {
    isAnyItemSelected(): boolean {
      return this.gridItems.some((item) => item.selected);
    },
    isAllItemsSelected(): boolean {
      return this.gridItems.every((item) => item.selected);
    },
    selectedItems(): GridItem[] {
      return this.gridItems.filter((item) => item.selected);
    },
  },
  watch: {
    tableHeaderCheckbox(state: HeaderCheckboxState) {
      if (typeof state === 'boolean') {
        this.gridItems.forEach((item) => {
          item.selected = state;
        });
      }
    },
    gridItems: {
      deep: true,
      handler() {
        if (!this.isAnyItemSelected) {
          // if no items are selected
          this.tableHeaderCheckbox = false;
        } else if (!this.isAllItemsSelected) {
          // if some items are selected but not all
          this.tableHeaderCheckbox = 'mixed';
        } else {
          // if all items are selected
          this.tableHeaderCheckbox = true;
        }
      },
    },
  },
  mounted() {
    this.gridItems = this.items.map((item) => ({
      ...item,
      selected: false,
    }));
    // init table header columns to be displayed
    this.initTableHeaderColumns();
  },
  methods: {
    onItemSelected(item: GridItem, deselectAll = true) {
      // deselect all other items if user clicks on other parts of the row (name, value) but not the checkbox
      if (deselectAll) {
        this.gridItems.forEach((gridItem) => {
          gridItem.selected = false;
        });
      }
      item.selected = !item.selected;
    },
    initTableHeaderColumns() {
      // if user has not specified any columns, we will show all columns except any columns that have the "$" sign in their property key
      if (!this.columns || this.columns.length === 0) {
        const itemPropertyKeys = Object.keys(this.items[0]);
        this.tableHeaderColumns = itemPropertyKeys
          .filter((key) => !key.includes('$'))
          .map((key) => ({ key, label: key, isSorted: false, sortDirection: 'asc' }));
        return;
      }
      this.tableHeaderColumns = this.columns.map((column) => ({
        ...column,
        isSorted: false,
        sortDirection: 'asc',
      }));
    },
    onTableHeaderCheckboxUpdate(selected: HeaderCheckboxState) {
      this.tableHeaderCheckbox = selected;
    },
    onSort(column: TableHeaderColumn) {
      this.tableHeaderColumns = this.tableHeaderColumns.map((headerColumn) => {
        const isSorted = headerColumn.key === column.key;
        let sortDirection: SortDirection = 'asc';
        if (isSorted) {
          sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';
        }
        return {
          ...headerColumn,
          isSorted,
          sortDirection,
        };
      });
    },
    onOperation(operation: Operation) {
      const selectedIds = this.selectedItems.map((item) => item.$dn$);
      // find selected items but get the original item (from props)
      const selectedPropsItems: GridItemProps[] = this.items.filter((item) => selectedIds.includes(item.$dn$));
      if (!selectedPropsItems.length || !this.on || !this.on[operation]) {
        return;
      }
      // check all selected items are need to have operation in $operations$ property, if not, don't do anything
      if (!selectedPropsItems.every((item) => item.$operations$ && item.$operations$.includes(operation))) {
        return;
      }
      this.on[operation](selectedPropsItems);
    },
  },
});
</script>
