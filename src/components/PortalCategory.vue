<template>
  <div class="category">
    <h2>{{ showTitle }}</h2>
    <div class="tiles">
      <div
        v-for="(tile, index) in tiles"
        :key="index"
      >
        <portal-tile
          v-if="isTile(tile)"
          :title="tile.title"
          :link="tile.link"
          :description="tile.description"
          :tile="tile"
        />
        <portal-folder
          v-if="isFolder(tile)"
          :title="tile.title"
          :tiles="tile.tiles"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PortalTile from '@/components/PortalTile.vue';
import PortalFolder from '@/components/PortalFolder.vue';

@Options({
  name: 'PortalCategory',
  components: {
    PortalTile,
    PortalFolder,
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
  computed: {
    showTitle() {
      return this.tiles.length > 0 ? this.title : '';
    },
  },
  methods: {
    isTile(obj: PortalTile) {
      return !this.isFolder(obj);
    },
    isFolder(obj: PortalTile) {
      return obj instanceof PortalFolder;
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
