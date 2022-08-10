<template>
  <div class="grid-header">
    <div class="grid-header-button">
      <TransitionGroup>
        <button
          v-for="button in buttons"
          :key="button.label"
          :class="`grid-header-button--${button.label.toLowerCase()}`"
        >
          <PortalIcon :icon="button.icon" />
          <span>{{ button.label }}</span>
        </button>
      </TransitionGroup>
    </div>
    <div class="grid-header-status">
      <span class="grid-header-status--text">
        0 groups of 19 selected
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';

export default defineComponent({
  name: 'GridHeader',
  components: {
    PortalIcon,
  },
  props: {
    isAnyItemSelected: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  computed: {
    buttons() {
      if (!this.isAnyItemSelected) {
        return [
          { label: 'Add', icon: 'plus' },
        ];
      }

      return [
        { label: 'Add', icon: 'plus' },
        { label: 'Edit', icon: 'edit-2' },
        { label: 'Delete', icon: 'trash' },
        { label: 'More', icon: 'more-horizontal' },
      ];
    },
  },
});
</script>

<style lang="stylus">
.grid-header
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--layout-spacing-unit)

  &-button
    display: flex;
    align-items: center;

    & button
      background-color: var(--button-text-bgc)
      padding: 0 var(--layout-spacing-unit)
      &:hover
        background-color: var(--button-text-bgc-hover)

  &-status
    &--text
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
</style>
