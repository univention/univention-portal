<template>
  <portal-modal :isActive="isVisible">
    <section :class="{ 'section--isVisible': isVisible }" class="section">
      <slot />
    </section>
  </portal-modal>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import PortalModal from "@/components/globals/PortalModal.vue";

@Options({
  name: "FlyoutWrapper",
  components: {
    PortalModal,
  },
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  computed: {},
})
export default class FlyoutWrapper extends Vue {}
</script>

<style lang="stylus">
.section
  max-width: 36rem;
  width: 36rem;
  position: fixed;
  top:  calc(var(--portal-header-height) + 0.5rem);
  right: 0;
  background-color: var(--bgc-content-header);
  transform: translate3d(110%, 0, 0);
  color: #fff;
  z-index: 100;
  transition: transform cubic-bezier(0, 0, 0.2, 1) 0.5s;

  &--isVisible
    transform: translate3d(0, 0, 0) scale(1, 1);
    transition: transform cubic-bezier(0, 0, 0.2, 1) 0.5s;
</style>
