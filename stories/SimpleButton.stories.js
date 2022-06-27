import SimpleButton from './SimpleButton.vue';

export default {
  title: 'Simple Button',
  component: SimpleButton,
};

const Template = (args) => ({
  components: { SimpleButton },
  template: '<div>test y asdasd </div>',
});

export const Default = Template.bind({});
Default.args = {
  title: 'Default Button',
  variant: 'default',
};
