<template>
  <div class="grid">
    <GridHeader
      :is-any-item-selected="isAnyItemSelected"
      :number-items-selected="selectedItems.length"
    />
    <GridTable>
      <template #header>
        <TableHeader
          :table-header-checkbox="tableHeaderCheckbox"
          :column-label="columnInfo.label"
          :sorted-column-info="sortedColumnInfo"
          @update:table-header-checkbox="onTableHeaderCheckboxUpdate"
          @sort-column="onSort"
        />
      </template>
      <template #body>
        <TableBody
          :items="gridItems"
          :on-item-selected="onItemSelected"
        />
      </template>
    </GridTable>
    <ContextMenu />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import GridHeader from './GridHeader.vue';
import GridTable from './GridTable.vue';
import { GridItem, GridItemProps, HeaderCheckboxState, SortedColumnInfo } from './types';
import { ContextMenu, TableHeader, TableBody } from './components';

interface Data {
  tableHeaderCheckbox: HeaderCheckboxState;
  gridItems: GridItem[];
  sortedColumnInfo: SortedColumnInfo;
}

export default defineComponent({
  name: 'Grid',
  components: {
    GridHeader,
    GridTable,
    TableHeader,
    TableBody,
    ContextMenu,
  },
  props: {
    items: {
      type: Array as PropType<GridItemProps[]>,
      default: () => [],
    },
    columnInfo: {
      type: Object as PropType<{label: string; key: string}>,
      default: () => ({ label: '', key: '' }),
    },
  },
  data(): Data {
    return {
      tableHeaderCheckbox: false,
      gridItems: [],
      sortedColumnInfo: {
        column: null,
        direction: 'asc',
      },
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
    sortedColumnInfo(info: SortedColumnInfo) {
      let gridItems = this.gridItems.sort((a, b) => {
        if (info.column === 'name') {
          return a.name.localeCompare(b.name);
        } if (info.column === 'value') {
          return a.path.localeCompare(b.path);
        }
        return 0;
      });
      if (info.direction === 'desc') {
        gridItems = this.gridItems.reverse();
      }
      this.gridItems = gridItems;
    },
  },
  mounted() {
    this.gridItems = this.items.map((item) => ({
      ...item,
      selected: false,
    }));
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
    onTableHeaderCheckboxUpdate(selected: HeaderCheckboxState) {
      this.tableHeaderCheckbox = selected;
    },
    onSort(column: 'name' | 'value') {
      this.sortedColumnInfo = {
        column,
        direction: this.sortedColumnInfo.direction === 'asc' ? 'desc' : 'asc',
      };
    },
  },
});
</script>
