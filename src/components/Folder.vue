<template>
  <div class="tile">
    <div class="folder box">
      <div class="thumbnails">
        <div
          v-for="tile in tiles"
          :key="tile.title"
          class="thumbnail"
          :style="'background: ' + tile.backgroundColor"
        >
          <img :src="tile.logo" :alt="tile.title + ' logo'" />
        </div>
      </div>
    </div>
    <span class="name">{{ title }}</span>
  </div>
</template>
<script lang="ts">
import { Options } from "vue-class-component";
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
export default class Folder extends Tile {
  title!: string;
  tiles!: [Tile];
}
</script>
<style scoped lang="stylus">
/*.folder
  background: rgba(var(--color-grey0-rgb), 0.7);
*/
.tile
  position: relative
  width: var(--app-tile-side-length)
  display: flex
  flex-direction: column
  align-items: center
  cursor: pointer
.box
  border-radius: 15%
  display: flex
  align-items: center
  justify-content: center
  box-shadow: var(--box-shadow)
  background: var(--color-grey0)
  width: var(--app-tile-side-length)
  height: @width
  margin-bottom: calc(2 * var(--layout-spacing-unit))

.thumbnail
  border-radius: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--box-shadow);
  background: var(--color-grey40);

.thumbnails
  width: 80%;
  height: 80%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 8px;
.name
  text-align: center
  width: 100%
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
</style>
