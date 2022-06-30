import { Meta, StoryFn } from '@storybook/vue3';

import ProgressBar from '../../src/components/widgets/ProgressBar.vue';

export default {
  title: 'Widgets/ProgressBar',
  components: ProgressBar,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ProgressBar>;

// Base Template
const Template: StoryFn<typeof ProgressBar> = (args) => ({
  components: { ProgressBar },
  setup() {
    return { args };
  },
  template: '<div style="width: 500px; padding: 1rem;"><ProgressBar v-bind="args" /></div>',
});

export const Basic = Template.bind({});
Basic.args = { name: 'ProgressBar', label: 'My ProgressBar', modelValue: 50, message: 'Installing packages x', forAttrOfLabel: 'forAttrOfLabel' };
