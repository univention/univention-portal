import { Meta, StoryFn } from '@storybook/vue3';

import Announcement from '../../src/components/widgets/Announcement.vue';

export default {
  title: 'Widgets/Announcement',
  components: Announcement,
  parameters: {
    layout: 'centered',
  },
} as Meta<typeof Announcement>;

// Base Template
const Template: StoryFn<typeof Announcement> = (args) => ({
  components: { Announcement },
  setup() {
    return { args };
  },
  template: '<div style="width: 500px; padding: 1rem;"><Announcement v-bind="args" /></div>',
});

export const Basic = Template.bind({});
Basic.args = {

};
