import { Meta, StoryFn } from '@storybook/vue3';

import Accordions, { AccordionItem } from '@/components/widgets/Accordions';

export default {
  title: 'Widgets/Accordions',
  components: Accordions,
} as Meta<typeof Accordions>;

// Base Template
const Template: StoryFn<typeof Accordions> = (args) => ({
  components: { Accordions, AccordionItem },
  setup() {
    return { args };
  },
  template: `<div>
    <Accordions v-bind="args" title="Basic settings">
      <AccordionItem title="kkkk">
        <p>Yoyo</p>
      </AccordionItem>
    </Accordions>
  </div>
  `,
});

export const Basic = Template.bind({});
Basic.args = {
  title: 'Accordions Title',
};
