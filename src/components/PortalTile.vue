<template>
  <component
    :is="wrapperTag"
    class="portal-tile"
    draggable="true"
    data-test="tileLink"
    @click="tileClick"
  >
    <div
      :style="`background: ${backgroundColor}`"
      class="portal-tile__box"
    >
      <img
        :src="logo"
        :alt="`title ${logo}`"
        class="portal-tile__img"
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
  methods: {
    tileClick() {
      const tab = {
        tabLabel: this.title,
        logo: this.logo,
        iframeLink: this.link,
      };
      this.$store.dispatch('tabs/addTab', tab);
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

  &__box
    border-radius: 15%
    display: flex
    align-items: center
    justify-content: center
    box-shadow: var(--box-shadow)
    background: var(--color-grey40)
    width: var(--app-tile-side-length)
    height: @width
    margin-bottom: calc(2 * var(--layout-spacing-unit))

  &__img
    width: 80%

  &__name
    text-align: center
    width: 100%
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
</style>
