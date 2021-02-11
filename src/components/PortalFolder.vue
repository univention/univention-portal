<template>
  <div class="tile">
    <div
      class="folder box"
      @click="openFolder"
    >
      <div class="thumbnails">
        <div
          v-for="tile in tiles"
          :key="tile.title"
          :style="`background: ${tile.backgroundColor}`"
          class="thumbnail"
        >
          <img
            :src="tile.logo"
            :alt="`tile.title ${logo}`"
          >
        </div>
      </div>
    </div>
    <span class="name">
      {{ title }}
    </span>
  </div>
</template>

<script lang="ts">
import { Options } from 'vue-class-component';
import PortalTile from '@/components/PortalTile.vue';
import PortalModal from '@/components/globals/PortalModal.vue';

@Options({
  name: 'PortalFolder',
  components: {
    PortalTile,
    PortalModal,
  },
  props: {
    title: String,
    tiles: Array,
  },
  methods: {
    openFolder() {
      this.$store.dispatch('modal/setShowModal', {
        name: 'PortalFolder',
        props: this.$props,
      });
    },
  },
})
export default class PortalFolder extends PortalTile {
  title!: string;

  tiles!: [PortalTile];
}
</script>

<style lang="stylus">
.portal-modal--isVisible
  .box
    width: calc(4 * var(--app-tile-side-length))
    height: @width

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
