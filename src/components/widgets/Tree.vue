<template>
  <div class="tree">
    <div
        :class="['tree-node', `tree-node--level-${getNodeLevel(root)}`, { 'tree-node--selected': root.isSelected }]"
        @click="onNodeSelect(root)"
        @dblclick="onNodeExpand(root)"
    >
      <span
          :class="['tree-node-arrow-icon', { 'tree-node-arrow-icon--expanded': root.isExpanded }]"
          @click="onNodeExpand(root)"
      >
        <PortalIcon
            icon="chevron-right"
        />
      </span>
      <span :class="`tree-node-icon tree-node-icon--${root.icon}`" />
      <span>{{ root.label }}</span>
    </div>
    <div
        v-for="(node, index) in nodes"
        :key="index"
        :class="['tree-node', `tree-node--level-${getNodeLevel(node)}`, { 'tree-node--selected': node.isSelected }]"
        :style="{'--level': getNodeLevel(node)}"
        @click="onNodeSelect(node)"
        @dblclick="onNodeExpand(node)"
    >
      <span
          :class="['tree-node-arrow-icon', { 'tree-node-arrow-icon--expanded': node.isExpanded }]"
          @click="onNodeExpand(node)"
      >
        <PortalIcon
            icon="chevron-right"
        />
      </span>
      <span :class="`tree-node-icon tree-node-icon--${node.icon}`" />
      <span>{{ node.label }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';

interface ListNode {
  id: string;
  label: string;
  icon: string;
  path: string;
  objectType: string;
  $operation$: string[];
  $flag$: string[];
  $childs$: boolean;
  $isSuperordinate$: boolean;
}

interface TreeNode extends ListNode {
  isExpanded: boolean;
  isSelected: boolean;
  children?: TreeNode[];
}

interface Data {
  root: TreeNode;
  nodes: TreeNode[];
}

export default defineComponent({
  name: 'Tree',
  components: {
    PortalIcon,
  },
  props: {
    rootNode: {
      type: Object as PropType<ListNode>,
      required: true,
    },
    lists: {
      type: Array as PropType<ListNode[]>,
      default: () => [],
    },
    onExpand: {
      type: Function as PropType<(id: string) => void>,
      default: () => () => { },
    },
    onCollapse: {
      type: Function as PropType<(id: string) => void>,
      default: () => () => { },
    },
    onAdd: {
      type: Function as PropType<(id: string) => void>,
      default: () => () => { },
    },
    onEdit: {
      type: Function as PropType<(id: string) => void>,
      default: () => () => { },
    },
    onRemove: {
      type: Function as PropType<(id: string) => void>,
      default: () => () => { },
    },
    onSearch: {
      type: Function as PropType<(id: string) => void>,
      default: () => () => { },
    },
    onMove: {
      type: Function as PropType<(id: string, parentId: string) => void>,
      default: () => () => { },
    },
    onSubtreeMove: {
      type: Function as PropType<(id: string, parentId: string) => void>,
      default: () => () => { },
    },
  },
  data(): Data {
    return {
      root: {
        ...this.rootNode,
        isExpanded: true,
        isSelected: false,
      },
      nodes: [],
    };
  },
  mounted() {
    this.nodes = this.lists.map((node) => ({
      ...node,
      isExpanded: false,
      isSelected: false,
    }));
    this.nodes.sort((a, b) => a.label.localeCompare(b.label));
  },
  methods: {
    onNodeExpand(expandedNode: TreeNode) {
      if (this.isRootNode(expandedNode)) {
        this.root.isExpanded = !this.root.isExpanded;
        this.onNodeSelect(expandedNode);
        return;
      }
      this.nodes = this.nodes.map((node) => {
        if (node.id === expandedNode.id) {
          node.isExpanded = !node.isExpanded;
        }
        return node;
      });
      this.onNodeSelect(expandedNode);
    },
    onNodeSelect(selectedNode: TreeNode) {
      if (this.isRootNode(selectedNode)) {
        this.root.isSelected = true;
        return;
      }
      this.nodes = this.nodes.map((node) => ({
        ...node,
        isSelected: selectedNode.id === node.id,
      }));
    },
    getNodeLevel(node: TreeNode): number {
      return node.path.split('/').length - 1;
    },
    isRootNode(node: TreeNode): boolean {
      return node.id === this.rootNode.id;
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

.tree-node
  display: flex
  align-items: center
  border: none
  padding: var(--layout-spacing-unit) 0
  text-overflow: ellipsis
  white-space: nowrap
  transition: background-color 0.2s ease-in-out
  margin-left: calc(var(--level) * 1.2em);

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

</style>
