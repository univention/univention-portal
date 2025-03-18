<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025 Univention GmbH
-->

<template>
  <template v-if="showWelcomeMessage && userFirstname.length > 0">
    <div class="portal-greeting">
      <h2 class="portal-greeting__headline">
        {{ salutation }}<span>,</span>
        <span class="portal-greeting__name"><br> {{ userFirstname }}.</span>
      </h2>
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import _ from '@/jsHelper/translate';

export default defineComponent({
  name: 'PortalGreeting',
  computed: {
    ...mapGetters({
      userState: 'user/userState',
      currentLocale: 'locale/getLocale',
      featureToggles: 'featureToggles/featureToggles',
    }),
    showWelcomeMessage(): boolean {
      if (this.featureToggles.welcome_message) {
        console.info('Feature welcome message activated.');
        return true;
      }
      console.info('Feature welcome message disabled.');
      return false;
    },
    userFirstname(): string {
      return this.userState.firstname ?? this.userState.displayName ?? '';
    },
    salutation(): string {
      const hours = new Date().getHours();
      if (hours >= 5 && hours < 12) {
        return _('Good Morning');
      }
      if (hours > 17 && hours <= 22) {
        return _('Good evening');
      }
      if (hours > 22 && hours < 5) {
        return _('Hello');
      }
      if (this.currentLocale.startsWith('en_')) {
        if (hours >= 12 && hours <= 17) {
          return _('Good afternoon');
        }
      }
      if (this.currentLocale.startsWith('de_')) {
        if (hours >= 12 && hours <= 13) {
          return _('Good lunch time');
        }
        if (hours > 13 && hours <= 17) {
          return _('Good afternoon');
        }
      }
      return _('Hello');
    },
  },
});
</script>

<style lang="stylus">
.portal-greeting
  margin-bottom: calc(var(--layout-spacing-unit) * 6)

  &__headline
    font-size: 2.25rem
    font-style: normal
    font-weight: 700
    line-height: 1.2
    margin: 0

  &__name
    text-transform: capitalize
</style>
