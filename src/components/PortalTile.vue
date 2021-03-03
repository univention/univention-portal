<template>
  <div>
    <component
      :is="wrapperTag"
      :href="link"
      :target="tagLinkTarget"
      class="portal-tile"
      data-test="tileLink"
      @mouseover="editMode || showTooltip()"
      @mouseleave="hideTooltip"
      @mousedown="hideTooltip"
      @click="tileClick"
    >
      <div
        :style="`background: ${backgroundColor}`"
        class="portal-tile__box"
      >
        <img
          :src="pathToLogo"
          :alt="`Logo ${$localized(title)}`"
          class="portal-tile__img"
        >
      </div>
      <span class="portal-tile__name">
        {{ $localized(title) }}
      </span>
    </component>
    <portal-tool-tip
      v-if="isActive"
      :title="$localized(title)"
      :icon="pathToLogo"
      :description="$localized(description)"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

import PortalToolTip from '@/components/PortalToolTip.vue';
import bestLink from '@/jsHelper/bestLink.js';

@Options({
  name: 'PortalTile',
  components: {
    PortalToolTip,
  },
  props: {
    title: {
      type: Object,
      required: true,
    },
    description: {
      type: Object,
      required: true,
    },
    links: {
      type: Array,
      required: true,
    },
    linkTarget: {
      type: String,
      required: true,
    },
    pathToLogo: {
      type: String,
      required: false,
      default: 'questionMark.svg',
    },
    backgroundColor: {
      type: String,
      default: 'var(--color-grey40)',
    },
    inFolder: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isActive: false,
    };
  },
  computed: {
    ...mapGetters({
      metaData: 'meta/getMeta',
      editMode: 'portalData/editMode',
    }),
    wrapperTag(): string {
      return this.inFolder || this.editMode ? 'div' : 'a';
    },
    link(): string {
      return bestLink(this.links, this.metaData.fqdn);
    },
    tagLinkTarget(): string {
      if (this.linkTarget === 'newwindow') {
        return '_blank';
      }
      return '';
    },
  },
  methods: {
    hideTooltip(): void {
      this.isActive = false;
    },
    showTooltip(): void {
      if (!this.inFolder) {
        this.isActive = true;
      }
    },
    tileClick(evt) {
      if (this.editMode) {
        evt.preventDefault();
        // TODO: start edit tile dialog
        return false;
      }
      if (this.inFolder) {
        evt.preventDefault();
        return false;
      }
      this.$store.dispatch('modal/setHideModal'); // maybe folder was opened... maybe we should $emit here and close in Folder.vue?
      if (this.linkTarget === 'embedded') {
        evt.preventDefault();
        this.openEmbedded();
        return false;
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
})
export default class PortalTile extends Vue {
  title!: Object;

  description!: Object;

  links!: String[];

  pathToLogo?: String;

  backgroundColor = 'var(--color-grey40)';
}
</script>

<style lang="stylus">
.portal-tile
  position: relative
  outline: 0
  width: var(--app-tile-side-length)
  display: flex
  flex-direction: column
  align-items: center
  cursor: pointer
  color: var(--font-color-contrast-high)
  text-decoration: none

  &:hover
    color: var(--font-color-contrast-high)
    text-decoration: none

  &__box
    border-radius: 15%
    display: flex
    align-items: center
    justify-content: center
    box-shadow: var(--box-shadow)
    background: var(--color-grey40)
    width: var(--app-tile-side-length)
    height: @width
    margin-bottom: calc(2 * var(--layout-spacing-unit))

  &__img
    width: 80%

  &__name
    text-align: center
    width: 100%
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
</style>
