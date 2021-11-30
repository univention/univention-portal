<template>
  <modal-wrapper
    :is-active="true"
    :full="true"
    class="modal-wrapper--selfservice"
  >
    <modal-dialog
      :i18n-title-key="title"
      class="dialog--selfservice"
      @cancel="cancel"
    >
      <slot />
    </modal-dialog>
  </modal-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ModalWrapper from '@/components/modal/ModalWrapper.vue';
import ModalDialog from '@/components/modal/ModalDialog.vue';

export default defineComponent({
  name: 'Site',
  components: {
    ModalDialog,
    ModalWrapper,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.$store.dispatch('modal/disableBodyScrolling');
  },
  unmounted() {
    // TODO restore previous state instead of enabling
    this.$store.dispatch('modal/enableBodyScrolling');
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'portal' });
    },
  },
});
</script>

<style lang="stylus">
.modal-wrapper--selfservice
  padding: calc(4 * var(--layout-spacing-unit)) 0
  overflow: auto
  box-sizing: border-box
  // z-index: $zindex-4 TODO notifications are also $zindex-4
  z-index: 399

.dialog--selfservice
  margin: auto

  input,
  select,
  form
    width: 100%
  form
    min-width: calc(var(--inputfield-width) + 3rem)
</style>
