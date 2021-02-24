<template>
  <div
    class="portal__background"
    data-dojo-attach-point="portalBackgroundNode"
    style="background-image: url(img/background.jpg);"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'PortalBackground',
})
export default class PortalBackground extends Vue {}
</script>

<style lang="stylus">
.portal__background {
  position: fixed;
  z-index: $zindex-0;
  top: var(--portal-header-height);
  left: 0;
  right: 0;
  bottom: 0;
  background-position: top center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('~@/assets/img/background.jpg');
}
</style>
