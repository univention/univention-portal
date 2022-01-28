<template>
  <guarded-site
    :title="TITLE"
    :subtitle="SUBTITLE"
    :ucr-var-for-frontend-enabling="'umc/self-service/protect-account/frontend/enabled'"
    path="passwordreset/get_contact"
    :guarded-widgets="widgets"
    @loaded="loaded"
    @save="setContactInfo"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { umcCommandWithStandby } from '@/jsHelper/umc';
import _ from '@/jsHelper/translate';
import GuardedSite from '@/views/selfservice/GuardedSite.vue';
import { WidgetDefinition } from '@/jsHelper/forms';

interface ContactInfo {
  id: string,
  label: string,
  value: string,
}

interface Data {
  contactInformation: ContactInfo[],
}

export default defineComponent({
  name: 'ProtectAccount',
  components: {
    GuardedSite,
  },
  data(): Data {
    return {
      contactInformation: [],
    };
  },
  computed: {
    TITLE(): string {
      return _('Protect account');
    },
    SUBTITLE(): string {
      return _('Everyone forgets his password now and then. Protect yourself and activate the opportunity to set a new password.');
    },
    widgets(): WidgetDefinition[] {
      return this.contactInformation.map((info) => ({
        type: 'TextBox',
        name: info.id,
        label: info.label,
        invalidMessage: '',
        required: true,
      }));
    },
  },
  methods: {
    loaded(result: ContactInfo[], formValues) {
      this.contactInformation = result;
      this.contactInformation.forEach((info) => {
        formValues[info.id] = info.value;
      });
    },
    setContactInfo(values) {
      umcCommandWithStandby(this.$store, 'passwordreset/set_contact', values)
        .then((result) => {
          let description = _('Your contact data has been successfully changed.');
          if (result.verificationEmailSend) {
            description = `${description}. ${_('Your account has to be verified again after changing your email. We have sent you an email to %(email)s. Please follow the instructions in the email to verify your account.', { email: result.email })}`;
          }
          this.$store.dispatch('notifications/addSuccessNotification', {
            title: _('Save successful'),
            description,
          });
          this.$router.push({ name: 'portal' });
        })
        .catch((error) => {
          this.$store.dispatch('notifications/addErrorNotification', {
            title: _('Failed to save'),
            description: error.message,
          });
        });
    },
  },
});
</script>
