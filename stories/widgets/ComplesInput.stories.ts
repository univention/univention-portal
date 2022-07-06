import { Meta, StoryFn } from '@storybook/vue3';

import ComplexInput from '../../src/components/widgets/ComplexInput.vue';

export default {
  title: 'Widgets/ComplexInput',
  components: ComplexInput,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof ComplexInput>;

// Base Template
const Template: StoryFn<typeof ComplexInput> = (args, { updateArgs }) => ({
  components: { ComplexInput },
  setup() {
    return { args };
  },
  template: '<div><ComplexInput v-bind="args" @update="handleUpdate" /></div>',
  methods: {
    handleUpdate(newValue) {
      updateArgs({ ...args, newValue });
    },
  },
});

export const Basic = Template.bind({});
Basic.args = {
  type: 'ComplexInput',
  name: 'complexInput',
  label: 'complexInput',
  required: false,
  readonly: false,
  modelValue: ['TextBox', '2022-12-12', '11:20', 'DE'],
  subtypes: [
    {
      type: 'TextBox',
      name: 'TextBox',
      label: 'TextBox',
      // readonly: true,
    },
    {
      type: 'DateBox',
      name: 'date',
      label: 'date',
    },
    {
      type: 'TimeBox',
      name: 'time',
      label: 'time',
    },
    {
      type: 'ComboBox',
      name: 'timeZone',
      label: 'timeZone',
      options: [{
        id: 'DE',
        label: 'Germany',
      }],
    },
  ],
};
