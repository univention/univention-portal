<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025 Univention GmbH
-->

<template>
  <article class="newsfeed-item">
    <div class="newsfeed-item__content">
      <div class="newsfeed-item__meta">
        <div>
          <span
            v-for="(category, index) in categoryList"
            :key="index"
            class="newsfeed-item__category"
          >
            {{ category }}
          </span>
        </div>
        <pin-icon
          v-if="item.isPinned"
          class="newsfeed-item__pin"
        />
      </div>
      <h3 class="newsfeed-item__title">
        {{ item.title }}
      </h3>
      <time
        :datetime="item.date"
        class="newsfeed-item__date"
      >
        {{ dateFormatted }}
      </time>
      <div
        v-dompurify-html="item.excerpt"
        class="newsfeed-item__excerpt"
      />
    </div>
    <div
      v-if="item.imageSrc"
      class="newsfeed-item__media"
    >
      <img
        alt=""
        aria-hidden="true"
        :src="item.imageSrc"
        class="newsfeed-item__image"
      >
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapGetters } from 'vuex';

import PinIcon from '@/components/newsfeed/PinIcon.vue';
import { NewsfeedItem } from '@/components/newsfeed/types';

export default defineComponent({
  name: 'Item',
  components: {
    PinIcon,
  },
  props: {
    item: {
      type: Object as PropType<NewsfeedItem>,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      currentLocale: 'locale/getLocale',
    }),
    getLocaleArg(): string {
      return this.currentLocale.replace('_', '-');
    },
    dateFormatted(): string {
      const date = new Date(Date.parse(this.item.date));
      const day = date.getDate().toString()
        .padStart(2, '0');
      const monthAndYear = date.toLocaleString(this.getLocaleArg, {
        month: 'long',
        year: 'numeric',
      });
      return `${day}. ${monthAndYear}`;
    },
    categoryList(): Array<string> {
      if (this.item.category === 'openDesk.Newsfeed.Categories.WebHome') {
        return [];
      }
      const decodedCategory = this.decodeHtmlEntities(this.item.category);
      return decodedCategory.replace('{{html clean="false" wiki="false"}}', '')
        .replace('{{/html}}', '')
        .split('<br />')
        .map((c) => c.trim());
    },
  },
  methods: {
    decodeHtmlEntities(html: string): string {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = html;
      return textarea.value;
    },
  },
});
</script>

<style lang="stylus">
.newsfeed-item
  border: 1px solid #D3D7DE
  border-radius: var(--layout-spacing-unit)
  background-color: var(--color-opendesk-white)
  overflow: hidden

  &__content
    padding: calc(3 * var(--layout-spacing-unit)) calc(4.75 * var(--layout-spacing-unit))

  &__meta
    display: flex
    align-items: flex-start
    justify-content: space-between

  &__category
    display: inline-block
    margin-right: var(--layout-spacing-unit)
    margin-bottom: calc(0.5* var(--layout-spacing-unit))
    padding: 2px calc(2 * var(--layout-spacing-unit))
    border-radius: var(--layout-spacing-unit)
    background-color: var(--bgc-content-container)
    color: var(--font-color-contrast-high)
    font-size: var(--font-size-5)
    font-weight: 700

  &__pin
    background-color: #EEEFF2
    padding: 4px
    border-radius: 50%

  &__title
    font-size: var(--font-size-1)
    font-weight: 700
    line-height: 1.4
    max-width: 90%
    margin: calc(1.5 * var(--layout-spacing-unit)) 0

  &__date
    color: #637089
    font-size: var(--font-size-5)
    font-weight: 700

  &__excerpt
    margin: calc(1.75 * var(--layout-spacing-unit)) 0 0 0
    a
      color: inherit
    p:last-of-type
      margin-bottom: 0

  &__image
    max-width: 100%
    height: auto
    display: block
</style>
