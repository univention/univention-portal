<template>
  <component
    :is="wrapperTag"
    class="portal-tile"
    draggable="true"
    data-test="tileLink"
    @mouseover="showTooltip(tile)"
    @mouseleave="hideTooltip"
    @click="tileClick"
  >
    <div
      :style="`background: ${backgroundColor}`"
      class="portal-tile__box"
    >
      <img
        :src="tile.pathToLogo"
        :alt="`title ${title}`"
        class="portal-tile__img"
      >
    </div>
    <span class="portal-tile__name">
      {{ title }}
    </span>

    <portal-tool-tip
      v-if="isActive"
      :title="$localized(toolTip.title)"
      :icon="toolTip.icon"
      :description="$localized(toolTip.description)"
    />
  </component>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import PortalToolTip from '@/components/PortalToolTip.vue';

@Options({
  name: 'PortalTile',
  components: {
    PortalToolTip,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: Array,
      required: true,
    },
    pathToLogo: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      default: 'var(--color-grey40)',
    },
    inFolder: {
      type: Boolean,
      default: false,
    },
    tile: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isActive: false,
      toolTip: {},
    };
  },
  computed: {
    wrapperTag(): string {
      return this.inFolder ? 'div' : 'a';
    },
  },
  methods: {
    hideTooltip(): void {
      const handleActive = false;
      this.isActive = handleActive;
      this.toolTip = {};
    },
    showTooltip(tile): any {
      if (Object.keys(tile).length > 0) {
        const handleActive = true;
        this.isActive = handleActive;
        this.toolTip = {
          title: tile.title,
          icon: tile.pathToLogo,
          description: tile.description,
        };
      }
    },
    tileClick() {
      const tab = {
        tabLabel: this.title,
        logo: this.toolTip.icon,
        iframeLink: this.iframeLink(),
      };
      this.$store.dispatch('tabs/addTab', tab);
    },
    iframeLink() {
      const [link] = this.link;
      return link;
    },
  },
})
export default class PortalTile extends Vue {
  title!: String;

  link!: String[];

  pathToLogo = 'questionMark.svg';

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
