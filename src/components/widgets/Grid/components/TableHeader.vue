<template>
  <div class="grid-table-header-checkbox">
    <GridCheckbox
      :checked="tableHeaderCheckbox"
      :is-header="true"
      @update:checked="$emit('update:tableHeaderCheckbox', $event)"
    />
  </div>
  <div
    v-for="(column, index) in columns"
    :key="index"
    class="grid-table-header-value"
    @click="$emit('onSort', column)"
  >
    <Transition>
      <PortalIcon
        v-if="column.isSorted"
        :class="['grid-table-header-sort-icon', {
          'grid-table-header-sort-icon-asc': column.sortDirection === 'asc',
          'grid-table-header-sort-icon-desc': column.sortDirection === 'desc',
        }]"
        icon="chevron-down"
      />
    </Transition>
    <span>{{ column.label }}</span>
  </div>
</template>

<script lang='ts'>
import PortalIcon from '@/components/globals/PortalIcon.vue';
import { defineComponent, PropType } from 'vue';
import { HeaderCheckboxState, TableHeaderColumn } from '../types';
import GridCheckbox from './GridCheckbox.vue';

export default defineComponent({
  name: 'GridTableHeader',
  components: {
    GridCheckbox,
    PortalIcon,
  },
  props: {
    columns: {
      type: Array as PropType<TableHeaderColumn[]>,
      default: () => [],
    },
    tableHeaderCheckbox: {
      type: [Boolean, String] as PropType<HeaderCheckboxState>,
      required: true,
    },
  },
  emits: ['update:tableHeaderCheckbox', 'onSort'],
});
</script>
