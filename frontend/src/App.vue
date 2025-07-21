<!--
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
-->
<template>
  <cookie-banner
    v-if="showCookieBanner"
    @dismissed="hideCookieBanner"
  />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CookieBanner from '@/components/globals/CookieBanner.vue';

import { isTrue } from '@/jsHelper/ucr';
import { getCookie } from '@/jsHelper/tools';
import { login } from '@/jsHelper/login';
import { mapGetters } from 'vuex';

interface AppData {
  cookieBannerDismissed: boolean,
}

export default defineComponent({
  name: 'App',
  components: {
    CookieBanner,
  },
  data(): AppData {
    return {
      cookieBannerDismissed: false,
    };
  },
  computed: {
    ...mapGetters({
      userState: 'user/userState',
      metaData: 'metaData/getMeta',
      featureToggles: 'featureToggles/featureToggles',
    }),
    showCookieBanner(): boolean {
      const cookieName = this.metaData.cookieBanner.cookie || 'univentionCookieSettingsAccepted';
      let domainShouldShowBanner = true;
      if (this.metaData.cookieBanner.domains.length > 0) {
        domainShouldShowBanner = false;
        this.metaData.cookieBanner.domains.forEach((dom) => {
          if (document.domain.endsWith(dom)) {
            domainShouldShowBanner = true;
          }
        });
      }
      return this.metaData.cookieBanner.show && domainShouldShowBanner && !getCookie(cookieName) && !this.cookieBannerDismissed;
    },
  },
  async mounted() {
    // Set locale and load portal data from backend
    this.$store.dispatch('activateLoadingState');
    await this.$store.dispatch('loadPortal', {
      adminMode: false,
    });

    if (this.metaData.title) {
      document.title = this.metaData.title;
    }
    if (this.metaData.favicon) {
      this.setFavicon(this.metaData.favicon);
    }

    const shouldRedirectToLogin = await this.$store.dispatch('shouldRedirectToLogin');
    if (shouldRedirectToLogin && !this.$route.name?.toString().startsWith('selfservice')) {
      login(this.userState);
    }

    if (this.featureToggles.centered_layout) {
      console.info('Feature centered layout activated.');
      this.loadCenteredLayoutCss();
    } else {
      console.info('Feature centered layout disabled.');
    }

    this.$store.dispatch('deactivateLoadingState');

    if (!!window.SharedWorker && isTrue(this.metaData['portal/reload-tabs-on-logout']) && this.userState.username) {
      const worker = new SharedWorker('/univention/portal/sse-worker.js');
      worker.port.start();
      worker.port.onmessage = (event) => {
        if (event.data === 'logout') {
          window.location.reload();
        }
      };
    }
  },
  methods: {
    hideCookieBanner(): void {
      this.cookieBannerDismissed = true;
    },
    setFavicon(href): void {
      const icon = (document.querySelector('link[rel="shortcut icon"]') || document.querySelector('link[rel="icon"]')) as HTMLLinkElement | null;
      if (icon) {
        icon.href = href;
      }
    },
    loadCenteredLayoutCss(): void {
      const centeredLayoutCss = document.createElement('link');
      centeredLayoutCss.rel = 'stylesheet';
      centeredLayoutCss.href = './css/centered-layout.css';
      document.head.appendChild(centeredLayoutCss);
    },
  },
});
</script>

<style lang=stylus>
*
  ::-webkit-scrollbar
    width: 0.25rem
  ::-webkit-scrollbar-track
    background: var(--portal-scrollbar-background)
  ::-webkit-scrollbar-thumb
    background: var(--font-color-contrast-low)
    border-radius: 2rem
  ::-webkit-scrollbar-thumb:hover
    background: var(--font-color-contrast-middle)
</style>
