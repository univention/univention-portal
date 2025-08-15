<!--
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
-->
<script>
import bestLink from '@/jsHelper/bestLink';
import { mapGetters } from 'vuex';

const tileClickMixin = {
  props: {
    links: {
      type: Array,
      required: true,
    },
    backgroundColor: {
      type: String,
      default: '',
    },
    linkTarget: {
      type: String,
    },
    target: {
      type: String,
      default: '',
    },
    pathToLogo: {
      type: String,
      required: false,
      default: './media/questionmark.svg',
    },
    internalFunction: {
      type: Function,
      required: false,
    },
  },
  computed: {
    ...mapGetters({
      metaData: 'metaData/getMeta',
      editMode: 'portalData/editMode',
      locale: 'locale/getLocale',
      tooltipID: 'tooltip/getTooltipID',
    }),
    link() {
      const fqdn = this.metaData.fqdn || window.location.hostname;
      return bestLink(this.links, fqdn, this.locale);
    },
    anchorTarget() {
      if (this.editMode || this.linkTarget !== 'newwindow') {
        return null;
      }
      return this.target || '_blank';
    },
  },
  emits: [
    'clickAction',
  ],
  methods: {
    tileClick(evt) {
      if (this.editMode) {
        evt.preventDefault();
        this.editTile();
        return false;
      }
      if (this.minified) {
        evt.preventDefault();
        return false;
      }
      if (this.tooltipID) {
        clearTimeout(this.tooltipID);
      }
      this.$store.dispatch('tooltip/unsetTooltip');
      // this.$store.dispatch('modal/hideAndClearModal');
      if (this.linkTarget === 'internalFunction') {
        evt.preventDefault();
        return this.internalFunction(this);
      }
      if (!this.link) {
        return false;
      }
      if (this.linkTarget === 'embedded') {
        evt.preventDefault();
        this.openEmbedded();
        // return false;
      }
      this.$emit('clickAction');
      return true;
    },
    openEmbedded() {
      const tab = {
        tabLabel: this.$localized(this.title),
        backgroundColor: this.backgroundColor,
        logo: this.pathToLogo,
        iframeLink: this.link,
        target: this.target,
        id: -1,
      };
      this.$store.dispatch('navigation/setActiveButton', '');
      this.$store.dispatch('tabs/addTab', tab);
      this.$store.dispatch('modal/hideAndClearModal');
      // get tooltip id and clear timeoout
      clearTimeout(this.tooltipID);
      this.$store.dispatch('tooltip/setHoverOnTooltip', false);
      this.$store.dispatch('tooltip/unsetTooltip');
    },
  },
};

export default tileClickMixin;
</script>
<style>
</style>
