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
        <Tile
          v-if="isTile(tile)"
          :title="tile.title"
          :link="tile.link"
          :description="tile.description"
        />
        <Folder
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
import Tile from "@/components/Tile.vue";
import Folder from "@/components/Folder.vue";

import PortalToolTip from "@/components/PortalToolTip.vue";

@Options({
  components: {
    Tile,
    Folder,
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
    isTile(obj: Tile) {
      return !this.isFolder(obj);
    },
    isFolder(obj: Tile) {
      return obj instanceof Folder;
    },
    showTooltip(): boolean {
      const handleActive = this.isActive
        ? (this.isActive = false)
        : (this.isActive = true);

      console.log('showTooltip: ', this.isActive);
      return handleActive;
    },
  }
})
export default class Category extends Vue {
  title!: string;
  tiles!: [Tile];
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
