<template>
  <guarded-site
    :title="TITLE"
    :subtitle="SUBTITLE"
    :ucr-var-for-frontend-enabling="'umc/self-service/passwordreset/frontend/enabled'"
    path="passwordreset/get_reset_methods"
    :password-needed="false"
    :guarded-widgets="widgets"
    @loaded="loaded"
    @save="sendToken"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { umcCommand } from '@/jsHelper/umc';
import _ from '@/jsHelper/translate';
import GuardedSite from '@/views/selfservice/GuardedSite.vue';
import { WidgetDefinition } from '@/jsHelper/forms';

interface MethodInfo {
  id: string,
  label: string,
}

interface Data {
  methodInformation: MethodInfo[],
}

export default defineComponent({
  name: 'PasswordForgotten',
  components: {
    GuardedSite,
  },
  data(): Data {
    return {
      methodInformation: [],
    };
  },
  computed: {
    TITLE(): string {
      return _('Password forgotten');
    },
    SUBTITLE(): string {
      return _('Forgot your password? Set a new one:');
    },
    widgets(): WidgetDefinition[] {
      return [{
        type: 'RadioBox',
        name: 'method',
        options: this.methodInformation,
        label: _('Please choose an option to renew your password.'),
        invalidMessage: '',
        required: true,
      }];
    },
  },
  methods: {
    loaded(result: MethodInfo[], formValues) {
      console.log(result);
      this.methodInformation = result;
      formValues.method = '';
      if (result.length) {
        formValues.method = result[0].id;
      }
    },
    sendToken(values) {
      this.$store.dispatch('activateLoadingState');
      umcCommand('passwordreset/send_token', values)
        .then(() => {
          this.$store.dispatch('notifications/addSuccessNotification', {
            title: _('Token sent'),
            description: _('Successfully sent Token.'),
          });
          this.$router.push({ name: 'selfserviceNewPassword', params: { username: values.username } });
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
