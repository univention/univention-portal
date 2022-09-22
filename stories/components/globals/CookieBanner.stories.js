import CookieBanner from '@/components/globals/CookieBanner';

export default {
  title: 'Components/Globals/CookieBanner',
  components: CookieBanner,
};

// Base Template
const Template = () => ({
  components: { CookieBanner },
  setup() {
    return {};
  },
  template: '<cookie-banner />',
});

export const Basic = Template.bind({});
