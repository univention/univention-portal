import LoadingOverlay from '@/components/globals/LoadingOverlay';

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
