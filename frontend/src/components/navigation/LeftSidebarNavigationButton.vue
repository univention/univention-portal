<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025 Univention GmbH
-->

<template>
  <tabindex-element
    id="left-sidebar-navigation-button"
    tag="button"
    :active-at="['portal']"
    class="left-sidebar-navigation"
    type="button"
    aria-label="Open sidebar navigation"
    @click="toggleSidebar"
  >
    <waffle-icon dot-color="inherit" />
  </tabindex-element>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import TabindexElement from '@/components/activity/TabindexElement.vue';
import WaffleIcon from '../header/WaffleIcon.vue';

export default defineComponent({
  name: 'LeftSidebarNavigationButton',
  components: {
    WaffleIcon,
    TabindexElement,
  },
  computed: {
    ...mapGetters({
      activeButton: 'navigation/getActiveButton',
      currentLocale: 'locale/getLocale',
    }),
    isMenuActive(): boolean {
      return this.activeButton === 'left-menu';
    },
  },
  watch: {
    currentLocale(newLocale: string, oldLocale: string): void {
      if (newLocale && newLocale !== oldLocale) {
        this.$store.dispatch('portalData/loadNavigation');
      }
    },
  },
  methods: {
    toggleSidebar(): void {
      if (this.isMenuActive) {
        this.$store.dispatch('navigation/setActiveButton', '');
      } else {
        this.$store.dispatch('navigation/setActiveButton', 'left-menu');
      }
    },
  },
});
</script>

<style lang="stylus">
.left-sidebar-navigation
  display: flex
  align-items: center
  justify-content: center
  left: 0
  top: 0
  width: calc(var(--waffle-icon-height) + 0.5rem)
  height: calc(var(--waffle-icon-height))
  flex-shrink: 0
  background: var(--waffle-icon-background-color, var(--button-bgc))
  border-radius: 0

  @media $mqSmartphone
    width: 50px
    height: 50px

  &:hover,
  &:focus
    outline: none
    background-color: var(--color-accent)

    & .waffle-dots
      fill: var(--bgc-content-body)
</style>
