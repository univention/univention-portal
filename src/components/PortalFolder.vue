<template>
  <div
    class="portal-folder"
    :class="{ 'portal-folder__in-modal': inModal }"
  >
    <div
      class="portal-tile__box"
      @click="openFolder"
    >
      <div class="portal-folder__thumbnails">
        <template
          v-for="tile in tiles"
          :key="tile.title"
        >
          <PortalTile
            v-bind="tile.$props"
            :in-folder="!inModal"
          />
        </template>
      </div>
    </div>
    <span class="portal-folder__name">
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
    inModal: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    openFolder() {
      this.$store.dispatch('modal/setShowModal', {
        name: 'PortalFolder',
        props: { ...this.$props, inModal: true },
      });
    },
  },
})

export default class PortalFolder extends PortalTile {
  title!: string;

  tiles!: [PortalTile];

  inModal!: boolean;
}
</script>

<style lang="stylus">
.portal-folder
  position: relative
  width: var(--app-tile-side-length)
  display: flex
  flex-direction: column
  align-items: center
  cursor: pointer

  &__name
    text-align: center
    width: 100%
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap

  &__in-modal
    cursor: default

    .portal-tile
      &__box
        width: calc(5 * var(--app-tile-side-length))
        height: @width

        .portal-tile
          width: var(--app-tile-side-length)
          &__box
            width: var(--app-tile-side-length)
            height: @width
      &__name
        display: block;

  &__thumbnails
    width: 80%;
    height: 80%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: calc(4 * var(--layout-spacing-unit))
    grid-gap: var(--layout-spacing-unit)

    .portal-tile
      width: calc(0.2 * var(--app-tile-side-length))
      &__box
        width: calc(0.2 * var(--app-tile-side-length))
        height: @width
        margin-bottom: var(--layout-spacing-unit)

      &__name
        display: none;

  .portal-tile__box
    background: var(--color-grey0)
</style>
