<template>
  <modal-wrapper
    :is-active="initialLoadDone"
    :full="true"
    class="modal-wrapper--selfservice"
  >
    <modal-dialog
      :i18n-title-key="title"
      class="dialog--selfservice"
      @cancel="cancel"
    >
      <slot />
      <div
        v-if="!frontendEnabled"
      >
        {{ DISABLED_NOTICE }}
      </div>
    </modal-dialog>
  </modal-wrapper>
</template>

<script lang="ts">
// FIXME if using 'initialLoadDone' for is-active there are weird z-indexing css issues with the opacity animation
import { defineComponent } from 'vue';

import ModalWrapper from '@/components/modal/ModalWrapper.vue';
import ModalDialog from '@/components/modal/ModalDialog.vue';
import { mapGetters } from 'vuex';
import { isTrue } from '@/jsHelper/ucr';
import _ from '@/jsHelper/translate';

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
    ucrVarForFrontendEnabling: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters({
      metaData: 'metaData/getMeta',
      initialLoadDone: 'getInitialLoadDone',
    }),
    DISABLED_NOTICE(): string {
      return _('This site has been disabled');
    },
    frontendEnabled(): boolean {
      if (this.ucrVarForFrontendEnabling === '') {
        return true;
      }
      return isTrue(this.metaData[this.ucrVarForFrontendEnabling]);
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
  box-sizing: border-box
  min-width: s('min(350px, 90%)')
  min-height: s('min(200px, 90%)')
  max-width: unset

  input,
  select,
  form
    width: 100%
  form
    min-width: calc(var(--inputfield-width) + 3rem)
</style>
