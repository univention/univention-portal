<template>
  <div>
    <h2>{{ title }}</h2>
    <div class="tiles">
      <template 
        v-for="(tile, index) in tiles"
        :key="index"
      >
        <Tile v-if="isTile(tile)"
          :title="tile.title"
          :link="tile.link"
        />
        <Folder v-if="isFolder(tile)"
          :title="tile.title"
          :tiles="tile.tiles"
        />
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Tile from "@/components/Tile.vue";
import Folder from "@/components/Folder.vue";

@Options({
  components: {
    Tile,
    Folder
  },
  props: {
    title: String,
    tiles: Array
  },
  methods: {
    isTile: (obj: Tile) => { return obj.title != "Favorites" },
    isFolder: (obj: Tile) => { return obj.title == "Favorites" },
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
</style>
