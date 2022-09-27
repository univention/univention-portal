import PortalBackground from '@/components/PortalBackground';
import _ from '@/jsHelper/translate';

export default {
  title: 'Components/PortalBackground',
  components: PortalBackground,
};


const Template = (args) => ({
  components: { PortalBackground },
  setup() {
    return {args};
  },
  template: '<portal-background v-bind="args"></portal-background>',
});

export const SimpleBackground = Template.bind({});
