<!--
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
-->
<template>
  <div
    ref="searchInput"
    class="portal-search"
  >
    <transition
      name="slide"
      appear
    >
      <flyout-wrapper
        v-if="activeButton === 'search'"
        :is-visible="activeButton === 'search'"
        class="portal-search__wrapper"
        tabindex="-1"
      >
        <div class="portal-search__input-wrapper">
          <input
            id="portal-search-input"
            ref="portalSearchInput"
            v-model="portalSearch"
            data-test="searchInput"
            type="text"
            class="portal-search__input"
            :aria-label="FILTER"
            :placeholder="FILTER_PLACEHOLDER"
            @input="searchTiles"
            @keyup.esc="closeSearchInput()"
          >
          <icon-button
            id="portal-search-close-button"
            ref="searchCloseButton"
            class="portal-search__close-button"
            button-class="button--icon--circle button--icon--header-style button--flat"
            icon="x"
            size-variant="small"
            :active-at="['portal']"
            :aria-label-prop="CLOSE_FILTER"
            :tabindex="0"
            @click="closeSearchInput"
          />
        </div>
      </flyout-wrapper>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import _ from '@/jsHelper/translate';

import FlyoutWrapper from '@/components/navigation/FlyoutWrapper.vue';
import IconButton from '@/components/globals/IconButton.vue';

interface PortalSearchData {
  portalSearch: string;
}

export default defineComponent({
  name: 'PortalSearch',
  components: {
    FlyoutWrapper,
    IconButton,
  },
  data(): PortalSearchData {
    return { portalSearch: '' };
  },
  computed: {
    ...mapGetters({
      activeButton: 'navigation/getActiveButton',
    }),
    FILTER(): string {
      return _('filter');
    },
    FILTER_PLACEHOLDER(): string {
      return _('Filter tiles...');
    },
    CLOSE_FILTER(): string {
      return _('Close filter');
    },
  },
  beforeUnmount() {
    this.$store.dispatch('search/setSearchQuery', '');
  },
  mounted() {
    this.$nextTick(() => {
      (this.$refs.portalSearchInput as HTMLElement).focus();
    });
  },
  methods: {
    searchTiles(): void {
      this.$store.dispatch(
        'search/setSearchQuery',
        this.portalSearch.toLowerCase(),
      );
      this.$nextTick(() => {
        const num = document.querySelectorAll('.portal-tile').length.toString();
        this.$store.dispatch(
          'activity/setMessage',
          _('%(num)s search results', { num }),
        );
      });
    },
    closeSearchInput(): void {
      this.portalSearch = '';
      this.$store.dispatch('navigation/setActiveButton', '');
      this.$store.dispatch('search/setSearchQuery', '');
    },
    handleBellButtonTab(): void {
      // Add a temporary event listener to the bell button to handle its next tab
      const bellButton = document.getElementById('header-button-bell');
      if (bellButton) {
        const handleBellTab = (event: KeyboardEvent) => {
          if (event.key === 'Tab' && !event.shiftKey) {
            // Remove this listener immediately
            bellButton.removeEventListener('keydown', handleBellTab);

            // Manually focus the menu button instead of letting it go back to search
            event.preventDefault();
            const menuButton = document.getElementById('header-button-menu');
            if (menuButton) {
              // Also set up the menu button to continue the chain properly
              this.handleMenuButtonTab();
              menuButton.focus();
            } else {
              // Fallback to quick draft or other elements
              const quickDraftLink = document.querySelector('a[id^="portal-quick-draft-"]');
              if (quickDraftLink) {
                (quickDraftLink as HTMLElement).focus();
              }
            }
          }
        };

        // Add the temporary listener
        bellButton.addEventListener('keydown', handleBellTab, { once: true });
      }
    },
    handleMenuButtonTab(): void {
      // Add a temporary event listener to the menu button to handle its next tab
      const menuButton = document.getElementById('header-button-menu');
      if (menuButton) {
        const handleMenuTab = (event: KeyboardEvent) => {
          if (event.key === 'Tab' && !event.shiftKey) {
            // Remove this listener immediately
            menuButton.removeEventListener('keydown', handleMenuTab);

            // Manually focus the Administration section first, then set up newsfeed
            event.preventDefault();

            // First try to find quick draft or administration links
            const quickDraftLink = document.querySelector('a[id^="portal-quick-draft-"]');
            if (quickDraftLink) {
              // Set up handler to continue to newsfeed after administration section
              this.handleAdministrationToNewsfeed();
              (quickDraftLink as HTMLElement).focus();
            } else {
              // Fallback to portal tiles
              const portalTile = document.querySelector('.portal-tile');
              if (portalTile) {
                // Set up handler to continue to newsfeed after portal tiles
                this.handleAdministrationToNewsfeed();
                (portalTile as HTMLElement).focus();
              } else {
                // Final fallback - go directly to newsfeed if no administration content
                const newsfeedLinks = document.querySelectorAll('a[id^="newsfeed-view-"]');
                if (newsfeedLinks.length > 0) {
                  newsfeedLinks.forEach((link) => {
                    (link as HTMLElement).tabIndex = 0;
                  });
                  (newsfeedLinks[0] as HTMLElement).focus();
                }
              }
            }
          }
        };

        // Add the temporary listener
        menuButton.addEventListener('keydown', handleMenuTab, { once: true });
      }
    },
    handleAdministrationToNewsfeed(): void {
      // Find the last administration/portal element to set up transition to newsfeed
      const allAdminElements = document.querySelectorAll('a[id^="portal-quick-draft-"], .portal-tile');

      if (allAdminElements.length > 0) {
        const lastAdminElement = allAdminElements[allAdminElements.length - 1] as HTMLElement;

        const handleAdminToNewsfeed = (event: KeyboardEvent) => {
          if (event.key === 'Tab' && !event.shiftKey) {
            // Remove this listener immediately
            lastAdminElement.removeEventListener('keydown', handleAdminToNewsfeed);

            // Now transition to newsfeed
            event.preventDefault();
            const newsfeedLinks = document.querySelectorAll('a[id^="newsfeed-view-"]');
            if (newsfeedLinks.length > 0) {
              // Make all newsfeed links tabbable
              newsfeedLinks.forEach((link) => {
                (link as HTMLElement).tabIndex = 0;
              });
              // Focus the first newsfeed item
              (newsfeedLinks[0] as HTMLElement).focus();
            }
          }
        };

        // Add the temporary listener to the last administration element
        lastAdminElement.addEventListener('keydown', handleAdminToNewsfeed, { once: true });
      }
    },
  },
});
</script>

<style lang="stylus">
.portal-search
  &__input
    width: 100%
    border: 0.1rem solid transparent
    border-radius: var(--border-radius-interactable)
    background-color: var(--bgc-inputfield-on-body)
    padding: var(--layout-spacing-unit) !important
    padding-right: calc(var(--layout-spacing-unit) * 2 + var(--button-size) * 0.6)!important
    box-sizing: border-box;
    margin-bottom: 0

    &:focus
      border-color: var(--color-focus);
      outline: none;

    &::placeholder
      color: var(--font-color-contrast-middle)
      opacity: 1

  &__wrapper
    background-color: rgba(0,0,0,0)
    bottom: unset

  &__input-wrapper
    display: flex
    align-items: center
    position: relative

  &__close-button
    position: absolute
    right: var(--layout-spacing-unit)
    cursor: pointer
    font-size: 1.6rem
    color: white

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(22rem)
}
</style>
