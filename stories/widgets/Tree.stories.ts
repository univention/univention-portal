import { ref } from 'vue';
import MyForm from '../../src/components/forms/Form.vue';

export default {
  title: 'Widgets/Tree',
  component: MyForm,
};

const tree = [
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
    id: 'cn=dns,dc=demo,dc=univention,dc=de',
    label: 'dns',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/dns',
    objectType: 'container/cn',
    $operations$: ['add', 'edit', 'remove', 'search', 'move', 'subtree_move'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: false,
  },
  {
    id: 'cn=dhcp,dc=demo,dc=univention,dc=de',
    label: 'dhcp',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/dhcp',
    objectType: 'container/cn',
    $operations$: ['add', 'edit', 'remove', 'search', 'move', 'subtree_move'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: false,
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
    id: 'cn=samba,dc=demo,dc=univention,dc=de',
    label: 'samba',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/samba',
    objectType: 'container/cn',
    $operations$: ['add', 'edit', 'remove', 'search', 'move', 'subtree_move'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: false,
  },
  {
    id: 'cn=users,dc=demo,dc=univention,dc=de',
    label: 'users',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/users',
    objectType: 'container/cn',
    $operations$: ['add', 'edit', 'remove', 'search', 'move', 'subtree_move'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: false,
  },
  {
    id: 'cn=groups,dc=demo,dc=univention,dc=de',
    label: 'groups',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/groups',
    objectType: 'container/cn',
    $operations$: ['add', 'edit', 'remove', 'search', 'move', 'subtree_move'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: false,
  },
  {
    id: 'cn=nagios,dc=demo,dc=univention,dc=de',
    label: 'nagios',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/nagios',
    objectType: 'container/cn',
    $operations$: ['add', 'edit', 'remove', 'search', 'move', 'subtree_move'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: false,
  },
  {
    id: 'cn=shares,dc=demo,dc=univention,dc=de',
    label: 'shares',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/shares',
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
    id: 'cn=networks,dc=demo,dc=univention,dc=de',
    label: 'networks',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/networks',
    objectType: 'container/cn',
    $operations$: ['add', 'edit', 'remove', 'search', 'move', 'subtree_move'],
    $flags$: [],
    $childs$: true,
    $isSuperordinate$: false,
  },
  {
    id: 'cn=policies,dc=demo,dc=univention,dc=de',
    label: 'policies',
    icon: 'udm-container-cn',
    path: 'demo.univention.de:/policies',
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

const computerNodes = [{
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

const mailNodes = [{
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

const Template = (args) => ({
  components: { MyForm },
  setup() {
    const widgets = ref(args.widgets);

    // mock fetch data from server
    async function fetchNodeChildren(nodeId) {
      const randomTimeResponse = Math.floor(Math.random() * 1000) + 500;
      return new Promise((resolve) => {
        setTimeout(() => {
          if (nodeId === 'cn=computers,dc=demo,dc=univention,dc=de') {
            resolve(computerNodes);
          } else if (nodeId === 'cn=mail,dc=demo,dc=univention,dc=de') {
            resolve(mailNodes);
          } else if (nodeId === 'dc=demo,dc=univention,dc=de') {
            resolve(tree);
          } else {
            resolve([]);
          }
        }, randomTimeResponse);
      });
    }

    async function onExpand(nodeId) {
      widgets.value[0].isLoading = true;
      const children = await fetchNodeChildren(nodeId);
      widgets.value[0].lists = [...widgets.value[0].lists, ...children];
      widgets.value[0].isLoading = false;
    }

    async function onCollapse(nodeId, childrenIds) {
      // remove children from tree
      widgets.value[0].lists = widgets.value[0].lists.filter((node) => !childrenIds.includes(node.id));
    }
    widgets.value[0].onExpand = onExpand;
    widgets.value[0].onCollapse = onCollapse;
    return { args, widgets };
  },
  template: '<my-form v-model="args.modelValue" :widgets="widgets"></my-form>',
});

export const Default: any = Template.bind({});
Default.args = {
  modelValue: { tree: '' },
  widgets: [
    {
      type: 'Tree',
      name: 'tree',
      label: 'Tree',
      lists: [
        {
          id: 'dc=demo,dc=univention,dc=de',
          label: 'demo.univention.de:/',
          icon: 'udm-container-dc',
          path: 'demo.univention.de:/',
          objectType: 'container/dc',
          $operations$: ['search', 'edit'],
          $flags$: [],
          $childs$: true,
          $isSuperordinate$: false,
        },
      ],
      isLoading: false,
      onExpand: () => ({}),
      onCollapse: () => ({}),
    },
  ],
};
