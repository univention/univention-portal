<template>
  <div class="grid-table-header-checkbox">
    <GridCheckbox
      :checked="tableHeaderCheckbox"
      :is-header="true"
      @update:checked="$emit('update:tableHeaderCheckbox', $event)"
    />
  </div>
  <div
    class="grid-table-header-name"
    @click="$emit('sortColumn', 'name')"
  >
    <Transition>
      <PortalIcon
        v-if="sortedColumnInfo.column === 'name'"
        :class="['grid-table-header-sort-icon', {
          'grid-table-header-sort-icon-asc': sortedColumnInfo.direction === 'asc',
          'grid-table-header-sort-icon-desc': sortedColumnInfo.direction === 'desc',
        }]"
        icon="chevron-down"
      />
    </Transition>
    <span>Name</span>
  </div>
  <div
    class="grid-table-header-value"
    @click="$emit('sortColumn', 'value')"
  >
    <Transition>
      <PortalIcon
        v-if="sortedColumnInfo.column === 'value'"
        :class="['grid-table-header-sort-icon', {
          'grid-table-header-sort-icon-asc': sortedColumnInfo.direction === 'asc',
          'grid-table-header-sort-icon-desc': sortedColumnInfo.direction === 'desc',
        }]"
        icon="chevron-down"
      />
    </Transition>
    <span>{{ columnLabel }}</span>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';
import { SortedColumnInfo } from '../types';
import GridCheckbox from './GridCheckbox.vue';

export default defineComponent({
  name: 'GridTableHeader',
  components: {
    GridCheckbox,
    PortalIcon,
  },
  props: {
    tableHeaderCheckbox: {
      type: Boolean,
      required: true,
    },
    sortedColumnInfo: {
      type: Object as PropType<SortedColumnInfo>,
      required: true,
    },
    columnLabel: {
      type: String,
      required: true,
    },
  },
  emits: ['update:tableHeaderCheckbox', 'sortColumn'],
});
</script>
