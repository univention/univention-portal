import PortalIcon from '@/components/globals/PortalIcon';

export default {
  title: 'Globals/PortalIcon',
  components: PortalIcon,
};

// Base Template
const Template = (args) => ({
  components: { PortalIcon },
  setup() {
    return {args};
  },
  template: '<portal-icon v-bind="args" />',
});

export const Basic = Template.bind({});
Basic.args = {
  icon: "feather",
};