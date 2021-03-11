<template>
  <div
    class="portal__background"
    :style="backgroundImageStyle"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

@Options({
  name: 'PortalBackground',
  computed: {
    ...mapGetters({
      portal: 'portalData/getPortal',
    }),
    backgroundImageStyle(): string {
      if (!this.portal.portal.background) {
        return 'background-image: none';
      }
      return `background-image: url('${this.portal.portal.background}`;
    },
  },
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
}
</style>
