<template>
  <div>
    <h2>{{ title }}</h2>
    <div class="tiles">
      <Tile
        v-for="(tile, index) in tiles"
        :key="index"
        :title="tile.title"
        :link="tile.link"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Tile from "@/components/Tile.vue";

@Options({
  components: {
    Tile
  },
  props: {
    title: String,
    tiles: Array
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
