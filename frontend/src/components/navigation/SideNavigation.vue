<!--
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
-->
<template>
  <region
    id="portal-sidenavigation"
    role="navigation"
    direction="topdown"
    class="portal-sidenavigation"
  >
    <div class="portal-sidenavigation__login-header">
      <div
        v-if="isLoggedIn"
        class="portal-sidenavigation__user-row"
      >
        <div class="portal-sidenavigation__user-text-content">
          <div class="portal-sidenavigation--username">
            {{ userState.displayName }}
          </div>
          <button
            id="loginButton"
            ref="firstButton"
            class="portal-sidenavigation__logout-link"
            tabindex="0"
            data-test="logButton"
            @click="logout"
            @keydown.enter="logout"
            @keydown.esc="closeNavigation"
            @keydown.arrow-up="handleUpKey($event)"
          >
            {{ LOGOUT }}
          </button>
        </div>
      </div>
      <button
        v-else
        id="loginButton"
        ref="firstButton"
        tabindex="0"
        data-test="logButton"
        class="button--primary portal-sidenavigation__link portal-sidenavigation__login"
        @click="login"
        @keydown.enter="login"
        @keydown.esc="closeNavigation"
        @keydown.arrow-up="handleUpKey($event)"
      >
        {{ LOGIN }}
      </button>
    </div>
    <div class="divider" />
    <component
      :is="useNativeHtmlList ? 'ul' : 'div'"
      :role="useNativeHtmlList ? undefined : 'list'"
      class="portal-sidenavigation__menu"
      data-test="sideNavigation"
    >
      <component
        :is="useNativeHtmlList ? 'li' : 'div'"
        v-for="(item, index) in menuLinks"
        :key="item.id"
        :role="useNativeHtmlList ? undefined : 'listitem'"
        :class="setFadeClass()"
        class="portal-sidenavigation__menu-item"
      >
        <menu-item
          v-if="menuVisible"
          :id="item.id"
          :ref="'menuItem' + index"
          data-test="menuItem"
          :title="item.title"
          :sub-menu="item.subMenu"
          :links="item.links || []"
          :link-target="item.linkTarget"
          :target="item.target"
          :path-to-logo="item.pathToLogo"
          :internal-function="item.internalFunction"
          :background-color="item.backgroundColor"
          :aria-expanded="isAriaExpanded(item)"
          :aria-controls="ariaControls(item)"
          @click="menuClickAction($event, index, item)"
          @keydown.enter.exact="menuClickAction($event, index, item)"
          @keydown.space.exact="menuClickAction($event, index, item)"
          @keydown.right.exact.prevent="
            hasSubmenu(item) ? toggleMenu(index) : null
          "
          @keydown.down.capture="handleDownKey($event, index)"
          @keydown.esc="closeNavigation"
          @click-action="closeNavigation"
        />
        <template v-if="hasSubmenu(item)">
          <region
            v-if="subMenuVisible && menuParent === index"
            id="portal-sidenavigation-sub"
            class="portal-sidenavigation__submenu"
            direction="topdown"
          >
            <menu-item
              :id="`sub-item-${item.id}`"
              :title="item.title"
              :is-parent-in-sub-item="true"
              :links="[]"
              :aria-expanded="subMenuVisible"
              class="portal-sidenavigation__menu-subItem portal-sidenavigation__menu-subItem--parent"
              @click="toggleMenu()"
              @keydown.enter.exact="toggleMenu()"
              @keydown.space.exact.prevent="toggleMenu()"
              @keydown.left.exact="toggleMenu()"
              @keydown.esc="closeNavigation"
              @click-action="closeNavigation"
            />
            <ul class="portal-sidenavigation__submenu-wrapper">
              <li
                v-for="(subItem, subindex) in item.subMenu"
                :key="subindex"
                :class="subMenuClass"
              >
                <menu-item
                  v-if="subMenuVisible && menuParent === index"
                  :id="subItem.id"
                  :ref="`subItem${subindex}`"
                  :title="subItem.title"
                  :links="subItem.links || []"
                  :link-target="subItem.linkTarget"
                  :path-to-logo="subItem.pathToLogo"
                  :internal-function="subItem.internalFunction"
                  :background-color="subItem.backgroundColor"
                  :is-subitem="true"
                  class="portal-sidenavigation__menu-subItem"
                  @keydown.esc="closeNavigation"
                  @click-action="closeNavigation"
                />
              </li>
            </ul>
          </region>
        </template>
      </component>
    </component>
    <div
      v-if="userState.username"
      class="divider"
    />
    <button
      v-if="userState.mayEditPortal"
      ref="editModeButton"
      tabindex="0"
      class="button--primary portal-sidenavigation__link"
      data-test="openEditmodeButton"
      @click="startEditMode"
      @keydown.esc="closeNavigation"
    >
      {{ EDIT_PORTAL }}
    </button>
  </region>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import _ from '@/jsHelper/translate';

import Region from '@/components/activity/Region.vue';
import MenuItem from '@/components/navigation/MenuItem.vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';
import TileClick from '@/mixins/TileClick.vue';

import { login, logout } from '@/jsHelper/login';

interface SideNavigationData {
  menuVisible: boolean;
  subMenuVisible: boolean;
  subMenuClass: string;
  menuParent: number;
  init: boolean;
  fade: boolean;
  fadeRightLeft: string;
  fadeLeftRight: string;
}

export default defineComponent({
  name: 'SideNavigation',
  components: {
    PortalIcon,
    MenuItem,
    Region,
  },
  mixins: [TileClick],
  data(): SideNavigationData {
    return {
      menuVisible: true,
      subMenuVisible: false,
      subMenuClass: 'portal-sidenavigation__menu-item--hide',
      menuParent: -1,
      init: true,
      fade: false,
      fadeRightLeft: 'portal-sidenavigation__fade-right-left',
      fadeLeftRight: 'portal-sidenavigation__fade-left-right',
    };
  },
  computed: {
    ...mapGetters({
      menuLinks: 'menu/getMenu',
      userState: 'user/userState',
      isLoggedIn: 'user/isLoggedIn',
      featureToggles: 'featureToggles/featureToggles',
    }),
    LOGOUT(): string {
      return _('Logout');
    },
    LOGIN(): string {
      return _('Login');
    },
    GO_BACK(): string {
      return _('Go Back');
    },
    EDIT_PORTAL(): string {
      return _('Edit portal');
    },
    CHANGE_LANGUAGE(): string {
      return _('Change language');
    },
    useNativeHtmlList(): boolean {
      return this.featureToggles.native_html_list ?? false;
    },
  },
  created() {
    this.$store.dispatch('modal/disableBodyScrolling');
  },
  mounted(): void {
    this.$store.dispatch('activity/setRegion', 'portal-sidenavigation');
  },
  methods: {
    login(): void {
      login(this.userState);
    },
    async logout(): Promise<void> {
      await this.$store.dispatch('oidc/tryLogout');
      logout();
    },
    closeNavigation(): void {
      this.$store.dispatch('navigation/setActiveButton', '');
      this.$store.dispatch('activity/setRegion', 'portal-header');
    },
    toggleMenu(index = -1): void {
      this.menuVisible = !this.menuVisible;
      this.menuParent = index;
      this.subMenuVisible = !this.subMenuVisible;
      this.fade = !this.fade;
      this.init = false;

      const region =
        index === -1 ? 'portal-sidenavigation' : 'portal-sidenavigation-sub';
      this.$store.dispatch('activity/setRegion', region);

      if (this.subMenuVisible) {
        this.subMenuClass = 'portal-sidenavigation__menu-item--show';
      } else {
        this.subMenuClass = 'portal-sidenavigation__menu-item--hide';
      }
    },
    async startEditMode(): Promise<void> {
      await this.$store.dispatch('portalData/setEditMode', true);
      (this.$refs.editModeButton as HTMLElement).blur();
      this.$store.dispatch('navigation/setActiveButton', '');
      this.$store.dispatch('tabs/setActiveTab', 0);
      window.requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    },
    setFadeClass(): string {
      let ret = '';
      if (!this.init) {
        if (!this.fade) {
          ret = this.fadeLeftRight;
        } else {
          ret = this.fadeRightLeft;
        }
      }
      return ret;
    },
    hasSubmenu(item): boolean {
      return item.subMenu && item.subMenu.length > 0;
    },
    menuClickAction(
      $event,
      index: number,
      item: Record<string, unknown>,
    ): void {
      if (this.hasSubmenu(item)) {
        $event.preventDefault();
        this.toggleMenu(index);
      } else {
        const menuItems = (
          this.$refs[`menuItem${index}`]
            ? this.$refs[`menuItem${index}`]
            : this.$refs[`subItem${index}`]
        ) as Array<typeof MenuItem>;
        const menuItem = menuItems.pop();
        menuItem?.tileClick($event);
        if (item.linkTarget === 'embedded') {
          this.$store.dispatch('navigation/setActiveButton', '');
          this.$store.dispatch('activity/saveFocus', {
            region: 'portal-sidenavigation',
            id: 'loginButton',
          });
        }
      }
    },
    handleDownKey(e: KeyboardEvent, index: number) {
      if (!this.menuLinks) return;
      const isLast = index === this.menuLinks.length - 1;
      if (isLast) {
        e.preventDefault();
        e.stopPropagation();
        if (this.userState.mayEditPortal) {
          this.moveToEditModeButton();
        } else {
          this.moveToLoginButton();
        }
      }
    },
    handleUpKey(e: KeyboardEvent) {
      e.preventDefault();
      e.stopPropagation();
      if (this.userState.mayEditPortal) {
        this.moveToEditModeButton();
      } else {
        this.moveToMenuItem(this.menuLinks.length - 1);
      }
    },
    moveToEditModeButton() {
      (this.$refs.editModeButton as HTMLButtonElement | null)?.focus();
    },
    moveToMenuItem(refIndex: number) {
      const menuItemRefs = this.$refs[`menuItem${refIndex}`] as Array<typeof MenuItem>;
      const menuItem = menuItemRefs?.[0];

      if (menuItem && menuItem.$el) {
        (menuItem.$el as HTMLElement).focus();
      }
    },
    moveToLoginButton() {
      (this.$refs.firstButton as HTMLButtonElement | null)?.focus();
    },
    isAriaExpanded(item: any) {
      if (!this.hasSubmenu(item)) return null;
      return this.subMenuVisible;
    },
    ariaControls(item: any) {
      return this.hasSubmenu(item) && this.subMenuVisible ? `sub-item-${this.menuParent}` : null;
    },
  },
});
</script>

<style lang="stylus">
$userRow = 6rem
.portal-sidenavigation
  height: 100%
  display: flex
  flex-direction: column

  &__submenu-wrapper
    padding: 0
    list-style-type: none

  &__link
    position: relative
    left: calc(2*var(--layout-spacing-unit))
    margin-top: var(--layout-spacing-unit)
    margin-bottom: calc(2*var(--layout-spacing-unit))
    align-self: flex-start

  &__user-row
    display: flex
    height: $userRow

  &__user-text-content
    margin: auto 0
    height: 100%;
    align-items: flex-start
    display: flex
    flex-direction: column
    justify-content: space-between
    padding: calc(1rem + var(--layout-spacing-unit))
    box-sizing: border-box

  &--username
    font-weight: bold
    font-size: var(--font-size-html)

  &__logout-link
    scale: 85%
    margin-left: -0.5rem

    &:focus-visible span
      text-decoration: none

  &__login
    margin-top: calc(2*var(--layout-spacing-unit))

    span
        margin: 0.2rem

  &__login-header
    &:focus-visible
      outline: 0

  &__menu
    flex: 1 1 auto
    overflow-y: auto
    overflow-x: hidden
    padding: 0
    list-style: none

  &__menu-item
    margin-left: 0

    &--show
      display: block

    &--hide
      display: none

  &__menu-subItem
    margin-left: 0
    transition: background-color var(--portal-transition-duration)
    &--parent
      text-transform: uppercase
      padding-left: 4rem
      margin-bottom: 1rem
    &:hover
      background-color: var(--bgc-user-menu-item-hover)

  &__fade-left-right,
  &__fade-right-left
    animation-duration: 250ms

  &__fade-right-left
    animation-name: fadeOutRight

  &__fade-left-right
    animation-name: fadeInLeft

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(20rem);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeOutRight {
  0% {
    opacity: 0;
    transform: translateX(20rem);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.divider
  flex: 0 0 auto
  background-color: var(--bgc-user-menu-item-hover)
  width: 90%
  height: 2px
  position: relative
  left: calc(2*var(--layout-spacing-unit))
  margin-bottom: var(--layout-spacing-unit)
  &--bottom
    margin-top: var(--layout-spacing-unit)
</style>
