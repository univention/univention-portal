import ReadOnlyField from '@/components/forms/ReadOnlyField';
import _ from '@/jsHelper/translate';
import { store } from '@/store/';

export default {
  title: 'Components/Forms/ReadOnlyField',
  components: ReadOnlyField,
};

const Template = (args) => ({
  components: { ReadOnlyField },
  setup() {
    return {args};
  },
  template: '<read-only-field v-bind="args" />',
  store: store,
});

export const Basic = Template;
Basic.args = {
  label: 'Internal Name',
  tabindex: 0,
}

