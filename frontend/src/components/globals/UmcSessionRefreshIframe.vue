<!--
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
  <iframe
    v-if="refreshNeeded"
    src="/univention/saml/iframe/"
    title="UMC session refresh iframe"
    style="position: absolute; width: 0; height: 0; border: 0"
    @load="onLoad"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import { login } from '@/jsHelper/login';
import { getResultFromIframe } from './UmcSessionRefreshIframe.utils';

export default defineComponent({
  name: 'UmcSessionRefreshIframe',
  data() {
    return {
      onLoadCounter: 0,
    };
  },
  computed: {
    ...mapGetters({
      refreshNeeded: 'umcSession/refreshNeeded',
      user: 'user/userState',
    }),
  },
  beforeUpdate() {
    if (!this.refreshNeeded) {
      this.onLoadCounter = 0;
    }
  },
  methods: {
    onLoad() {
      this.onLoadCounter += 1;
      if (this.onLoadCounter === 2) {
        this.handleRefreshResult();
      }
    },

    handleRefreshResult() {
      const result = getResultFromIframe(this.$el);
      if (result?.status === 200) {
        this.$store.dispatch('umcSession/restartSessionRefresh');
      } else {
        this.$store.dispatch('umcSession/disableSessionRefresh');

        // If this is a SAML NoPassive error, user is logged out - redirect to login
        if (result?.isSamlNoPassiveError) {
          login(this.user);
        }
      }
    },
  },
});

</script>

<style lang="stylus">
</style>
