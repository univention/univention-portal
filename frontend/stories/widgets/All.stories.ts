import { Meta, StoryFn } from '@storybook/vue3';

import MyForm from '@/components/forms/Form.vue';
import { ref } from 'vue';
import { validateAll } from '../../src/jsHelper/forms';
import widgetsJson from '../assets/all/widgets.json';

interface Widget {
  id: string;
  type: string;
  label: string;
  name: string;
  [key: string]: any;
}

export default {
  title: 'Widgets/All Widgets',
  components: MyForm,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof MyForm>;

// Base Template
const Template: StoryFn<typeof MyForm> = (args) => ({
  components: { MyForm },
  setup() {
    const widgets: Widget[] = [];
    const widgetsModelValue = ref({});

    function isWidgetIsAlreadyAdded(widget: Widget) {
      return widgets.find((w) => w.type === widget.type);
    }

    // check type is some kind of umc/modules/udm/CertificateUploader
    function isTypeIsIncludeSlash(widget: Widget) {
      return widget.type.includes('/');
    }

    const ignoreWidgets = ['MultiInput', 'MultiSelect'];

    widgetsJson.forEach((widget) => {
      // ignore widgets
      if (ignoreWidgets.includes(widget.type)) return;

      if (!isWidgetIsAlreadyAdded(widget as any)) {
        if (isTypeIsIncludeSlash(widget as any)) {
          const widgetType = widget.type.split('/');
          widget.type = widgetType[widgetType.length - 1];
        }

        const additionalProps: Record<string, any> = {};

        switch (widget.type) {
          case 'ComplexInput': {
            additionalProps.subtypes = [
              {
                type: 'TextBox',
                name: 'text',
                label: 'TextBox (ComplexInput)',
              },
            ];
            widgetsModelValue.value[widget.type] = [
              '',
            ];
            break;
          }

          case 'ComboBox': {
            additionalProps.options = [
              { id: 'DE', label: 'Germany' },
              { id: 'US', label: 'United States' },
            ];
            widgetsModelValue.value[widget.type] = '';
            break;
          }

          case 'MailBox': {
            additionalProps.domainList = ['intentive.de', 'gmail.com'];
            widgetsModelValue.value[widget.type] = '';
            break;
          }

          case 'ImageUploader': {
            additionalProps.extraLabel = 'ImageUploader';
            widgetsModelValue.value[widget.type] = '';
            break;
          }

          default:
            widgetsModelValue.value[widget.type] = '';
            break;
        }

        widgets.push({
          id: widget.type.toLowerCase(),
          type: widget.type,
          label: widget.type,
          name: widget.type,
          ...additionalProps,
        });
      }
    });

    return { args, widgets, widgetsModelValue };
  },

  template: `
    <div>
      <MyForm v-model="widgetsModelValue" :widgets="widgets" />
    </div>`,

  methods: {
    validate() {
      validateAll(this.formWidgets, this.formValues);
    },
  },
});

function validator(_widget: any, value: string): string {
  const regex = new RegExp('^[0-9]*$');
  if (!regex.test(value)) {
    return ('Internal name must not contain anything other than digits, letters or dots, must be at least 2 characters long, and start and end with a digit or letter!');
  }
  return '';
}

export const Basic = Template.bind({});
Basic.args = {
  formWidgets: [
    {
      type: 'PasswordBox',
      name: 'password',
      label: 'PasswordBox',
    },
    {
      type: 'TextBox',
      name: 'text',
      label: 'TextBox',
      validators: [validator],
    },
    {
      type: 'ComplexInput',
      name: 'complexInput',
      label: 'ComplexInput',

      subtypes: [
        {
          type: 'TextBox',
          name: 'text',
          label: 'TextBox',
          validators: [validator],
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
    },
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
