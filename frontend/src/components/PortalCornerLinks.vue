<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025 Univention GmbH
-->

<template>
  <template v-if="hasCornerLinks || editionNotice">
    <div class="portal-corner">
      <div class="portal-corner__inner">
        <ul class="portal-corner__menu">
          <li
            v-for="(entry, index) in portalHelpMenu()"
            :key="index"
            class="portal-corner__item"
          >
            <tabindex-element
              v-if="entry.link"
              :id="`portal-corner-link-${index}`"
              tag="a"
              :active-at="['portal']"
              data-test="portal-corner-link"
              :href="entry.link"
              :target="entry.linkTarget"
              class="portal-corner__link"
            >
              <img
                v-if="entry.iconUrl"
                :src="entry.iconUrl"
                onerror="this.src='./media/questionmark.svg'"
                alt=""
                class="portal-corner__icon"
              >
              <span :title="entry.description">{{ entry.name }}</span>
            </tabindex-element>
            <span
              v-else
              :title="entry.description"
              class="portal-corner__text"
            >{{ entry.name }}</span>
          </li>
          <!--
            Fixed Core Edition notice. Always the last corner link and
            intentionally independent of the operator defined corner links
            and the feature toggles. Only hidden if the portal server confirms
            a valid enterprise subscription.
          -->
          <li
            v-if="editionNotice"
            class="portal-corner__item"
          >
            <tabindex-element
              id="portal-corner-link-edition"
              tag="a"
              :active-at="['portal']"
              data-test="portal-corner-link-edition"
              :href="editionNoticeLink"
              target="_blank"
              rel="noopener"
              class="portal-corner__link"
            >
              <img
                :src="editionNoticeIcon"
                alt=""
                class="portal-corner__icon"
                data-test="portal-corner-link-edition-icon"
              >
              <span :title="editionNoticeTooltip">{{ editionNoticeText }}</span>
            </tabindex-element>
          </li>
        </ul>
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

import TabindexElement from '@/components/activity/TabindexElement.vue';
import _ from '@/jsHelper/translate';
import { Locale } from '@/store/modules/locale/locale.models';

// The text is a product name and is intentionally not translated.
const EDITION_NOTICE_TEXT = 'Nubus Core Edition by Univention';
// The Univention "U" logo, shipped with the frontend so that it cannot be replaced by portal content.
const EDITION_NOTICE_ICON = './media/univention-u.svg';
// There is a German and an English landing page; all other locales use the English one.
const EDITION_NOTICE_LINK_EN = 'https://www.univention.com/core-edition-portal-corner-link/';
const EDITION_NOTICE_LINKS: Record<Locale, string> = {
  en: EDITION_NOTICE_LINK_EN,
  en_US: EDITION_NOTICE_LINK_EN,
  de_DE: 'https://www.univention.de/core-edition-portal-corner-link/',
  fr_FR: EDITION_NOTICE_LINK_EN,
};

type PortalCornerLinks = Array<{
  name: string;
  description: string;
  link: string;
  iconUrl: string | null;
  linkTarget: '_blank' | '_self';
}>;

export default defineComponent({
  name: 'PortalCornerLinks',
  components: {
    TabindexElement,
  },
  computed: {
    ...mapGetters({
      cornerLinks: 'portalData/cornerLinks',
      portalEntries: 'portalData/portalEntries',
      editionNotice: 'portalData/editionNotice',
    }),
    hasCornerLinks(): boolean {
      return Array.isArray(this.cornerLinks) && this.cornerLinks.length > 0;
    },
    editionNoticeText(): string {
      return EDITION_NOTICE_TEXT;
    },
    editionNoticeIcon(): string {
      return EDITION_NOTICE_ICON;
    },
    editionNoticeTooltip(): string {
      return _('Nubus Core Edition by Univention - in use without warranties or support. Learn more!');
    },
    editionNoticeLink(): string {
      return this.$localized(EDITION_NOTICE_LINKS);
    },
  },
  methods: {
    portalHelpMenu() {
      const menu: PortalCornerLinks = this.cornerLinks
        ?.flatMap((dn) => this.portalEntries?.filter((e) => e.dn === dn).map(({ name, description, links, icon_url: iconUrl, linkTarget }) => ({
          name: this.$localized(name),
          description: this.$localized(description),
          link: this.$localized(links.reduce((acc, link) => {
            acc[link.locale] = link.value;
            return acc;
          }, {})),
          iconUrl,
          linkTarget: linkTarget === 'newwindow' ? '_blank' : '_self',
        })));
      return menu;
    },
  },
});
</script>

<style lang="stylus">
.portal-corner
  position: fixed
  bottom: 0
  right: 0
  z-index: $zindex-1
  @media $mqSmartphone
    left: 0

  &__inner
    border-radius: var(--layout-spacing-unit) 0px 0px 0px
    background-color: var(--bgc-content-container)
    padding: calc(1.625 * var(--layout-spacing-unit)) calc(3.25 * var(--layout-spacing-unit))
    @media $mqSmartphone
      border-top-left-radius: 0px

  &__menu
    display: flex
    align-items: center
    margin: 0
    padding: 0
    list-style-type: none
    @media $mqSmartphone
      justify-content: space-between

  &__item
    display: inline-flex
    &::after
      content: "|"
      margin: 0 var(--layout-spacing-unit)
      color: var(--font-color-contrast-high)
      @media $mqSmartphone
        display: none
    &:last-of-type::after
      display: none

  &__text
    color: var(--font-color-contrast-high)
    font-weight: 600
    text-decoration: none

  &__link
    display: inline-flex
    align-items: self-end
    color: var(--font-color-contrast-high)
    font-weight: 600
    text-decoration: none
    &:hover,
    &:focus-visible
      color: var(--font-color-contrast-high)
      outline: none
      outline-offset: none
      span
        text-decoration: underline

  &__icon
    width: 21px
    height: 20px
    margin-right: var(--layout-spacing-unit)
    @media $mqSmartphone
      margin-right: calc(0.375 * var(--layout-spacing-unit))

</style>
