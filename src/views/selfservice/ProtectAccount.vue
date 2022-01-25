<template>
  <guarded-site
    :title="TITLE"
    :subtitle="SUBTITLE"
    :ucr-var-for-frontend-enabling="'umc/self-service/protect-account/frontend/enabled'"
    path="passwordreset/get_contact"
    @loaded="loaded"
    @save="setContactInfo"
  >
    <label
      v-for="info in contactInformation"
      :key="info.id"
    >
      {{ info.label }}
      <input
        v-model="info.value"
        :name="info.id"
      >
    </label>
  </guarded-site>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import { umcCommand } from '@/jsHelper/umc';
import _ from '@/jsHelper/translate';
import GuardedSite from '@/views/selfservice/GuardedSite.vue';
import { allValid, initialValue, validateAll } from '@/jsHelper/forms';

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
  },
  methods: {
    loaded(result: ContactInfo[]) {
      console.log(result);
      this.contactInformation = result;
    },
    setContactInfo(username: string, password: string) {
      this.$store.dispatch('activateLoadingState');
      const params = {
        username,
        password,
      };
      this.contactInformation.forEach((info) => {
        params[info.id] = info.value;
      });
      umcCommand('passwordreset/set_contact', params)
        .then((result) => {
          console.log(result);
          this.$store.dispatch('notifications/addSuccessNotification', {
            title: _('Save successful'),
            description: _('Your contact data was successfully changed.'),
          });
        })
        .catch((error) => {
          console.log(error);
          this.$store.dispatch('notifications/addErrorNotification', {
            title: _('Failed to save'),
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
