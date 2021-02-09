<template>
  <div class="category">
    <h2>{{ title }}</h2>
    <div class="tiles">
      <div
        v-for="(tile, index) in tiles"
        :key="index"
        @mouseover="showTooltip(tile)"
        @mouseleave="hideTooltip"
      >
        <portal-tile
          v-if="isTile(tile)"
          :title="tile.title"
          :link="tile.link"
          :description="tile.description"
        />
        <portal-folder
          v-if="isFolder(tile)"
          :title="tile.title"
          :tiles="tile.tiles"
        />
      </div>
    </div>
    <portal-tool-tip
      v-if="isActive"
      :title="toolTip.title"
      :icon="toolTip.icon"
      :description="toolTip.description"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PortalTile from '@/components/PortalTile.vue';
import PortalFolder from '@/components/PortalFolder.vue';

import PortalToolTip from '@/components/PortalToolTip.vue';

@Options({
  name: 'PortalCategory',
  components: {
    PortalTile,
    PortalFolder,
    PortalToolTip,
  },
  props: {
    title: String,
    tiles: Array,
  },
  data() {
    return {
      isActive: false,
      toolTip: {},
    };
  },
  methods: {
    isTile(obj: PortalTile) {
      return !this.isFolder(obj);
    },
    isFolder(obj: PortalTile) {
      return obj instanceof PortalFolder;
    },
    showTooltip(tile): any {
      const handleActive = true;
      this.isActive = handleActive;
      this.toolTip.title = tile.title;
      this.toolTip.icon = tile.logo;
      this.toolTip.description = tile.description;
    },
    hideTooltip(): void {
      const handleActive = false;
      this.isActive = handleActive;
      this.toolTip = {};
    },
  },
})
export default class PortalCategory extends Vue {
  title!: string;

  tiles!: [PortalTile];
}
</script>

<style scoped lang="stylus">
.tiles
  display: grid
  grid-template-columns: repeat(auto-fill, var(--app-tile-side-length))
  grid-gap: calc(6 * var(--layout-spacing-unit))
.category
  margin-bottom: calc(10 * var(--layout-spacing-unit));
</style>
