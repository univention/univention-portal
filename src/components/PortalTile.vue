<template>
  <a
    data-test="tileLink"
    :href="link"
    draggable="true"
  >
    <div
      :class="cssClass"
    >
      <div
        :style="`background: ${backgroundColor}`"
        class="box"
      >
        <img
          :src="logo"
          :alt="`title ${logo}`"
        >
      </div>
      <span class="name">
        {{ title }}
      </span>
    </div>
  </a>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'PortalTile',
  props: {
    title: String,
    link: String,
    logo: String,
    backgroundColor: String,
    cssClass: {
      type: String,
      default: 'tile',
    },
  },
})

export default class PortalTile extends Vue {
  title!: string;

  link!: string;

  logo = 'questionMark.svg';

  backgroundColor = 'var(--color-grey40)';
}
</script>

<style scoped lang="stylus">
a,
a:hover
  color: var(--font-color-contrast-high)
  text-decoration: none

a
  position: relative
  outline: 0

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
  background: var(--color-grey40)
  width: var(--app-tile-side-length)
  height: @width
  margin-bottom: calc(2 * var(--layout-spacing-unit))

img
  width: 80%

.name
  text-align: center
  width: 100%
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
</style>
