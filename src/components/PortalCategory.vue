<template>
  <div class="category">
    <h2>{{ title }}</h2>
    <div class="tiles">
      <div
        v-for="(tile, index) in tiles"
        :key="index"
        @mouseover="showTooltip"
        @mouseleave="showTooltip"
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
        <portal-tool-tip
          v-if="isActive"
          :title="tile.title"
          :icon="tile.logo"
          :description="tile.description"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import PortalTile from "@/components/PortalTile.vue";
import PortalFolder from "@/components/PortalFolder.vue";

import PortalToolTip from "@/components/PortalToolTip.vue";

@Options({
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
    };
  },
  methods: {
    isTile(obj: PortalTile) {
      return !this.isFolder(obj);
    },
    isFolder(obj: PortalTile) {
      return obj instanceof PortalFolder;
    },
    showTooltip(): boolean {
      const handleActive = this.isActive
        ? (this.isActive = false)
        : (this.isActive = true);

      return handleActive;
    },
  }
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
