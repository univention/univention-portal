import { Meta, StoryFn } from '@storybook/vue3';

import Announcement from '../../src/components/widgets/Announcement.vue';
import PortalIcon from '../../src/components/globals/PortalIcon.vue';

export default {
  title: 'Widgets/Announcement',
  components: Announcement,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['success', 'warning', 'error'],
      },
    },
  },
} as Meta<typeof Announcement>;

// Base Template
const Template: StoryFn<typeof Announcement> = (args) => ({
  components: { Announcement, PortalIcon },
  setup() {
    return { args };
  },
  template: `
  <div style="max-width: 100vw; padding: 0">
    <Announcement v-bind="args">
      <PortalIcon icon="bell" />
      <p style="margin-left: 4px; font-weight: bold">Announcement!</p>
    </Announcement>
  </div>`,
});

export const Basic = Template.bind({});
Basic.args = {
  type: 'success',
};
