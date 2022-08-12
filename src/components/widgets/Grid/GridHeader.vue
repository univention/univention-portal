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
        {{ numberItemsSelectedText }} of {{ numberItems }} selected
      </span>
    </div>
    <ContextMenu
      :is-open="isContextMenuOpen"
      :context-menu-options="contextMenuOptions"
      :position="contextMenuPosition"
      parent-element="grid-header-button--more"
      :disable-right-click="true"
      @on-outside-click="onContextMenuOutsideClick"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';
import { ContextMenuOption, Operation } from './types';
import { ContextMenu } from './components';

type OptionButtonOperation = Operation | 'more';
interface OptionButton extends Omit<ContextMenuOption, 'operation'> {
  operation: OptionButtonOperation;
}

export default defineComponent({
  name: 'GridHeader',
  components: {
    PortalIcon,
    ContextMenu,
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
    numberItems: {
      type: Number as PropType<number>,
      required: true,
    },
    itemType: {
      type: String as PropType<string>,
      default: 'row',
    },
  },
  emits: ['onOperation', 'onOpenContextMenu', 'onOutsideClick'],
  data() {
    return {
      isContextMenuOpen: false,
      contextMenuOptions: [
        { label: 'Edit in new tab', icon: '', operation: 'edit' },
        { label: 'Move to...', icon: '', operation: 'move' },
        { label: 'Copy', icon: '', operation: 'copy' },
        { label: 'Create report', icon: 'file-text', operation: 'search' },
      ],
      contextMenuPosition: {
        x: 0, y: 0,
      },
    };
  },
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
      if (this.numberItemsSelected === 1) return `One ${this.itemType}`;
      return `${this.numberItemsSelected} ${this.itemType}s`;
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
      this.onOpenContextMenu({ x, y });
    },
    onOpenContextMenu(position: {x: number, y: number}) {
      this.contextMenuPosition = position;
      this.isContextMenuOpen = true;
    },
    onContextMenuOutsideClick(event: MouseEvent) {
      const moreButton = document.querySelector('.grid-header-button--more') as HTMLButtonElement;
      const target = event.target as HTMLElement;
      if (!moreButton.contains(target)) {
        this.isContextMenuOpen = false;
        return;
      }
      if (!this.isContextMenuOpen) {
        this.onMoreButtonClick();
      } else {
        console.log('trigger onOutsideClick');
      }
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
