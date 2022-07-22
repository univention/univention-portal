import { Meta, StoryFn } from '@storybook/vue3';
import MyForm from '@/components/forms/Form.vue';
import { validateAll } from '@/jsHelper/forms';

export default {
  title: 'Widgets/MultiInput',
  components: MyForm,
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
  template: `
    <div>
      <MyForm :modelValue="formValues" @update:modelValue="handleUpdate" :widgets="formWidgets" />
<!--      <button @click="validate" style="margin: 1rem"></button>-->
    </div>`,
  methods: {
    handleUpdate(newValue) {
      setTimeout(() => {
        updateArgs({ ...args, ...{ formValues: newValue } });
      }, 1000);
    },
    validate() {
      validateAll(this.formWidgets, this.formValues);
    },
  },
});

export const Basic = Template.bind({});
Basic.args = {
  formValues: {
    multiInput: [],
  },
  formWidgets: [
    {
      type: 'MultiInput',
      name: 'multiInput',
      label: 'MultiInput',
      extraLabel: 'MultiInput',

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
