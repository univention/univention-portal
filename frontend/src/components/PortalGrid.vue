<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025 Univention GmbH
-->

<template>
  <template v-if="showNewsfeed && !editMode">
    <div class="portal-grid">
      <div class="portal-grid__row portal-grid__row--1col">
        <portal-greeting />
      </div>
      <div class="portal-grid__row portal-grid__row--2col">
        <div class="portal-grid__col">
          <slot />
        </div>
        <div class="portal-grid__col">
          <nubus-portal-newsfeed />
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="portal-grid--monocolumn">
      <portal-greeting />
      <slot />
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import PortalGreeting from '@/components/globals/PortalGreeting.vue';
import NubusPortalNewsfeed from '@/components/newsfeed/NubusPortalNewsfeed.vue';

export default defineComponent({
  name: 'PortalGrid',
  components: {
    PortalGreeting,
    NubusPortalNewsfeed,
  },
  computed: {
    ...mapGetters({
      editMode: 'portalData/editMode',
      featureToggles: 'featureToggles/featureToggles',
      portalNewsfeedConfig: 'portalData/portalNewsfeedConfig',
    }),
    showNewsfeed(): boolean {
      if (this.featureToggles.newsfeed) {
        if (this.portalNewsfeedConfig) {
          console.info('Feature newsfeed activated and configured.');
          return true;
        }
        console.info('Feature newsfeed activated but is missing configuration.');
        return false;
      }
      console.info('Feature newsfeed disabled.');
      return false;
    },
  },
});
</script>

<style lang="stylus">
.portal-grid
  --portal-grid-col-width: calc(73 * var(--layout-spacing-unit))
  --portal-grid-gap-width: calc(8.5 * var(--layout-spacing-unit))
  --portal-grid-max-width: calc(2 * var(--portal-grid-col-width) + var(--portal-grid-gap-width))

  margin: calc(6 * var(--layout-spacing-unit)) 0
  @media $mqSmartphone
    margin: calc(2 * var(--layout-spacing-unit))

  &--monocolumn
    margin: 0 auto
    position: relative
    padding: calc(6 * var(--layout-spacing-unit))
    @media $mqSmartphone
      padding: calc(2 * var(--layout-spacing-unit))

  &__row
    display: grid
    position: relative
    justify-content: center
    &--1col
      grid-template-columns: var(--portal-grid-max-width)
    &--2col
      grid-gap: var(--portal-grid-gap-width)
      grid-template-columns: repeat(2, var(--portal-grid-col-width))
    &--1col,
    &--2col
      @media only screen and (max-width: 1300px)
        grid-template-columns: var(--portal-grid-col-width)
      @media $mqSmartphone
        grid-template-columns: 1fr
</style>
