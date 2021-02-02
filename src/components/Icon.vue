<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  >
    <use v-bind:xlink:href="'feather-sprite.svg#' + icon" />
  </svg>
</template>

<script lang="ts">
export default {
  props: {
    icon: {
      type: String,
      required: true
    }
  }
};
</script>

<style scoped lang="stylus">
svg
  font-size: inherit
  width: 1em
  height: 1em
  stroke: currentColor
  stroke-width: 2
  stroke-linecap: round
  stroke-linejoin: round
  fill: none
  transition: color 250ms
</style>
