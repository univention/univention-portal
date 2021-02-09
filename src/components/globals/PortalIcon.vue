<template>
  <svg
    :width="iconWidth"
    :height="setIconHeight"
    :color="iconColor"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    aria-hidden="true"
  >
    <use :xlink:href="`feather-sprite.svg#${icon}`" />
  </svg>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "PortalIcon",
  props: {
    icon: {
      type: String,
      required: true
    },
    iconWidth: {
      type: String,
      required: true
    },
    iconHeight: {
      type: String,
      required: false
    },
    iconColor: {
      type: String,
      default: "#000000"
    }
  },
  computed: {
    setIconHeight() {
      return this.iconHeight ? this.iconHeight : this.iconWidth;
    }
  }
})
export default class PortalIcon extends Vue {}
</script>

<style scoped lang="stylus">
svg
  font-size: inherit
  stroke: currentColor
  stroke-width: 2
  stroke-linecap: round
  stroke-linejoin: round
  fill: none
  transition: color 250ms
</style>
