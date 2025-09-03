<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025 Univention GmbH
-->

<template>
  <template v-if="icsSilentLoginUrl">
    <iframe
      :src="icsSilentLoginUrl"
      title="ICS silent login"
      style="position: absolute; width: 0; height: 0; border: 0"
      @load="onSilentLoad"
    />
    <newsfeed
      v-if="silentLoadingDone"
      :feed-url="feedUrl"
      :feed-type="feedType"
      :home-url="homeUrl"
      :with-credentials="true"
    />
  </template>
  <template v-else>
    <newsfeed
      :feed-url="feedUrl"
      :feed-type="feedType"
      :home-url="homeUrl"
      :with-credentials="false"
    />
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import Newsfeed from './Newsfeed.vue';
import { NewsfeedType } from './types';

interface NubusPortalNewsfeedData {
  silentLoadingDone: boolean;
}

export default defineComponent({
  name: 'NubusPortalNewsfeed',
  components: {
    Newsfeed,
  },
  data(): NubusPortalNewsfeedData {
    return {
      silentLoadingDone: false,
    };
  },
  computed: {
    ...mapGetters({
      portalNewsfeedConfig: 'portalData/portalNewsfeedConfig',
    }),
    feedUrl(): string {
      return this.$localized(this.portalNewsfeedConfig.feedUrl);
    },
    homeUrl(): string {
      return this.$localized(this.portalNewsfeedConfig.homeUrl);
    },
    feedType(): NewsfeedType {
      return this.portalNewsfeedConfig.feedType;
    },
    icsSilentLoginUrl(): string | null {
      return this.portalNewsfeedConfig.icsSilentLoginUrl;
    },
  },
  beforeMount() {
    window.addEventListener('message', this.messageListener);
  },
  unmounted() {
    window.removeEventListener('message', this.messageListener);
  },
  methods: {
    onSilentLoad() {
      this.silentLoadingDone = true;
    },
    messageListener(event) {
      if (event.origin !== '*') {
        return; // Ignore messages from unknown origins
      }
      console.log('Message received from iframe:', event);
    },
  },
});
</script>

<style lang="stylus">
</style>
