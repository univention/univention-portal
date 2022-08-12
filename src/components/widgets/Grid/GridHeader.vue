<template>
  <div class="grid-header">
    <div class="grid-header-button">
      <TransitionGroup>
        <button
          v-for="(button, index) in optionButtons"
          :key="index"
          :class="`grid-header-button--${button.label.toLowerCase()}`"
          @click="onOperation(button.operation)"
        >
          <PortalIcon :icon="button.icon" />
          <span>{{ button.label }}</span>
        </button>
      </TransitionGroup>
    </div>
    <div class="grid-header-status">
      <span class="grid-header-status--text">
        {{ numberItemsSelectedText }} groups of 19 selected
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';
import { ContextMenuOption, Operation } from './types';

type OptionButtonOperation = Operation | 'more';
interface OptionButton extends Omit<ContextMenuOption, 'operation'> {
  operation: OptionButtonOperation;
}

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
    numberItemsSelected: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  emits: ['onOperation', 'onOpenContextMenu', 'onOutsideClick'],
  computed: {
    optionButtons(): OptionButton[] {
      if (!this.isAnyItemSelected) {
        return [
          { label: 'Add', icon: 'plus', operation: 'add' },
        ];
      }

      return [
        { label: 'Add', icon: 'plus', operation: 'add' },
        { label: 'Edit', icon: 'edit-2', operation: 'edit' },
        { label: 'Delete', icon: 'trash', operation: 'remove' },
        { label: 'More', icon: 'more-horizontal', operation: 'more' },
      ];
    },

    numberItemsSelectedText(): string | number {
      if (this.numberItemsSelected === 1) return 'One';
      return this.numberItemsSelected;
    },
  },
  methods: {
    onOperation(operation: OptionButtonOperation) {
      if (operation === 'more') {
        this.onMoreButtonClick();
        return;
      }
      this.$emit('onOperation', operation);
    },
    onMoreButtonClick() {
      // get more button position
      const moreButton = document.querySelector('.grid-header-button--more') as HTMLButtonElement;
      const rect = moreButton.getBoundingClientRect();
      const x = rect.left;
      const y = rect.top + rect.height;
      this.$emit('onOpenContextMenu', { x, y });
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
