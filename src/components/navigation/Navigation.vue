<template>
  <nav class="navigation" :class="{ 'navigation--is-visible': isVisible }">
    <ul>
      <li><a href="#">Anmelden</a></li>
      <li><a href="#">Zertifikate</a></li>
      <li><a href="#">Sprache ändern</a></li>
      <li><a href="#">Hilfe</a></li>
    </ul>
  </nav>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Navigation",
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  computed: {}
})
export default class Navigation extends Vue {}
</script>
<style lang="stylus">
.navigation
  height: calc(100vh - (var(--portal-header-height) + 0.5rem));
  max-width: 36rem;
  width: 36rem;
  position: fixed;
  right: 0;
  bottom:0;
  background-color: var(--bgc-content-header);
  transform: translate3d(110%, 0, 0);
  color: #fff;
  z-index: 100;
  &--is-visible
     transform: translate3d(0, 0, 0) scale(1, 1);
    transition: transform cubic-bezier(0, 0, 0.2, 1) 0.15s;

  a
    color: #fff;
</style>
