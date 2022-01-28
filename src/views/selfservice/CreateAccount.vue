<template>
  <site
    :title="TITLE"
    subtitle=""
    :ucr-var-for-frontend-enabling="'umc/self-service/account-registration/frontend/enabled'"
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
import _ from '@/jsHelper/translate';

import { umcCommandWithStandby } from '@/jsHelper/umc';
import Site from '@/views/selfservice/Site.vue';
import MyForm from '@/components/forms/Form.vue';
import { validateAll, WidgetDefinition } from '@/jsHelper/forms';

interface Data {
  formValues: Record<string, string>,
  formWidgets: WidgetDefinition[],
}

export default defineComponent({
  name: 'CreateAccount',
  components: {
    Site,
    MyForm,
  },
  data(): Data {
    return {
      formValues: {},
      formWidgets: [],
    };
  },
  computed: {
    TITLE(): string {
      return _('Create an account');
    },
    SUBMIT_LABEL(): string {
      return this.TITLE;
    },
    form(): typeof MyForm {
      return this.$refs.form as typeof MyForm;
    },
  },
  mounted() {
    umcCommandWithStandby(this.$store, 'passwordreset/get_registration_attributes')
      .then((result) => {
        result.layout.forEach((name) => {
          result.widget_descriptions.forEach((widget) => {
            if (widget.id !== name) {
              return;
            }
            this.formValues[widget.id] = '';
            this.formWidgets.push({
              type: widget.type === 'PasswordInputBox' ? 'PasswordBox' : widget.type,
              name: widget.id,
              label: widget.label,
              invalidMessage: '',
              required: widget.required,
            });
          });
        });
      });
  },
  methods: {
    submit() {
      if (!validateAll(this.formWidgets, this.formValues)) {
        this.form.focusFirstInvalid();
        return;
      }
      console.log(this.formValues);
      umcCommandWithStandby(this.$store, 'passwordreset/create_self_registered_account', {
        attributes: this.formValues,
      })
        .then((result) => {
          if (result.success) {
            if (result.verifyTokenSuccessfullySend) {
              this.$store.dispatch('notifications/addSuccessNotification', {
                title: _('Hello, %(username)s', { username: result.data.username }),
                description: _('We have sent you an email to %(email)s. Please follow the instructions in the email to verify your account.', { email: result.data.email }),
              });
              this.$router.push({ name: 'selfserviceVerifyAccount', query: { username: result.data.username } });
            } else {
              this.$store.dispatch('notifications/addErrorNotification', {
                title: _('Hello, %(username)s', { username: result.data.username }),
                description: _('An error occurred while sending the verification token for your account. Please request a new one.'),
              });
              this.$router.push({ name: 'selfserviceVerifyAccount', query: { username: result.data.username } });
            }
          } else if (result.failType === 'INVALID_ATTRIBUTES') {
            Object.entries(result.data).forEach(([name, info]: [string, any]) => {
              if (info.isValid) {
                return;
              }
              this.formWidgets.forEach((widget) => {
                if ((widget.name) !== name) {
                  return;
                }
                widget.invalidMessage = info.message;
              });
            });
          } else if (result.failType === 'CREATION_FAILED') {
            this.$store.dispatch('notifications/addErrorNotification', {
              title: _('Creating a new user failed.'),
              description: result.data,
            });
          }
        });
    },
  },
});
</script>
