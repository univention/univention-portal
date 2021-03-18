<script>
import { mapGetters } from 'vuex';
import bestLink from '@/jsHelper/bestLink';

const tileClickMixin = {
  props: {
    links: {
      type: Array,
      required: true,
    },
    linkTarget: {
      type: String,
    },
  },
  computed: {
    ...mapGetters({
      metaData: 'meta/getMeta',
      editMode: 'portalData/editMode',
    }),
    link() {
      return bestLink(this.links, this.metaData.fqdn);
    },
  },
  emits: [
    'clickAction',
  ],
  methods: {
    tileClick(evt) {
      console.log(this);
      console.log(this.linkTarget);
      if (this.link === null) {
        return false;
      }
      if (this.editMode) {
        evt.preventDefault();

        // TODO: start edit tile dialog
        return false;
      }
      if (this.inFolder) {
        evt.preventDefault();
        return false;
      }
      // this.$emit('clickAction');
      if (this.linkTarget === 'embedded') {
        evt.preventDefault();
        this.openEmbedded();
        // return false;
      } else if (this.linkTarget === 'internalFunction') {
        if (this.internalFunction === 'changeLanguage') {
          this.$store.dispatch('locale/setLocale', this.locale);
        }
      }
      return true;
    },
    openEmbedded() {
      const tab = {
        tabLabel: this.$localized(this.title),
        logo: this.pathToLogo,
        iframeLink: this.link,
      };
      this.$store.dispatch('tabs/addTab', tab);
    },
  },
};

export default tileClickMixin;
</script>
