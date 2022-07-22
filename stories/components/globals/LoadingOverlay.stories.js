import LoadingOverlay from '@/components/globals/LoadingOverlay';

// jkeiser: the LoadingOverlay is shown on every site once this component was viewed in storybook

export default {
  title: 'Components/Globals/LoadingOverlay',
  components: LoadingOverlay,
};

// Base Template
const Template = () => ({
  components: { LoadingOverlay },
  setup() {
    return {};
  },
  template: '<loading-overlay />',
});

export const Basic = Template.bind({});
