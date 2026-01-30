<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025-2026 Univention GmbH
-->

<template>
  <region
    id="portal-left-sidenavigation"
    role="navigation"
    direction="topdown"
    class="portal-left-sidenavigation"
  >
    <div class="portal-left-sidenavigation__header">
      <portal-title @keydown="handleArrowKeys" />
      <div
        role="button"
        tabindex="0"
        class="portal-left-sidenavigation__close-button"
        @click="closeNavigation"
        @keydown.enter="closeNavigation"
        @keydown="handleArrowKeys"
      >
        <portal-icon icon="x" />
      </div>
    </div>
    <div
      v-for="category in menuCategoriesWithEntries"
      :key="category.identifier"
      class="portal-left-sidenavigation__category"
      data-test="sidebar-category"
    >
      <div
        class="portal-left-sidenavigation__category-name"
        data-test="sidebar-category-name"
      >
        {{ category.display_name }}
      </div>
      <ul
        v-if="category.entries.length > 0"
        class="portal-left-sidenavigation__category-entries"
      >
        <li
          v-for="entry in category.entries"
          :key="entry.identifier"
          class="portal-left-sidenavigation__category-entry"
        >
          <a
            :href="getItemLink(entry)"
            :target="getItemTarget(entry)"
            class="portal-left-sidenavigation__link"
            @keydown="handleArrowKeys"
          >
            <img
              v-if="entry.icon_url"
              :src="entry.icon_url"
              :alt="getItemName(entry)"
              class="portal-left-sidenavigation__icon"
            >
            <span class="portal-left-sidenavigation__text">
              {{ getItemName(entry) }}
            </span>
          </a>
        </li>
      </ul>
    </div>
  </region>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import Region from '@/components/activity/Region.vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';
import PortalTitle from '@/components/header/PortalTitle.vue';
import { NavigationCategory, NavigationData, NavigationEntry } from '@/store/modules/portalData/portalData.models';

interface SideNavigationData {
  menuVisible: boolean,
  menuParent: number,
  init: boolean,
  fade: boolean,
  fadeRightLeft: string,
  fadeLeftRight: string,
}

export default defineComponent({
  name: 'LeftSideNavigation',
  components: {
    Region,
    PortalTitle,
    PortalIcon,
  },
  data(): SideNavigationData {
    return {
      menuVisible: true,
      menuParent: -1,
      init: true,
      fade: false,
      fadeLeftRight: 'portal-sidenavigation__fade-left-right',
      fadeRightLeft: 'portal-sidenavigation__fade-right-left',
    };
  },
  computed: {
    ...mapGetters({
      leftSidebarItems: 'portalData/leftSidebarItems',
      currentLocale: 'locale/getLocale',
    }),
    menuCategoriesWithEntries(): NavigationCategory[] {
      const items = this.leftSidebarItems as NavigationData;
      if (!items || !items.categories || !Array.isArray(items.categories)) {
        return [];
      }
      return items.categories;
    },
  },
  created() {
    this.$store.dispatch('modal/disableBodyScrolling');
  },
  mounted(): void {
    this.$store.dispatch('activity/setRegion', 'portal-sidenavigation');
    // Add Esc key listener
    document.addEventListener('keydown', this.handleEscapeKey);
  },
  beforeUnmount(): void {
    // Remove Esc key listener
    document.removeEventListener('keydown', this.handleEscapeKey);
  },
  methods: {
    handleEscapeKey(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        this.closeNavigation();
      }
    },
    handleArrowKeys(event: KeyboardEvent): void {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();

        // Get all focusable elements in the sidebar
        const focusableElements = this.$el.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        const focusArray = Array.from(focusableElements) as HTMLElement[];
        const currentIndex = focusArray.indexOf(event.target as HTMLElement);

        if (currentIndex !== -1) {
          let nextIndex;
          if (event.key === 'ArrowDown') {
            nextIndex = currentIndex + 1;
            if (nextIndex >= focusArray.length) {
              nextIndex = 0; // Wrap to first element
            }
          } else { // ArrowUp
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
              nextIndex = focusArray.length - 1; // Wrap to last element
            }
          }

          focusArray[nextIndex].focus();
        }
      }
    },
    closeNavigation(): void {
      this.$store.dispatch('navigation/setActiveButton', '');
      this.$store.dispatch('activity/setRegion', 'portal-header');
    },
    setFadeClass(): string {
      let ret = '';
      if (!this.init) {
        if (!this.fade) {
          ret = this.fadeRightLeft;
        } else {
          ret = this.fadeLeftRight;
        }
      }
      return ret;
    },
    getItemName(item: NavigationEntry): string {
      return item.display_name || '';
    },
    getItemLink(item: NavigationEntry): string {
      return item.link || '#';
    },
    getItemTarget(item: NavigationEntry): string {
      return item.target || '_blank';
    },
  },
});
</script>

<style lang="stylus">
$userRow = 6rem
.portal-left-sidenavigation
  height: 100%
  display: flex
  flex-direction: column
  padding: 1rem
  border-radius: var(--left-sidenavigation-border-radius)
  box-shadow: var(--left-sidenav-box-shadow);

  &__header
    display: flex
    align-items: center
    justify-content: space-between
    height: var(--portal-header-height)
    color: var(--font-color-contrast-high)
    margin: 0 0 1rem 0

  &__close-button
    background-color: none;
    border: none;
    cursor: pointer;
    border-radius: var(--left-sidenavigation-close-button-radius)
    padding: var(--layout-spacing-unit)
    width: 2rem
    height: 2rem
    display: flex
    align-items: center
    justify-content: center
    box-sizing: content-box

    &:hover
      background-color: var(--left-sidenavigation-hover-bg-color, var(--bgc-underlay))
      cursor: pointer

    &:focus-visible
      outline:2px solid var(--color-focus);
      outline-offset: var(--left-sidenavigation-outline-offset, -0.5rem)

  &__category-name
    font-size: 0.8rem
    font-weight: 600
    padding: calc(1.5 * var(--layout-spacing-unit)) 0.5rem 0
    color: var(--color-text)

  &__link
    padding-right: calc(1.5 * var(--layout-spacing-unit))

  &__category-entries
    flex: 1 1 auto
    overflow-y: auto
    overflow-x: hidden
    padding: 0
    list-style: none
    margin: 0

  &__link
    padding: calc(0.5rem)
    position: relative
    display: flex
    align-items: center
    text-decoration: none
    color: var(--color-text)
    transition: background-color 0.2s ease
    border-radius: calc(0.8 * var(--layout-spacing-unit))

    &:hover
      background-color: var(--left-sidenavigation-hover-bg-color, var(--bgc-underlay))

    &:focus-visible
      outline: 2px solid var(--color-focus)
      outline-offset: -2px

    &:active
      background-color: var(--left-sidenavigation-active-bg-color, darken(#000000FF, 50%))

  &__icon
    width: 2rem
    height: 2rem
    margin-right: calc(1.5 * var(--layout-spacing-unit))
    flex-shrink: 0

  &__text
    flex: 1
    font-size: 0.9rem
    font-weight: 400

  &__fade-left-right,
  &__fade-right-left
    animation-duration: 250ms

  &__fade-left-right
    animation-name: fadeOutLeft

  &__fade-right-left
    animation-name: fadeInRight

// keyframes
@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translateX(-20rem);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOutLeft {
  0% {
    opacity: 0;
    transform: translateX(-20rem);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
