import { Meta, StoryFn } from '@storybook/vue3';
import ProgressBar from '/src/components/widgets/ProgressBar';

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/vue/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'ProgressBar',
  components: ProgressBar,
} as Meta;

// // create the base template
const Template = (args) => ({
  components: { ProgressBar },
  // Then, those values can be accessed directly in the template
  template: '<div>TEST <ProgressBar name="progress" model-value="10" /> xxx</div>',
});

export const Basic = Template.bind({});

export const Primary: StoryFn = () => ({
  components: { ProgressBar },
  template: '<div>TEST <ProgressBar name="progress" model-value="50">yy</ProgressBar>xxxx</div>',
});
