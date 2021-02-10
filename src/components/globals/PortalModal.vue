<template>
  <teleport to="body">
    <div
      class="portal-modal"
      :class="{ 'portal-modal--isVisible': isActive }"
      @click="clickHandler()"
    >
      <slot />
    </div>
  </teleport>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

@Options({
  name: 'PortalModal',
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },

  emits: ['click'],

  methods: {
    clickHandler() {
      this.$emit('click');
    },
  },
})

export default class PortalModal extends Vue {}
</script>

<style scoped lang="stylus">
.portal-modal
    width: 100%;
    position: absolute;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -999;

    &--isVisible {
        z-index: 0;
    }
</style>
