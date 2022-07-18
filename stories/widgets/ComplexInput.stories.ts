import { Meta, StoryFn } from '@storybook/vue3';

import ComplexInput from '@/components/widgets/ComplexInput.vue';
import { validateAll } from '@/jsHelper/forms';

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
  template: `
    <div>
      <ComplexInput v-bind="args"/>
      <button :click="validate" style="margin: 1rem 0;">validate</button>
    </div>`,
  methods: {
    validate() {
      console.log(this.formWidgets, this.formValues)
      validateAll(this.formWidgets, this.formValues);
    },
  },
});

function testValidator(_widget: any, value: string): string {
  const regex = new RegExp('^[a-zA-Z ]*$');
  if (!regex.test(value)) {
    return ('validator');
  }
  return '';
}

export const Basic = Template.bind({});
Basic.args = {
  type: 'ComplexInput',
  name: 'complexInput',
  label: 'complexInput',
  direction: 'vertical',
  required: false,
  readonly: false,
  modelValue: ['TextBox', '2022-12-12', '11:20', 'DE'],
  subtypes: [
    {
      type: 'TextBox',
      name: 'text',
      label: 'TextBox',
      validators: [testValidator],
    },
    {
      type: 'DateBox',
      name: 'date',
      label: 'DateBox',
    },
    {
      type: 'TimeBox',
      name: 'time',
      label: 'TimeBox',
    },
    {
      type: 'ComboBox',
      name: 'timeZone',
      label: 'ComboBox',
      options: [{
        id: 'DE',
        label: 'Germany',
      }],
    },
  ],
};
