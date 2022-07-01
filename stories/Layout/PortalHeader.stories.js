import PortalHeader from '../../src/components/PortalHeader.vue';

export default {
  title: 'Layout/PortalHeader',
  component: PortalHeader,
};


const Template = () => ({
  components: { PortalHeader }, 
  setup() {
    return {};
  },
  template: `<portal-header></portal-header>`,
}); 


export const Default = Template.bind({});
