<template>
  <site
    :title="TITLE"
    subtitle=""
    :ucr-var-for-frontend-enabling="'umc/self-service/account-verification/frontend/enabled'"
  >
    <my-form
      ref="form"
      v-model="formValues"
      :widgets="formWidgets"
    >
      <footer>
        <button
          v-if="formValues.token"
          type="submit"
          class="primary"
          @click.prevent="verifyAccount"
        >
          {{ VERIFY_ACCOUNT }}
        </button>
        <button
          v-else
          type="submit"
          @click.prevent="requestNewToken"
        >
          {{ REQUEST_NEW_TOKEN }}
        </button>
      </footer>
    </my-form>
  </site>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import _ from '@/jsHelper/translate';

import Site from '@/views/selfservice/Site.vue';
import { validateAll, WidgetDefinition } from '@/jsHelper/forms';
import { umcCommandWithStandby } from '@/jsHelper/umc';
import MyForm from '@/components/forms/Form.vue';

interface FormData {
  username: string,
  token: string,
}

interface Data {
  formValues: FormData,
  formWidgets: WidgetDefinition[],
  failType: string,
  successType: string,
}

export default defineComponent({
  name: 'VerifyAccount',
  components: {
    Site,
    MyForm,
  },
  data(): Data {
    return {
      formValues: {
        username: '',
        token: '',
      },
      failType: '',
      successType: '',
      formWidgets: [{
        type: 'TextBox',
        name: 'username',
        label: _('Username'),
        invalidMessage: '',
        required: true,
      }, {
        type: 'TextBox',
        name: 'token',
        label: _('Token'),
        invalidMessage: '',
        required: false,
      }],
    };
  },
  computed: {
    TITLE(): string {
      return _('Account verification');
    },
    REQUEST_NEW_TOKEN(): string {
      return _('Request new token');
    },
    VERIFY_ACCOUNT(): string {
      return _('Verify account');
    },
    form(): typeof MyForm {
      return this.$refs.form as typeof MyForm;
    },
  },
  mounted() {
    setTimeout(() => {
      if (typeof this.$route.query.username === 'string' && this.$route.query.username) {
        this.formValues.username = this.$route.query.username;
      }
      if (typeof this.$route.query.token === 'string' && this.$route.query.token) {
        this.formValues.token = this.$route.query.token;
      }
    }, 300); // TODO...
  },
  methods: {
    requestNewToken() {
      if (!validateAll(this.formWidgets, this.formValues)) {
        this.form.focusFirstInvalid();
        return;
      }
      umcCommandWithStandby(this.$store, 'passwordreset/send_verification_token', {
        username: this.formValues.username,
      })
        .then((result) => {
          if (result.success) {
            this.$store.dispatch('notifications/addSuccessNotification', {
              title: _('Hello, %(username)s', { username: result.data.username }),
              description: _('We have sent you an email to your registered address. Please follow the instructions in the email to verify your account.'),
            });
          } else if (result.failType === 'INVALID_INFORMATION') {
            this.$store.dispatch('notifications/addErrorNotification', {
              title: _('Sending token failed'),
              description: _('The verification token could not be sent. Please verify your input.'),
            });
          }
        })
        .catch((error) => {
          this.$store.dispatch('notifications/addErrorNotification', {
            title: _('Sending token failed'),
            description: error.message,
          });
        });
    },
    verifyAccount() {
      if (!validateAll(this.formWidgets, this.formValues)) {
        this.form.focusFirstInvalid();
        return;
      }
      umcCommandWithStandby(this.$store, 'passwordreset/verify_contact', {
        username: this.formValues.username,
        token: this.formValues.token,
        method: 'verify_email',
      })
        .then((result) => {
          if (result.successType === 'VERIFIED') {
            this.$store.dispatch('notifications/addSuccessNotification', {
              title: _('Welcome, %(username)s', { username: result.data.username }),
              description: _('Your account has been successfully verified.'),
            });
            this.$router.push({ name: 'portal' });
          } else if (result.successType === 'ALREADY_VERIFIED') {
            this.$store.dispatch('notifications/addSuccessNotification', {
              title: _('Welcome, %(username)s', { username: result.data.username }),
              description: _('Your account has already been verified.'),
            });
            this.$router.push({ name: 'portal' });
          } else if (result.failType === 'INVALID_INFORMATION') {
            this.$store.dispatch('notifications/addErrorNotification', {
              title: _('Verification failed'),
              description: _('The account could not be verified. Please verify your input.'),
            });
            this.formValues.token = '';
          }
        })
        .catch((error) => {
          this.$store.dispatch('notifications/addErrorNotification', {
            title: _('Verification failed'),
            description: error.message,
          });
          this.formValues.token = '';
        });
    },
  },
});
</script>
