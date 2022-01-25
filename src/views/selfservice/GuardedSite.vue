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
      <div>{{ subtitle }}</div>
      <div
        v-if="!frontendEnabled"
      >
        {{ DISABLED_NOTICE }}
      </div>
      <form
        v-else
        ref="form"
      >
        <label>
          Username
          <input
            v-model="username"
            :disabled="username !== ''"
            name="username"
          >
        </label>
        <label>
          Password
          <input
            v-model="password"
            :disabled="loaded"
            type="password"
            name="username"
          >
        </label>
        <slot />
        <button
          type="submit"
          @click.prevent="submit"
        >
          {{ SUBMIT_LABEL }}
        </button>
      </form>
    </modal-dialog>
  </modal-wrapper>
</template>

<script lang="ts">
// FIXME if using 'initialLoadDone' for is-active there are weird z-indexing css issues with the opacity animation
import { defineComponent } from 'vue';

import { umcCommand } from '@/jsHelper/umc';
import ModalWrapper from '@/components/modal/ModalWrapper.vue';
import ModalDialog from '@/components/modal/ModalDialog.vue';
import { mapGetters } from 'vuex';
import { isTrue } from '@/jsHelper/ucr';
import _ from '@/jsHelper/translate';

interface Data {
  username: string,
  password: string,
  loaded: boolean,
}

export default defineComponent({
  name: 'GuardedSite',
  components: {
    ModalDialog,
    ModalWrapper,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    ucrVarForFrontendEnabling: {
      type: String,
      default: '',
    },
  },
  emits: ['loaded', 'save'],
  data(): Data {
    return {
      username: '',
      password: '',
      loaded: false,
    };
  },
  computed: {
    ...mapGetters({
      metaData: 'metaData/getMeta',
      initialLoadDone: 'getInitialLoadDone',
      userState: 'user/userState',
    }),
    DISABLED_NOTICE(): string {
      return _('This site has been disabled');
    },
    SUBMIT_LABEL(): string {
      if (this.loaded) {
        return _('Save');
      }
      return _('Continue');
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
    setTimeout(() => {
      this.username = this.userState.username;
      this.refocus();
    }, 100); // TODO...
  },
  unmounted() {
    // TODO restore previous state instead of enabling
    this.$store.dispatch('modal/enableBodyScrolling');
  },
  methods: {
    refocus() {
      setTimeout(() => {
        ((this.$refs.form as HTMLElement).querySelector('input:not([disabled])') as HTMLElement)?.focus();
      }, 100); // TODO...
    },
    submit() {
      if (this.loaded) {
        this.$emit('save', this.username, this.password);
        return;
      }
      this.$store.dispatch('activateLoadingState');
      umcCommand(this.path, {
        username: this.username,
        password: this.password,
      })
        .then((result) => {
          this.loaded = true;
          this.$emit('loaded', result);
          this.refocus();
        })
        .catch((error) => {
          console.log(error);
          this.$store.dispatch('notifications/addErrorNotification', {
            title: _('Authentication failed'),
            description: error.message,
          });
          this.username = '';
          this.password = '';
        })
        .finally(() => {
          this.$store.dispatch('deactivateLoadingState');
        });
    },
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
    button
      float: right

  form main
    max-height: unset
</style>
