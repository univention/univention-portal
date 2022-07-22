import { Meta, StoryFn } from '@storybook/vue3';

import MultiChoice from '../../src/components/widgets/MultiChoice.vue';

export default {
  title: 'Widgets/MultiChoice',
  components: MultiChoice,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof MultiChoice>;

// Base Template
const Template: StoryFn<typeof MultiChoice> = (args) => ({
  components: { MultiChoice },
  setup() {
    return { args };
  },
  template: '<div style="width: 500px; padding: 1rem;"><MultiChoice v-bind="args" /></div>',
});

export const Basic = Template.bind({});
Basic.args = {
  name: 'MultiChoice',
  label: 'My MultiChoice',
  modelValue: [
    { id: 2, name: 'test 2', foo: 'bar hhhh' },
    { id: '3', name: 'test  string ID 3', foo: 'bar ccc' },
  ],
  lists: [
    { id: 2, name: 'test 2', foo: 'bar hhhh' },
    { id: '3', name: 'test  string ID 3', foo: 'bar ccc' },
    { id: '4', name: 'test string ID 4', foo: 'bar xxx' },
    { id: null, name: 'test null ID', foo: 'bar asdasd' },
    { id: undefined, name: 'test undefined ID', foo: 'bar hhh' },
    { id: 11, name: 'dupplicate test 11', foo: 'bar yy' },
    { id: 11, name: 'dupplicate test 11', foo: 'bar xx' },
  ],
};
