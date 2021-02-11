<template>
  <component
    :is="wrapperTag"
    class="portal-tile"
    :href="link"
    draggable="true"
  >
    <div
      :style="`background: ${backgroundColor}`"
      class="portal-tile__box"
    >
      <img
        :src="logo"
        :alt="`title ${logo}`"
      >
    </div>
    <span class="portal-tile__name">
      {{ title }}
    </span>
  </component>
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
    inFolder: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    wrapperTag() {
      return this.inFolder ? 'div' : 'a';
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

<style lang="stylus">
.portal-tile
  position: relative
  outline: 0
  width: var(--app-tile-side-length)
  display: flex
  flex-direction: column
  align-items: center
  cursor: pointer
  color: var(--font-color-contrast-high)
  text-decoration: none

  &:hover
    color: var(--font-color-contrast-high)
    text-decoration: none

.portal-tile__box
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

.portal-tile__name
  text-align: center
  width: 100%
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
</style>
