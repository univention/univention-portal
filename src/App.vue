<template>
  <portal />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Portal from '@/views/Portal.vue';
import { login } from '@/jsHelper/login';
import { catalog } from '@/i18n/translations';
import { mapGetters } from 'vuex';
import { Locale } from './store/models';

const defaultPortalLocale: Locale = process.env.VUE_APP_LOCALE || 'en_US';

export default defineComponent({
  name: 'App',
  components: {
    Portal,
  },
  computed: {
    ...mapGetters({
      bubbleContent: 'notificationBubble/bubbleContent',
    }),
  },
  async mounted() {
    this.$store.dispatch('modal/setShowLoadingModal');
    await this.$store.dispatch('locale/setLocale', defaultPortalLocale);

    const PortalData = await this.$store.dispatch('loadPortal');
    this.$store.dispatch('modal/setHideModal');

    if (!PortalData.user) {
      this.$store.dispatch('notificationBubble/addNotification', {
        bubbleTitle: catalog.LOGIN.translated.value,
        bubbleDescription: catalog.LOGIN_REMINDER_DESCRIPTION.translated.value,
        onClick: () => login(this.$store.getters['user/userState']),
      });
    }
    setTimeout(() => {
      // Hide notification bubble
      this.$store.dispatch('notificationBubble/setHideNewBubble');
    }, 4000);
  },
});
</script>
