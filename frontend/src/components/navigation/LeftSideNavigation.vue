<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025 Univention GmbH
-->

<template>
  <region
    id="portal-left-sidenavigation"
    role="navigation"
    direction="topdown"
    class="portal-left-sidenavigation"
  >
    <div class="portal-left-sidenavigation__header">
      <portal-title />
      <div
        role="button"
        tabindex="0"
        class="portal-left-sidenavigation__close-button"
        @click="closeNavigation"
        @keydown.enter="closeNavigation"
      >
        <portal-icon icon="x" />
      </div>
    </div>
    <div class="portal-left-sidenavigation__title">
      {{ APPLICATIONS }}
    </div>
    <ul
      v-if="menuItems.length > 0"
      class="portal-left-sidenavigation__menu"
    >
      <li
        v-for="item in menuItems"
        :key="item.id"
        class="portal-left-sidenavigation__menu-item"
      >
        <a
          :href="getItemLink(item)"
          :target="getItemTarget(item)"
          class="portal-left-sidenavigation__link"
        >
          <img
            v-if="item.icon_url"
            :src="item.icon_url"
            :alt="getItemName(item)"
            class="portal-left-sidenavigation__icon"
          >
          <span class="portal-left-sidenavigation__text">
            {{ getItemName(item) }}
          </span>
        </a>
      </li>
    </ul>
  </region>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import _ from '@/jsHelper/translate';

import Region from '@/components/activity/Region.vue';
import PortalTitle from '@/components/header/PortalTitle.vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';
import { PortalEntry } from '@/store/modules/portalData/portalData.models';

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
    menuItems() {
      const items = this.leftSidebarItems;
      // @ts-ignore
      return Array.isArray(items?.entries) ? items.entries : [];
    },
    APPLICATIONS(): string {
      return _('Applications');
    },
  },
  created() {
    this.$store.dispatch('modal/disableBodyScrolling');
  },
  mounted(): void {
    this.$store.dispatch('activity/setRegion', 'portal-sidenavigation');
  },
  methods: {
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
    getItemName(item: PortalEntry): string {
      if (!item || !item.name) return '';
      return this.$localized(item.name);
    },
    getItemLink(item: PortalEntry): string {
      if (!item || !item.links || !Array.isArray(item.links)) return '#';
      const link = item.links.find((l) => l && l.locale === this.currentLocale);
      if (!link) return '#';
      return link.value || '#';
    },
    getItemTarget(item: PortalEntry): string {
      // Return the appropriate target for the link
      if (!item) return '_blank';

      if (item.linkTarget === 'useportaldefault') {
        return '_self';
      }
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
      background-color: gray
      cursor: pointer

    &:focus-visible
      outline:2px solid var(--color-focus);
      outline-offset: var(--left-sidenavigation-outline-offset, -0.5rem)

  &__title
    font-size: 0.8rem
    font-weight: 600
    padding: calc(1.5 * var(--layout-spacing-unit)) 0.5rem 0
    color: var(--color-text)
    margin: 1rem 0

  &__link
    padding-right: calc(1.5 * var(--layout-spacing-unit))

  &__menu
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
      background-color: gray

    &:focus
      outline: 2px solid white
      outline-offset: -2px

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
