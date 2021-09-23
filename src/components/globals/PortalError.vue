<template>
  <main class="portal-error">
    <h1> {{ ERROR_MESSAGE }} </h1>
    <p> {{ ERROR_SUBTEXT }} </p>
  </main>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import _ from '@/jsHelper/translate';

export default defineComponent({
  name: 'Portalerror',
  computed: {
    ...mapGetters({
      errorContentType: 'portalData/errorContentType',
    }),
    ERROR_MESSAGE(): string {
      return _('Something is wrong.');
    },
    ERROR_SUBTEXT(): string {
      if (this.errorContentType === 404) {
        return _('Something went wrong with connecting to the portal. We are trying to fix it soon.');
      }
      return '';
    },
  },
});
</script>
<style lang="stylus">
.portal-error
  display: flex
  flex-direction: column
  margin-left: 5em

  @media $mqSmartphone
    margin-left: 1em
</style>
