<template>
  <div
    v-for="item in items"
    :key="item.name"
    class="grid-table-body-row"
    @contextmenu="onContextMenuSelect(item)"
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
      <ItemIcon />
      {{ item.name }}
    </div>
    <div
      class="grid-table-body-row-value"
      @click="onItemSelected(item)"
    >
      {{ item.path }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { GridItem } from '../types';
import GridCheckbox from './GridCheckbox.vue';
import ItemIcon from './ItemIcon.vue';

export default defineComponent({
  name: 'GridTableBody',
  components: {
    GridCheckbox,
    ItemIcon,
  },
  props: {
    items: {
      type: Array as PropType<GridItem[]>,
      required: true,
    },
    onItemSelected: {
      type: Function as PropType<(item: GridItem, deselectAll?: boolean) => void>,
      required: true,
    },
  },
  methods: {
    onContextMenuSelect(item: GridItem) {
      // if the item is already selected, we dont want to deselect it
      if (item.selected) return;
      // otherwise select the item
      this.onItemSelected(item);
    },
  },
});
</script>
