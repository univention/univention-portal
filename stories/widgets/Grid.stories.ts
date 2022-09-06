import { Meta, StoryFn } from '@storybook/vue3';

import Grid from '@/components/widgets/Grid/Grid.vue';
import { GridItemProps } from '../../src/components/widgets/Grid/types';

const ITEMS: GridItemProps[] = [
  {
    $dn$: 'cn=Domain Admins,cn=groups,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'Domain Admins',
    path: 'demo.univention.de:/groups',
  },
  {
    $dn$: 'cn=Domain Users,cn=groups,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'Domain Users',
    path: 'demo.univention.de:/groups',
  },
  {
    $dn$: 'cn=Domain Guests,cn=groups,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'Domain Guests',
    path: 'demo.univention.de:/groups',
  },
  {
    $dn$: 'cn=Windows Hosts,cn=groups,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'Windows Hosts',
    path: 'demo.univention.de:/groups',
  },
  {
    $dn$: 'cn=DC Backup Hosts,cn=groups,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'DC Backup Hosts',
    path: 'demo.univention.de:/groups',
  },
  {
    $dn$: 'cn=DC Slave Hosts,cn=groups,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'DC Slave Hosts',
    path: 'demo.univention.de:/groups',
  },
  {
    $dn$: 'cn=Computers,cn=groups,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'Computers',
    path: 'demo.univention.de:/groups',
  },
  {
    $dn$: 'cn=Printer-Admins,cn=groups,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'Printer-Admins',
    path: 'demo.univention.de:/groups',
  },
  {
    $dn$: 'cn=Backup Join,cn=groups,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'Backup Join',
    path: 'demo.univention.de:/groups',
  },
  {
    $dn$: 'cn=Slave Join,cn=groups,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'Slave Join',
    path: 'demo.univention.de:/groups',
  },
  {
    $dn$: 'cn=users office Landshut,ou=People,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'users office Landshut',
    path: 'demo.univention.de:/People',
  },
  {
    $dn$: 'cn=users office Hardware,ou=People,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'users office Hardware',
    path: 'demo.univention.de:/People',
  },
  {
    $dn$: 'cn=users office OSS,ou=People,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'users office OSS',
    path: 'demo.univention.de:/People',
  },
  {
    $dn$: 'cn=users office Verwaltung,ou=People,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'users office Verwaltung',
    path: 'demo.univention.de:/People',
  },
  {
    $dn$: 'cn=users office Ansbach,ou=People,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'users office Ansbach',
    path: 'demo.univention.de:/People',
  },
  {
    $dn$: 'cn=users office Passau,ou=People,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'users office Passau',
    path: 'demo.univention.de:/People',
  },
  {
    $dn$: 'cn=users office Bayreuth,ou=People,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'users office Bayreuth',
    path: 'demo.univention.de:/People',
  },
  {
    $dn$: 'cn=users office Vertrieb,ou=People,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'users office Vertrieb',
    path: 'demo.univention.de:/People',
  },
  {
    $dn$: 'cn=users office KM,ou=People,dc=demo,dc=univention,dc=de',
    $childs$: false,
    $flags$: [],
    $operations$: [
      'add',
      'edit',
      'remove',
      'search',
      'move',
      'copy',
    ],
    objectType: 'groups/group',
    labelObjectType: 'Group',
    name: 'users office KM',
    path: 'demo.univention.de:/People',
  },
];

export default {
  title: 'Widgets/Grid',
  components: Grid,
} as Meta<typeof Grid>;

// Base Template
const Template: StoryFn<typeof Grid> = (args) => ({
  components: { Grid },
  setup() {
    return { args };
  },
  template: `
    <div style="max-width: 100%; width: calc(100vw - 200px)">
    <Grid v-bind="args">
<!--      <template #column-body-name="{item}">-->
<!--        {{ item }}-->
<!--      </template>-->
    </Grid>
    </div>
  `,
});

export const Basic = Template.bind({});
Basic.args = {
  items: ITEMS,
  // columns: [{
  //   label: 'Path',
  //   key: 'path',
  // }],
  // context actions
  on: {
    add: (item: GridItemProps) => {
      console.log('onAdd', item);
    },
    edit: (item: GridItemProps) => {
      console.log('onEdit', item);
    },
    remove: (item: GridItemProps) => {
      console.log('onRemove', item);
    },
    search: (item: GridItemProps) => {
      console.log('onSearch', item);
    },
    move: (item: GridItemProps) => {
      console.log('onMove', item);
    },
    copy: (item: GridItemProps) => {
      console.log('onCopy', item);
    },
  },
  // global actions
  onAddNewItem: () => {
    console.log('onAddNewItem');
  },
};
