import { Meta, StoryFn } from '@storybook/vue3';

import MyForm from '@/components/forms/Form.vue';

export default {
  title: 'Widgets/All',
  components: MyForm,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof MyForm>;

// Base Template
const Template: StoryFn<typeof MyForm> = (args, { updateArgs }) => ({
  components: { MyForm },
  setup() {
    return { args };
  },
  data() {
    return {
      formValues: args.formValues,
      formWidgets: args.formWidgets,
    };
  },
  template: '<div style="width: 500px; padding: 1rem;"><my-form ref="form" :modelValue="formValues" @update:modelValue="handleUpdate" :widgets="formWidgets" /></div>',
  methods: {
    handleUpdate(newValue) {
      setTimeout(() => {
        updateArgs({ ...args, ...{ formValues: newValue } });
      }, 1000);
    },
  },
});

export const Basic = Template.bind({});
Basic.args = {
  formValues: {
    password: '',
    complexInput: ['2022-12-12', '11:20', 'DE'],
  },
  formWidgets: [
    {
      type: 'PasswordBox',
      name: 'password',
      label: 'password',
    },
    {
      type: 'ComplexInput',
      name: 'complexInput',
      label: 'complexInput',

      subtypes: [
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
    },
  ],
};
