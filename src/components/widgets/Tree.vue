<template>
  <div
    ref="tree"
    class="tree"
    role="grid"
  >
    <TransitionGroup name="list">
      <div
        v-for="node in nodes"
        :id="node.info.id"
        :key="node.info.id"
        role="row"
        :class="['tree-node', { 'tree-node--selected': node.isSelected }]"
        :style="{ paddingLeft: `${node.level * 1.2}em` }"
        @click="onNodeSelect(node)"
        @dblclick="onNodeExpand(node)"
        @contextmenu="onNodeContextMenu(node)"
      >
        <span
          v-if="!isLoading || (isLoading && !node.isSelected)"
          :class="['tree-node-arrow-icon', { 'tree-node-arrow-icon--expanded': node.isExpanded }]"
          role="presentation"
          @click="onNodeExpand(node)"
        >
          <PortalIcon :icon="node.info.$childs$ ? 'chevron-right' : ''" />
        </span>
        <StandbyCircle
          v-if="node.isSelected && isLoading"
          class="tree-node-loading-icon"
          role="presentation"
        />
        <span :class="`tree-node-icon tree-node-icon--${node.info.icon}`" />
        <span>{{ node.info.label }}</span>
      </div>
    </TransitionGroup>
    <Teleport to="body">
      <div
        v-show="isContextMenuOpen"
        ref="contextMenu"
        class="context-menu"
        tabindex="0"
        role="menu"
        @focusout="isContextMenuOpen = false"
      >
        <div
          class="context-menu-item"
          aria-label="Edit"
          aria-disabled="false"
          @click="onPropsMethod('onEdit')"
        >
          <PortalIcon
            icon="edit"
            class="context-menu-item-icon"
          />
          <span>Edit</span>
        </div>
        <div
          class="context-menu-item"
          aria-label="Delete"
          :aria-disabled="isRootNode(contextMenuSelectedNode)"
          @click="onPropsMethod('onRemove')"
        >
          <PortalIcon
            icon="trash"
            class="context-menu-item-icon"
          />
          <span>Delete</span>
        </div>
        <div
          class="context-menu-item"
          aria-label="Move to..."
          :aria-disabled="isRootNode(contextMenuSelectedNode)"
          @click="onPropsMethod('onMove')"
        >
          <div class="context-menu-item-icon" />
          <span>Move to...</span>
        </div>
        <div
          class="context-menu-item"
          aria-label="Refresh"
          aria-disabled="false"
          @click="onPropsMethod('onReload')"
        >
          <PortalIcon
            icon="refresh-cw"
            class="context-menu-item-icon"
          />
          <span>Reload</span>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';
import StandbyCircle from '@/components/StandbyCircle.vue';

interface NodeProps {
  id: string;
  label: string;
  icon: string;
  path: string;
  objectType: string;
  $operations$: string[];
  $flags$: string[];
  $childs$: boolean;
  $isSuperordinate$: boolean;
}

class Node {
  public parent: Node | null = null;

  public children: Node[] = [];

  public info: NodeProps;

  public isSelected = false;

  public isExpanded = false;

  constructor(info: NodeProps, parent: Node | null, children: Node[], isSelected = false, isExpanded = false) {
    this.info = info;
    this.parent = parent;
    this.children = children;
    this.isSelected = isSelected;
    this.isExpanded = isExpanded;
  }

  get level(): number {
    let level = 1;
    const nodePath = this.info.path.split('/');
    // check the root node (all nodes always have at least two elements)
    // but the in the second element of the root node is always empty
    if (nodePath.length > 1) {
      if (nodePath[1] === '') return level;
    }
    level = nodePath.length;
    return level;
  }

  get parentPath(): string | null {
    // if the node is the root node, it has no parent
    if (this.level === 1) return null;
    const nodePath = this.info.path.split('/');
    nodePath.pop();
    const parentPath = `${nodePath.join('/')}`;
    // if this node is the node below the root node, the parent path always has the '/' at the end
    if (this.level === 2) return `${parentPath}/`;
    return parentPath;
  }

  public toggleIsSelected(isSelected?: boolean) {
    this.isSelected = isSelected ?? !this.isSelected;
  }

  public toggleIsExpanded(isExpanded?: boolean) {
    this.isExpanded = isExpanded ?? !this.isExpanded;
  }
}

interface Data {
  nodes: Node[];
  isContextMenuOpen: boolean;
  contextMenuSelectedNode: Node | null;
}

export default defineComponent({
  name: 'Tree',
  components: {
    PortalIcon,
    StandbyCircle,
  },
  props: {
    lists: {
      type: Array as PropType<NodeProps[]>,
      default: () => [],
    },
    onExpand: {
      type: Function as PropType<(node: NodeProps) => void>,
      required: true,
    },
    onCollapse: {
      type: Function as PropType<(node: NodeProps) => void>,
      required: true,
    },
    onEdit: {
      type: Function as PropType<(node: NodeProps) => void>,
      required: true,
    },
    onRemove: {
      type: Function as PropType<(node: NodeProps) => void>,
      required: true,
    },
    onMove: {
      type: Function as PropType<(node: NodeProps) => void>,
      required: true,
    },
    onReload: {
      type: Function as PropType<(node: NodeProps) => void>,
      required: true,
    },
    isLoading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  data(): Data {
    return {
      nodes: [],
      isContextMenuOpen: false,
      contextMenuSelectedNode: null,
    };
  },
  watch: {
    lists: {
      deep: true,
      handler(lists: NodeProps[]) {
        // set new nodes, but keep the old ones with the same id
        this.nodes = lists.map((newNode) => {
          const node = this.nodes.find((n) => n.info.id === newNode.id);
          if (node) {
            return node;
          }
          return new Node(newNode, null, [], false, false);
        });
        this.updateNodes();
      },
    },
    isContextMenuOpen(isOpen: boolean) {
      if (!isOpen) this.contextMenuSelectedNode = null;
    },
  },
  mounted() {
    this.nodes = this.lists.map((propNode) => {
      const node = new Node(propNode, null, []);
      return node;
    });

    this.updateNodes();
    this.setUpContextMenu();
  },
  unmounted() {
    document.removeEventListener('click', this.detectOutsideClickContextMenu);
  },
  methods: {
    onNodeExpand(expandedNode: Node) {
      expandedNode.toggleIsExpanded();
      this.onNodeSelect(expandedNode);
      if (expandedNode.isExpanded) {
        this.onExpand(expandedNode.info);
        return;
      }
      this.onCollapse(expandedNode.info);
    },
    onNodeSelect(selectedNode: Node) {
      this.nodes.forEach((node) => {
        node.toggleIsSelected(false);
      });
      selectedNode.toggleIsSelected(true);
    },
    updateNodes() {
      // find parent and children nodes
      this.nodes = this.nodes.map((node) => {
        const parent = this.nodes.find((n) => n.info.path === node.parentPath);
        if (parent) {
          node.parent = parent;
          parent.children.push(node);
        }
        return node;
      });

      // group nodes by parent id
      const nodesByParentId = this.nodes.reduce((acc, node) => {
        const parentId = node.parent?.info.id ?? null;
        if (!parentId) return acc;
        if (!acc[parentId]) {
          acc[parentId] = [];
        }
        acc[parentId].push(node);
        return acc;
      }, {} as Record<string, Node[]>);

      // move nodes to after their parent, also sort by level
      Object.keys(nodesByParentId).forEach((parentId) => {
        const parentNode = this.nodes.find((n) => n.info.id === parentId);
        if (!parentNode) return;
        const children = nodesByParentId[parentId];
        // sort children by label (alphabetically) descendingly
        children.sort((a, b) => {
          if (a.info.label < b.info.label) return 1;
          if (a.info.label > b.info.label) return -1;
          return 0;
        });
        // move children to after their parent
        children.forEach((child) => {
          const index = this.nodes.indexOf(child);
          if (index === -1) return;
          this.nodes.splice(index, 1);
          this.nodes.splice(this.nodes.indexOf(parentNode) + 1, 0, child);
        });
      });
    },
    findAllChildNodes(node: Node): Node[] {
      // find all children nodes of the node recursively
      const children = node.children;
      if (children.length === 0) return [];
      const childrenNodes = children.reduce((currentNodes, child) => {
        let currentChildNodes = currentNodes;
        currentChildNodes.push(child);
        currentChildNodes = currentChildNodes.concat(this.findAllChildNodes(child));
        return currentChildNodes;
      }, [] as Node[]);
      return childrenNodes;
    },
    setUpContextMenu() {
      // prevent right click in refs.tree
      const treeElement = this.$refs.tree as HTMLDivElement;
      const contextMenuElement = this.$refs.contextMenu as HTMLDivElement;
      document.addEventListener('click', this.detectOutsideClickContextMenu);
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
    onNodeContextMenu(node: Node) {
      this.contextMenuSelectedNode = node;
      this.onNodeSelect(node);
    },
    isRootNode(node: Node | null): boolean {
      return node?.parent === null;
    },
    onPropsMethod(method: 'onEdit' | 'onRemove' | 'onMove' | 'onReload') {
      this.isContextMenuOpen = false;
      if ((method === 'onRemove' || method === 'onMove') && this.isRootNode(this.contextMenuSelectedNode)) return;
      const node = this.contextMenuSelectedNode;
      if (!node) return;
      this[method](node.info);
    },
  },
});
</script>

<style lang="stylus">
.tree
  background-color: var(--bgc-content-container)
  border-radius: var(--border-radius-container)
  height: auto
  max-height: 30em
  overflow-y: auto
  display: flex
  flex-direction: column
  position: relative

.tree-node
  display: flex
  align-items: center
  border: none
  padding: var(--layout-spacing-unit) 0
  text-overflow: ellipsis
  white-space: nowrap
  transition: background-color 0.2s ease-in-out
  cursor: pointer

  &:hover
    background-color: var(--bgc-tree-row-hover)

  &--selected
    background-color: var(--bgc-tree-row-selected)
    &:hover
      background-color: var(--bgc-tree-row-selected)

  &-icon
    width: 16px
    height: 16px
    margin-right: 5px
    &--udm-settings-cn
      background-image: url(/data/icons/udm-settings-cn.png) !important
    &--udm-container-dc
      background-image: url(/data/icons/udm-container-dc.png) !important
    &--udm-container-ou
      background-image: url(/data/icons/udm-container-ou.png) !important
    &--udm-container-cn
      background-image: url(/data/icons/udm-container-cn.png) !important

  &-arrow-icon
    display: flex
    align-items: center
    padding: 0 var(--layout-spacing-unit)
    transition: transform 0.2s ease-in-out

    &--expanded
      transform: rotate(90deg)

  &-loading-icon
    width: 16px
    height: 16px
    padding: 0 var(--layout-spacing-unit)

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

.list-enter-active,
.list-leave-active
  transition: all 0.5s ease

.list-enter-from,
.list-leave-to
  opacity: 0

</style>
