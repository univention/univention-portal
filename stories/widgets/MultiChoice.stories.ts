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
    { value: 'Sun 2-3', label: 'Sun 2-3' },
    { value: 'Sun 3-4', label: 'Sun 3-4' },
  ],
  lists: [
    { value: 'Sun 2-3', label: 'Sun 2-3' },
    { value: 'Sun 3-4', label: 'Sun 3-4' },
    { value: 'Sun 4-5', label: 'Sun 4-5' },
    { value: 'Sun 5-6', label: 'Sun 5-6' },
    { value: 'Sun 6-7', label: 'Sun 6-7' },
    { value: 'Sun 7-8', label: 'Sun 7-8' },
    { value: 'Sun 8-9', label: 'Sun 8-9' },
    { value: 'Sun 9-10', label: 'Sun 9-10' },
    { value: 'Sun 10-11', label: 'Sun 10-11' },
  ],
};
