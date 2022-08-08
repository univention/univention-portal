<template>
  <Teleport to="body">
    <div
      v-show="isContextMenuOpen"
      ref="contextMenu"
      class="context-menu"
      role="menu"
    >
      <div
        v-for="(contextMenuOption, index) in contextMenuOptions"
        :key="index"
        class="context-menu-item"
        role="menuitem"
        :aria-label="contextMenuOption.label"
        :aria-disabled="isOptionDisabled(contextMenuOption)"
        @click="onContextMenuOptionClick(contextMenuOption)"
      >
        <PortalIcon
          :icon="contextMenuOption.icon"
          class="context-menu-item-icon"
          role="presentation"
        />
        <span role="presentation">
          {{ contextMenuOption.label }}
        </span>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';
import type { ContextMenuOperation } from './types';
import Node from './node';

interface ContextMenuOption {
  label: string;
  icon: string;
  operation: ContextMenuOperation;
}

interface Data {
  isContextMenuOpen: boolean;
  contextMenuOptions: ContextMenuOption[];
}

export default defineComponent({
  components: {
    PortalIcon,
  },
  props: {
    selectedNode: {
      type: Object as PropType<Node | null>,
      default: null,
    },
  },
  emits: ['onContextMenuOption'],
  data(): Data {
    return {
      isContextMenuOpen: false,
      contextMenuOptions: [
        { icon: 'edit', label: 'Edit', operation: 'edit' },
        { icon: 'trash', label: 'Delete', operation: 'remove' },
        { icon: '', label: 'Move to...', operation: 'move' },
        { icon: 'refresh-cw', label: 'Reload', operation: 'reload' },
      ],
    };
  },
  mounted() {
    this.setUpContextMenu();
    document.addEventListener('click', this.detectOutsideClickContextMenu);
  },
  unmounted() {
    document.removeEventListener('click', this.detectOutsideClickContextMenu);
  },
  methods: {
    setUpContextMenu() {
      const tree = this.$parent;
      if (!tree) return;
      // prevent right click in refs.tree
      const treeElement = tree.$el as HTMLDivElement;
      const contextMenuElement = this.$refs.contextMenu as HTMLDivElement;
      treeElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.isContextMenuOpen = true;
        // set position of context menu
        contextMenuElement.style.left = `${e.pageX}px`;
        contextMenuElement.style.top = `${e.pageY}px`;
      });
    },
    detectOutsideClickContextMenu(event: MouseEvent) {
      const contextMenuElement = this.$refs.contextMenu as HTMLDivElement;
      if (
        !contextMenuElement.contains(event.target as HTMLElement) &&
        this.isContextMenuOpen
      ) {
        this.isContextMenuOpen = false;
      }
    },
    isOptionDisabled(contextMenuOption: ContextMenuOption): boolean {
      const selectedNode = this.selectedNode;
      if (!selectedNode) return true;
      // always allow reload option
      if (contextMenuOption.operation === 'reload') return false;

      const availableOperations = selectedNode.data.$operations$;
      // disable the option if the operation of the selected node doesn't have the operation of the context menu option
      if (!availableOperations.includes(contextMenuOption.operation)) return true;
      return false;
    },
    onContextMenuOptionClick(contextMenuOption: ContextMenuOption) {
      const selectedNode = this.selectedNode;
      if (!selectedNode) return;
      if (this.isOptionDisabled(contextMenuOption)) return;
      this.isContextMenuOpen = false;
      const operationMethod = this.getOperationMethod(contextMenuOption.operation);
      if (contextMenuOption.operation === 'reload') {
        this.$emit('onContextMenuOption', operationMethod);
        return;
      }
      this.$emit('onContextMenuOption', operationMethod);
    },
    getOperationMethod(operation: ContextMenuOperation): string {
      // this method is used to get the method name of the operation
      // example: 'edit' -> 'onEdit'
      let method: string = operation;
      // uppercase first letter of operation
      method = method.charAt(0).toUpperCase() + method.slice(1);
      // add 'on' prefix
      method = `on${method}`;
      return method;
    },
  },
});
</script>

<style lang="stylus">
.context-menu
  position: absolute
  z-index: 10
  background-color: var(--bgc-popup)
  border-radius: var(--border-radius-container)
  &-item
    display: flex
    align-items: center
    padding: 0.3rem 1.2rem
    cursor: pointer
    transition: background-color 0.15s
    &:hover
      background-color: var(--bgc-popup-item-hover)

    &-icon
      height: var(--button-icon-size)
      width: var(--button-icon-size)
      padding-left: 0.1rem
      padding-right: 0.5rem

    &[aria-disabled="true"]
      cursor: not-allowed
      opacity: 0.5
      &:hover
        background-color: var(--bgc-popup-item-disabled)

</style>
