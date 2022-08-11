<template>
  <div class="grid">
    <Header :is-any-item-selected="isAnyItemSelected" />
    <Table
      :table-header-checkbox="tableHeaderCheckbox"
      :column-label="columnInfo.label"
      :items="gridItems"
      :on-item-selected="onItemSelected"
      @update:table-header-checkbox="onTableHeaderCheckboxUpdate"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Header from './Header.vue';
import Table from './Table.vue';
import { GridItem, GridItemProps, HeaderCheckboxState } from './types';

interface Data {
  tableHeaderCheckbox: HeaderCheckboxState;
  gridItems: GridItem[];
}

export default defineComponent({
  name: 'Grid',
  components: {
    Header,
    Table,
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
    };
  },
  computed: {
    isAnyItemSelected(): boolean {
      return this.gridItems.some((item) => item.selected);
    },
    isAllItemsSelected(): boolean {
      return this.gridItems.every((item) => item.selected);
    },
  },
  watch: {
    tableHeaderCheckbox(state: HeaderCheckboxState) {
      console.log(state);
      if (typeof state === 'boolean') {
        this.gridItems.forEach((item) => {
          item.selected = state;
        });
      }
    },
    isAnyItemSelected(value: boolean) {
      if (!value) {
        this.tableHeaderCheckbox = false;
      } else if (!this.isAllItemsSelected) {
        this.tableHeaderCheckbox = 'mixed';
      }
    },
  },
  mounted() {
    this.gridItems = this.items.map((item) => ({
      ...item,
      selected: false,
    }));
  },
  methods: {
    onItemSelected(item: GridItem) {
      item.selected = !item.selected;
    },
    onTableHeaderCheckboxUpdate(selected: HeaderCheckboxState) {
      this.tableHeaderCheckbox = selected;
    },
  },
});
</script>
