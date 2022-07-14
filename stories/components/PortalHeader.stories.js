import PortalHeader from '@/components/PortalHeader.vue';

export default {
  title: 'Components/PortalHeader',
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
