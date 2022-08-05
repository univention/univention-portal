import { Meta, StoryFn } from '@storybook/vue3';

import { reactive } from 'vue';
import Tree from '../../src/components/widgets/Tree.vue';

export default {
  title: 'Widgets/Tree',
  component: Tree,
} as Meta<typeof Tree>;

interface Node {
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

const rootNode: Node = {
  id: 'dc=demo,dc=univention,dc=de',
  label: 'demo.univention.de:/',
  icon: 'udm-container-dc',
  path: 'demo.univention.de:/',
  objectType: 'container/dc',
  $operations$: ['search', 'edit'],
  $flags$: [],
  $childs$: true,
  $isSuperordinate$: false,
};

const treeNodes: Node[] = [
  {
    id: 'cn=univention,dc=demo,dc=univention,dc=de',
    label: 'univention',
    icon: 'udm-settings-cn',
    path: 'demo.univention.de:/univention',
    objectType: 'settings/cn',
    $operations$: ['search'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: true,
  },
  {
    id: 'cn=mail,dc=demo,dc=univention,dc=de',
    label: 'mail',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/mail',
    objectType: 'container/cn',
    $operations$: ['add', 'edit', 'remove', 'search', 'move', 'subtree_move'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: false,
  },
  {
    id: 'cn=kerberos,dc=demo,dc=univention,dc=de',
    label: 'kerberos',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/kerberos',
    objectType: 'container/cn',
    $operations$: ['add', 'edit', 'remove', 'search', 'move', 'subtree_move'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: false,
  },
  {
    id: 'cn=computers,dc=demo,dc=univention,dc=de',
    label: 'computers',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/computers',
    objectType: 'container/cn',
    $operations$: ['add', 'edit', 'remove', 'search', 'move', 'subtree_move'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: false,
  },
  {
    id: 'cn=printers,dc=demo,dc=univention,dc=de',
    label: 'printers',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/printers',
    objectType: 'container/cn',
    $operations$: ['add', 'edit', 'remove', 'search', 'move', 'subtree_move'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: false,
  },
];

const computerNodes: Node[] = [{
  id: 'cn=dc,cn=computers,dc=demo,dc=univention,dc=de',
  label: 'dc',
  icon: 'udm-container-cn',
  path: 'demo.univention.de:/computers/dc',
  objectType: 'container/cn',
  $operations$: [
    'add',
    'edit',
    'remove',
    'search',
    'move',
    'subtree_move',
  ],
  $flags$: [],
  $childs$: true,
  $isSuperordinate$: false,
},
{
  id: 'cn=memberserver,cn=computers,dc=demo,dc=univention,dc=de',
  label: 'memberserver',
  icon: 'udm-container-cn',
  path: 'demo.univention.de:/computers/memberserver',
  objectType: 'container/cn',
  $operations$: [
    'add',
    'edit',
    'remove',
    'search',
    'move',
    'subtree_move',
  ],
  $flags$: [],
  $childs$: true,
  $isSuperordinate$: false,
}];

const mailNodes: Node[] = [{
  id: 'cn=domain,cn=mail,dc=demo,dc=univention,dc=de',
  label: 'domain',
  icon: 'udm-container-cn',
  path: 'demo.univention.de:/mail/domain',
  objectType: 'container/cn',
  $operations$: [
    'add',
    'edit',
    'remove',
    'search',
    'move',
    'subtree_move',
  ],
  $flags$: [],
  $childs$: true,
  $isSuperordinate$: false,
},
{
  id: 'cn=folder,cn=mail,dc=demo,dc=univention,dc=de',
  label: 'folder',
  icon: 'udm-container-cn',
  path: 'demo.univention.de:/mail/folder',
  objectType: 'container/cn',
  $operations$: [
    'add',
    'edit',
    'remove',
    'search',
    'move',
    'subtree_move',
  ],
  $flags$: [],
  $childs$: true,
  $isSuperordinate$: false,
},
{
  id: 'cn=mailinglists,cn=mail,dc=demo,dc=univention,dc=de',
  label: 'mailinglists',
  icon: 'udm-container-cn',
  path: 'demo.univention.de:/mail/mailinglists',
  objectType: 'container/cn',
  $operations$: [
    'add',
    'edit',
    'remove',
    'search',
    'move',
    'subtree_move',
  ],
  $flags$: [],
  $childs$: true,
  $isSuperordinate$: false,
}];

const Template: StoryFn<typeof Tree> = (args) => ({
  components: { Tree },
  setup() {
    const data = reactive(args);

    // mock fetch data from server
    async function fetchNodeChildren(node: Node): Promise<Node[]> {
      const randomTimeResponse = Math.floor(Math.random() * 1000) + 500;
      return new Promise((resolve) => {
        setTimeout(() => {
          if (node.id === 'cn=computers,dc=demo,dc=univention,dc=de') {
            resolve(computerNodes);
          } else if (node.id === 'cn=mail,dc=demo,dc=univention,dc=de') {
            resolve(mailNodes);
          } else if (node.id === 'dc=demo,dc=univention,dc=de') {
            resolve(treeNodes);
          } else {
            resolve([]);
          }
        }, randomTimeResponse);
      });
    }

    async function onExpand(expandedNode: Node) {
      data.isLoading = true;
      const children = await fetchNodeChildren(expandedNode);
      data.lists = [...data.lists, ...children];
      if (children.length === 0) {
        expandedNode.$childs$ = false;
      }
      data.isLoading = false;
    }

    async function onCollapse(collapsedNode: Node) {
      // remove children from tree
      data.lists = data.lists.filter((node: Node) => {
        if (node.id === collapsedNode.id || !node.id.includes(collapsedNode.id)) return true;
        return false;
      });
    }

    async function onRemove(deletedNode: Node) {
      // remove node & children of deleted node from tree
      data.lists = data.lists.filter((node: Node) => !node.id.includes(deletedNode.id));
    }

    async function onReload(refreshedNode: Node) {
      await onCollapse(refreshedNode);
      await onExpand(refreshedNode);
    }

    data.onExpand = onExpand;
    data.onCollapse = onCollapse;
    data.onRemove = onRemove;
    data.onReload = onReload;
    return { data };
  },
  template: '<div><tree v-bind="data"></tree></div>',
});

export const Default = Template.bind({});
Default.args = {
  name: 'tree',
  lists: [rootNode],
  isLoading: false,
  onExpand: (node: Node) => {
    console.log('onExpand', node);
  },
  onCollapse: (node: Node) => {
    console.log('onCollapse', node);
  },
  onEdit: (node: Node) => {
    console.log('onEdit', node);
  },
  onRemove: (node: Node) => {
    console.log('onRemove', node);
  },
  onMove: (node: Node) => {
    console.log('onMove', node);
  },
  onSearch: (node: Node) => {
    console.log('onSearch', node);
  },
  onAdd: (node: Node) => {
    console.log('onAdd', node);
  },
  onSubtreeMove: (node: Node) => {
    console.log('onSubtreeMove', node);
  },
  onReload: (node: Node) => {
    console.log('onReload', node);
  },
};
