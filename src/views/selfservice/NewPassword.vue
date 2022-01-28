<template>
  <site
    :title="TITLE"
    :subtitle="SUBTITLE"
    :ucr-var-for-frontend-enabling="'umc/self-service/passwordreset/frontend/enabled'"
  >
    <my-form
      ref="form"
      v-model="formValues"
      :widgets="formWidgets"
    >
      <footer>
        <button
          type="submit"
          class="primary"
          @click.prevent="submit"
        >
          {{ SUBMIT_LABEL }}
        </button>
      </footer>
    </my-form>
  </site>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { umcCommand } from '@/jsHelper/umc';
import _ from '@/jsHelper/translate';
import Site from '@/views/selfservice/Site.vue';
import MyForm from '@/components/forms/Form.vue';
import { validateAll, isEmpty, WidgetDefinition } from '@/jsHelper/forms';

interface FormData {
  username: string,
  token: string,
  newPassword: string,
  newPassword2: string,
}

interface Data {
  formValues: FormData,
  formWidgets: WidgetDefinition[],
  usernameGiven: boolean,
  tokenGiven: boolean,
}

export default defineComponent({
  name: 'NewPassword',
  components: {
    MyForm,
    Site,
  },
  data(): Data {
    const formWidgets: WidgetDefinition[] = [{
      type: 'TextBox',
      name: 'username',
      label: _('Username'),
      readonly: false, // TODO
      invalidMessage: '',
      required: true,
    }, {
      type: 'TextBox',
      name: 'token',
      label: _('Token'),
      readonly: false, // TODO
      invalidMessage: '',
      required: true,
    }, {
      type: 'PasswordBox',
      name: 'newPassword',
      label: _('New password'),
      invalidMessage: '',
      required: true,
    }, {
      type: 'PasswordBox',
      name: 'newPassword2',
      label: _('New password (retype)'),
      validators: [(widget, value) => (
        isEmpty(widget, value) ? _('Please confirm your new password') : ''
      ), (widget, value) => {
        // @ts-ignore TODO
        if (this.formValues.newPassword !== value) {
          return _('The new passwords do not match');
        }
        return '';
      }],
    }];
    return {
      formValues: {
        username: '',
        token: '',
        newPassword: '',
        newPassword2: '',
      },
      formWidgets,
      usernameGiven: false,
      tokenGiven: false,
    };
  },
  computed: {
    TITLE(): string {
      return _('Set new password');
    },
    SUBTITLE(): string {
      return '';
    },
    SUBMIT_LABEL(): string {
      return _('Change password');
    },
    form(): typeof MyForm {
      return this.$refs.form as typeof MyForm;
    },
  },
  mounted() {
    setTimeout(() => {
      if (typeof this.$route.query.username === 'string' && this.$route.query.username) {
        this.formValues.username = this.$route.query.username;
        this.usernameGiven = true;
      }
      if (typeof this.$route.query.token === 'string' && this.$route.query.token) {
        this.formValues.token = this.$route.query.token;
        this.tokenGiven = true;
      }
      setTimeout(() => {
        this.form.focusFirstInteractable();
      }, 300); // TODO...
    }, 300); // TODO...
  },
  methods: {
    submit() {
      if (!validateAll(this.formWidgets, this.formValues)) {
        this.form.focusFirstInvalid();
        return;
      }
      const params = {
        username: this.formValues.username,
        token: this.formValues.token,
        password: this.formValues.newPassword,
      };
      this.$store.dispatch('activateLoadingState');
      umcCommand('passwordreset/set_password', params)
        .then(() => {
          this.$store.dispatch('notifications/addSuccessNotification', {
            title: _('Token sent'),
            description: _('Successfully sent Token.'),
          });
        })
        .catch((error) => {
          this.$store.dispatch('notifications/addErrorNotification', {
            title: _('Failed to send token'),
            description: error.message,
          });
        })
        .finally(() => {
          this.$store.dispatch('deactivateLoadingState');
        });
    },
  },
});
</script>
