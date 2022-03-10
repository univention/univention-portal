<template>
  <modal-wrapper
    :is-active="isActive"
    :full="true"
    class="modal-wrapper--selfservice"
  >
    <modal-dialog
      v-if="isActive"
      ref="dialog"
      modal-level="selfservice2"
      :i18n-title-key="TITLE"
      class="dialog--selfservice"
      role="alertdialog"
      @cancel="cancel"
    >
      <template #description>
        {{ DESCRIPTION }}
      </template>
      <form>
        <footer>
          <button
            ref="cancelButon"
            type="button"
            @click="cancel"
          >
            {{ CANCEL }}
          </button>
          <button
            ref="confirmButton"
            type="button"
            @click="confirm"
          >
            {{ CONFIRM }}
          </button>
        </footer>
      </form>
    </modal-dialog>
  </modal-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ModalDialog from '@/components/modal/ModalDialog.vue';
import ModalWrapper from '@/components/modal/ModalWrapper.vue';
import _ from '@/jsHelper/translate';

interface Data {
  isActive: boolean,
  promiseResolve: null,
}

export default defineComponent({
  name: 'ConfirmDialog',
  components: {
    ModalDialog,
    ModalWrapper,
  },
  data(): Data {
    return {
      isActive: false,
      promiseResolve: null, // TODO | Promise resolve callback
    };
  },
  computed: {
    TITLE(): string {
      return _('Account deletion');
    },
    DESCRIPTION(): string {
      return _('Do you really want to delete your account?');
    },
    CANCEL(): string {
      return _('Cancel');
    },
    CONFIRM(): string {
      return _('Delete my account');
    },
  },
  methods: {
    cancel(): void {
      this.isActive = false;
      this.$store.dispatch('activity/setLevel', 'selfservice');
    },
    confirm(): void {
      this.cancel();
      // @ts-ignore
      this.promiseResolve();
    },
    show(): Promise<undefined> {
      this.isActive = true;
      this.$store.dispatch('activity/setLevel', 'selfservice2');
      // @ts-ignore
      this.$nextTick(() => {
        (this.$refs.cancelButon as HTMLButtonElement).focus();
      });
      return new Promise((resolve, reject) => {
        // @ts-ignore TODO
        this.promiseResolve = resolve;
      });
    },
  },
});
</script>
