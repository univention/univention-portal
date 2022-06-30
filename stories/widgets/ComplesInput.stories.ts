import { Meta, StoryFn} from '@storybook/vue3';

import ComplexInput from '../../src/components/widgets/ComplexInput.vue';
import _ from '../../src/jsHelper/translate';

export default {
  title: 'Widgets/ComplexInput',
  components: ComplexInput,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ComplexInput>;

// Base Template
const Template: StoryFn<typeof ComplexInput> = (args) => ({
  components: { ComplexInput },
  setup() {
    return { args };
  },
  template: '<div style="width: 500px; padding: 1rem;"><ComplexInput v-bind="args" /></div>',
});

export const Basic = Template.bind({});
Basic.args = {
  name: 'ComplexInput',
  label: 'My ComplexInput',
  modelValue: [],
  modelWidgets: [
    {
      type: 'DateBox',
      label: 'Date',
    },
    {
      type: 'TimeBox',
      label: 'Time',
    },
    {
      type: 'ComboBox',
      label: 'TimeZone',
      options: [{
        id: 'DE',
        label: 'Germany',
      }],
    },
    {
      type: 'ProgressBar',
      label: 'ProgressBar',
      message: 'Installing packages x',
    },
  ],
};
