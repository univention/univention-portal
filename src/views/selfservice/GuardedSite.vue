<template>
  <site
    :title="title"
    :subtitle="subtitle"
    :ucr-var-for-frontend-enabling="ucrVarForFrontendEnabling"
  >
    <my-form
      ref="form"
      v-model="formValues"
      :widgets="formWidgets"
    >
      <footer>
        <button
          type="submit"
          @click.prevent="submit"
        >
          {{ SUBMIT_LABEL }}
        </button>
      </footer>
    </my-form>
  </site>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { umcCommand } from '@/jsHelper/umc';
import Site from '@/views/selfservice/Site.vue';
import MyForm from '@/components/forms/Form.vue';
import { WidgetDefinition } from '@/jsHelper/forms';
import { mapGetters } from 'vuex';
import _ from '@/jsHelper/translate';

interface FormData {
  username: string,
  password?: string,
}

interface Data {
  formValues: FormData,
  loaded: boolean,
  usernameGiven: boolean,
}

export default defineComponent({
  name: 'GuardedSite',
  components: {
    MyForm,
    Site,
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
    passwordNeeded: {
      type: Boolean,
      default: true,
    },
    guardedWidgets: {
      type: Array as PropType<WidgetDefinition[]>,
      required: true,
    },
    ucrVarForFrontendEnabling: {
      type: String,
      default: '',
    },
  },
  emits: ['loaded', 'save'],
  data(): Data {
    const formValues: FormData = {
      username: '',
    };
    if (this.passwordNeeded) {
      formValues.password = '';
    }
    return {
      formValues,
      loaded: false,
      usernameGiven: false,
    };
  },
  computed: {
    ...mapGetters({
      metaData: 'metaData/getMeta',
      userState: 'user/userState',
    }),
    formWidgets(): WidgetDefinition[] {
      const widgets: WidgetDefinition[] = [{
        type: 'TextBox',
        name: 'username',
        label: _('Username'),
        readonly: this.loaded || this.usernameGiven,
        invalidMessage: '',
        required: true,
      }];
      if (this.passwordNeeded) {
        widgets.push({
          type: 'PasswordBox',
          name: 'password',
          label: _('Password'),
          readonly: this.loaded,
          invalidMessage: '',
          required: true,
        });
      }
      if (this.loaded) {
        this.guardedWidgets.forEach((widget) => widgets.push(widget));
      }
      return widgets;
    },
    SUBMIT_LABEL(): string {
      if (this.loaded) {
        return _('Submit');
      }
      return _('Next');
    },
    form(): typeof MyForm {
      return this.$refs.form as typeof MyForm;
    },
  },
  mounted() {
    setTimeout(() => {
      if (this.userState.username) {
        this.formValues.username = this.userState.username;
        this.usernameGiven = true;
      }
      this.refocus();
    }, 100); // TODO...
  },
  methods: {
    refocus() {
      setTimeout(() => {
        this.form.focusFirstInteractable();
      }, 100); // TODO...
    },
    submit() {
      if (!this.form.validate()) {
        this.form.focusFirstInvalid();
        return;
      }
      if (this.loaded) {
        this.$emit('save', this.formValues);
        return;
      }
      this.$store.dispatch('activateLoadingState');
      const params: FormData = {
        username: this.formValues.username,
      };
      if (this.passwordNeeded) {
        params.password = this.formValues.password;
      }
      umcCommand(this.path, params)
        .then((result) => {
          this.loaded = true;
          this.$emit('loaded', result, this.formValues);
          this.refocus();
        })
        .catch((error) => {
          console.log(error);
          this.$store.dispatch('notifications/addErrorNotification', {
            title: _('Authentication failed'),
            description: error.message,
          });
          this.formValues.username = '';
          if (this.passwordNeeded) {
            this.formValues.password = '';
          }
          this.usernameGiven = false;
        })
        .finally(() => {
          this.$store.dispatch('deactivateLoadingState');
        });
    },
  },
});
</script>
