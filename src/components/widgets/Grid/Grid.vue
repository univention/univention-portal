<template>
  <div class="grid">
    <Header :is-any-item-selected="isAnyItemSelected" />
    <Table
      :is-all-items-selected="isAllItemsSelected"
      :column-label="columnInfo.label"
      :items="gridItems"
      :on-item-selected="onItemSelected"
      @update:is-all-items-selected="(selected: boolean) => isAllItemsSelected = selected"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Header from './Header.vue';
import Table from './Table.vue';
import { GridItem, GridItemProps } from './types';

interface Data {
  isAllItemsSelected: boolean;
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
      isAllItemsSelected: false,
      gridItems: [],
    };
  },
  computed: {
    isAnyItemSelected() {
      return this.gridItems.some((item) => item.selected);
    },
  },
  watch: {
    isAllItemsSelected(selected: boolean) {
      this.gridItems.forEach((item) => {
        item.selected = selected;
      });
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
      // this.isAllItemsSelected = this.gridItems.every((item) => item.selected);
    },
  },
});
</script>
