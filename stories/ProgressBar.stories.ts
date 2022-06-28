import { Meta, StoryFn } from '@storybook/vue3';

import ProgressBar from '@/components/widgets/ProgressBar';

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
  template: '<div style="width: 500px"><ProgressBar v-bind="args" /></div>',
});

export const Basic = Template.bind({});
Basic.args = { label: 'My ProgressBar', modelValue: 50, message: 'Installing packages x' };
