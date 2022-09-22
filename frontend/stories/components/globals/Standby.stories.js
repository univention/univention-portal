import StandbyWrapper from '@/components/StandbyWrapper';

export default {
  title: 'Components/Globals/Standby',
  components: StandbyWrapper,
};

// Base Template
const Template = () => ({
  components: { StandbyWrapper },
  setup() {
    return {};
  },
  template: '<standby-wrapper />',
});

export const Basic = Template.bind({});
