<template>
  <site
    :title="TITLE"
    :ucr-var-for-frontend-enabling="'umc/self-service/account-verification/frontend/enabled'"
  >
    <div>Verify account</div>
  </site>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import _ from '@/jsHelper/translate';

import Site from '@/views/selfservice/Site.vue';

export default defineComponent({
  name: 'VerifyAccount',
  components: {
    Site,
  },
  computed: {
    TITLE(): string {
      return _('Account verification');
    },
  },
});
</script>
