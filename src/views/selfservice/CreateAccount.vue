<template>
  <site
    :title="TITLE"
    :ucr-var-for-frontend-enabling="'umc/self-service/account-registration/frontend/enabled'"
  >
    <div>Create account</div>
  </site>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import _ from '@/jsHelper/translate';

import Site from '@/views/selfservice/Site.vue';

export default defineComponent({
  name: 'CreateAccount',
  components: {
    Site,
  },
  computed: {
    TITLE(): string {
      return _('Create an account');
    },
  },
});
</script>
