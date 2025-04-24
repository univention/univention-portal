<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025 Univention GmbH
-->

<template>
  <div class="newsfeed">
    <div class="newsfeed-meta">
      <h3 class="newsfeed-meta__heading">
        <speaker-icon />
        {{ LATEST_NEWS }}
      </h3>
      <a
        class="newsfeed-meta__btn"
        target="_blank"
        rel="noreferrer"
        :href="homeUrl"
      >
        {{ VIEW_ALL }}
      </a>
    </div>
    <div v-if="$data.hasError">
      <p>{{ COULD_NOT_LOAD_NEWSFEED }}.</p>
      <p>{{ LOGGING_IN_FOR_THE_FIRST_TIME }}.</p>
    </div>
    <div v-else-if="!$data.isLoading && $data.newsfeedItems.length === 0">
      <p>{{ EMPTY_NEWSFEED }}.</p>
    </div>
    <ul
      v-else
      class="newsfeed-list"
    >
      <li
        v-for="(item, itemIndex) in $data.newsfeedItems"
        :key="itemIndex"
        class="newsfeed-list__item"
      >
        <!-- eslint-disable-next-line vuejs-accessibility/anchor-has-content -->
        <a
          v-if="item.link"
          target="_blank"
          rel="noreferrer"
          :href="item.link"
        >
          <item :item="item" />
        </a>
        <item
          v-else
          :item="item"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import _ from '@/jsHelper/translate';

import Item from '@/components/newsfeed/Item.vue';
import SpeakerIcon from '@/components/newsfeed/SpeakerIcon.vue';

import { NewsfeedItem, NewsfeedType } from '@/components/newsfeed/types';

interface NewsfeedData {
  hasError: boolean;
  isLoading: boolean;
  newsfeedItems: Array<NewsfeedItem>;
}

export default defineComponent({
  name: 'Newsfeed',
  components: {
    Item,
    SpeakerIcon,
  },
  props: {
    feedUrl: {
      type: String,
      required: true,
    },
    homeUrl: {
      type: String,
      required: true,
    },
    feedType: {
      type: String,
      required: true,
    },
    withCredentials: {
      type: Boolean,
      required: true,
    },
  },
  data(): NewsfeedData {
    return {
      hasError: false,
      isLoading: false,
      newsfeedItems: [],
    };
  },
  computed: {
    LATEST_NEWS(): string {
      return _('Latest News');
    },
    VIEW_ALL(): string {
      return _('View all');
    },
    EMPTY_NEWSFEED(): string {
      return _('The newsfeed does not yet have any content');
    },
    COULD_NOT_LOAD_NEWSFEED(): string {
      return _('Could not load newsfeed');
    },
    LOGGING_IN_FOR_THE_FIRST_TIME(): string {
      return _('If you are logging in for the first time, please click on "View all" to enable your access to the Newsfeed');
    },
  },
  mounted() {
    this.loadNewsfeed();
  },
  methods: {
    loadNewsfeed() {
      this.isLoading = true;

      axios.get(this.feedUrl, { withCredentials: this.withCredentials })
        .then((response) => {
          if (response.data) {
            this.setNewsfeedItemsFromXML(response.data);
          }
        })
        .catch((error) => {
          this.hasError = true;
          console.error('Could not load newsfeed', error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    setNewsfeedItemsFromXML(data: string) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'application/xml');
      const itemCollection = xmlDoc.getElementsByTagName('item');

      let items: Array<NewsfeedItem> = [];

      switch (this.feedType as NewsfeedType) {
        case 'wordpress':
          items = Array.from(itemCollection).map((item) => {
            const category = item.getElementsByTagName('category')[0]?.textContent ?? '';
            const date = item.getElementsByTagName('pubDate')[0]?.textContent ?? '';
            const excerpt = item.getElementsByTagName('description')[0]?.textContent ?? '';
            const link = item.getElementsByTagName('link')[0]?.textContent ?? '';
            const title = item.getElementsByTagName('title')[0]?.textContent ?? '';
            const imageSrc = item.getElementsByTagName('media:content')[0]?.getAttribute('url') ?? undefined;
            return {
              category,
              date,
              excerpt,
              link,
              title,
              imageSrc,
            };
          });
          break;
        case 'xwiki':
          items = Array.from(itemCollection).map((item) => {
            const category = item.getElementsByTagName('dc:subject')[0]?.textContent ?? '';
            const date = item.getElementsByTagName('dc:date')[0]?.textContent ?? '';
            const excerpt = item.getElementsByTagName('description')[0]?.textContent ?? '';
            const link = item.getElementsByTagName('link')[0]?.textContent ?? '';
            const title = item.getElementsByTagName('title')[0]?.textContent ?? '';
            const imageSrc = item.getElementsByTagName('xwiki:image')[0]?.textContent ?? undefined;
            return {
              category,
              date,
              excerpt,
              link,
              title,
              imageSrc,
            };
          });
          break;
        default:
          console.info(`Unsupported or invalid newsfeed type '${this.feedType}' for URL ${this.feedUrl}`);
      }

      if (items.length > 0) {
        this.newsfeedItems = [...items];
      }
    },
  },
});
</script>

<style lang="stylus">
.newsfeed
  --newsfeed-link-hover-color: var(--color-focus)
  --newsfeed-link-focus-color: var(--color-focus)

.newsfeed-meta
  display: flex
  align-items: center
  justify-content: space-between

  &__heading
    margin: 0
    display: flex
    align-items: center
    font-size: var(--font-size-3)
    font-weight: 700
    gap: var(--layout-spacing-unit)

  &__btn
    padding: calc(0.5 * var(--layout-spacing-unit)) calc(2 * var(--layout-spacing-unit))
    border-radius: 8px
    border: 1px solid var(--bgc-content-container)
    color: var(--font-color-contrast-high)
    background-color: var(--button-bgc)
    font-size: var(--font-size-5)
    font-weight: 700
    text-decoration: none
    &:hover
      border-color: var(--newsfeed-link-hover-color)
    &:focus
      outline: none
      border-color: var(--newsfeed-link-hover-color)
      box-shadow: 0px 0px 0px 3px var(--newsfeed-link-focus-color)

.newsfeed-list
  list-style-type: none
  padding: 0
  margin: 0

  &__item
    margin-top: calc(2.5 * var(--layout-spacing-unit))
    > a
      color: inherit
      outline: none
      text-decoration: none
      &:hover > .newsfeed-item
        border-color: var(--newsfeed-link-hover-color)
      &:focus > .newsfeed-item
        outline: none
        border-color: var(--newsfeed-link-hover-color)
        box-shadow: 0px 0px 0px 3px var(--newsfeed-link-focus-color)
</style>
