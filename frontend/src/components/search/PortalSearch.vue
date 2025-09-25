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
            :aria-label="SEARCH"
            :placeholder="SEARCH_PLACEHOLDER"
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
            :aria-label-prop="CLOSE_SEARCH"
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
    SEARCH(): string {
      return _('search');
    },
    SEARCH_PLACEHOLDER(): string {
      return _('Search…');
    },
    CLOSE_SEARCH(): string {
      return _('close search');
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
