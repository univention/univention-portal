import SimpleButton from './SimpleButton.vue';

export default {
  title: 'Example/Simple Button',
  component: SimpleButton,
};

const Template = (args) => ({
  components: { SimpleButton },
  setup() {
    return { args };
  },
  template: '<simple-button v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  title: 'Default Button',
  variant: 'default',
};

export const Light = Template.bind({});
Light.args = {
  title: 'Light Button',
  variant: 'light',
};

export const Dark = Template.bind({});
Dark.args = {
  title: 'Dark Button',
  variant: 'dark',
};
