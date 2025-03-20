<!--
 SPDX-License-Identifier: AGPL-3.0-only
 SPDX-FileCopyrightText: 2025 Univention GmbH
-->

<template>
  <div
    v-if="entries.length === 1"
    class="portal-quick-draft"
  >
    <a
      :href="entries[0].link"
      :target="entries[0].linkTarget"
      class="portal-quick-draft__item portal-quick-draft__item--single"
    >
      <!-- alt on Image needs to be empty (it does not provide more and usefull information) -->
      <img
        :src="entries[0].iconUrl || './media/questionmark.svg'"
        onerror="this.src='./media/questionmark.svg'"
        alt=""
        class="portal-quick-draft__img"
      >
      <span>{{ entries[0].name }}</span>
    </a>
  </div>
  <div
    v-else
    class="portal-quick-draft"
    :class="{'portal-quick-draft--open': isOpen}"
    @focusout="closeOnOutsideClick"
    @keydown.esc.prevent="closeQuickDraft"
  >
    <button
      class="portal-quick-draft__toggle"
      type="button"
      @click="toggleQuickDraft"
      @keydown.enter.prevent="toggleQuickDraft"
    >
      <template v-if="isOpen">
        <portal-icon
          icon="x"
          class="portal-quick-draft__icon"
        />
        <span>{{ title }}</span>
      </template>
      <template v-else>
        <portal-icon
          icon="plus"
          class="portal-quick-draft__icon"
        />
        <span>{{ title }}</span>
      </template>
    </button>
    <div class="portal-quick-draft__menu">
      <ul class="portal-quick-draft__items">
        <li
          v-for="(entry, index) in entries"
          :key="index"
        >
          <a
            :href="entry.link"
            :target="entry.linkTarget"
            class="portal-quick-draft__item"
          >
            <!-- alt on Image needs to be empty (it does not provide more and usefull information) -->
            <img
              :src="entry.iconUrl || './media/questionmark.svg'"
              onerror="this.src='./media/questionmark.svg'"
              alt=""
              class="portal-quick-draft__img"
            >
            <span>{{ entry.name }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapGetters } from 'vuex';

import PortalIcon from '@/components/globals/PortalIcon.vue';

export type PortalQuickDraftEntry = {
  name: string;
  description: string;
  link: string;
  iconUrl: string | null;
  linkTarget: '_blank' | '_self';
};

export default defineComponent({
  name: 'PortalQuickDraft',
  components: {
    PortalIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    entries: {
      type: Array as PropType<PortalQuickDraftEntry[]>,
      required: true,
    },
  },
  data: () => ({
    isOpen: false,
  }),
  computed: {
    ...mapGetters({}),
  },
  methods: {
    toggleQuickDraft() {
      this.isOpen = !this.isOpen;
    },
    closeQuickDraft() {
      this.isOpen = false;
    },
    closeOnOutsideClick(event: FocusEvent) {
      if (event.relatedTarget !== null && (event.relatedTarget as Element).className.includes('portal-quick-draft__item')) {
        return;
      }
      this.closeQuickDraft();
    },
  },
});
</script>

<style lang="stylus">
.portal-quick-draft
  position: relative
  background-color: var(--button-bgc)
  color: var(--font-color-contrast-high)
  border: 1px solid var(--bgc-content-container)
  border-radius: var(--layout-spacing-unit)
  &:hover
    background-color: var(--button-bgc-hover)
  &:focus-within
    box-shadow: var(--box-shadow)
  @media $mqSmartphone
    width: 100%

  &--open
    background-color: var(--button-bgc-hover)
    border-bottom-left-radius: 0
    border-bottom-right-radius: 0
    &:hover
      background-color: var(--button-bgc-hover)
    &:focus-within
      box-shadow: unset
    .portal-quick-draft__menu
      display: block
      z-index: $zindex-2

  &__toggle
    display: flex
    align-items: center
    justify-content: flex-start
    height: 2.75rem
    width: 100%
    box-sizing: border-box
    padding: calc(2 * var(--layout-spacing-unit))
    font-size: var(--font-size-4)
    font-weight: 600
    text-transform: none
    border: none
    border-radius: var(--layout-spacing-unit)
    background-color: inherit
    color: inherit
    transition: none
    &:hover
      cursor: pointer

  &__menu
    display: none
    position: absolute
    top: 2.75rem
    left: -1px
    right: -1px
    border: 1px solid var(--bgc-content-container)
    border-top: none
    background-color: inherit
    padding: calc(2 * var(--layout-spacing-unit))
    border-bottom-left-radius: var(--layout-spacing-unit)
    border-bottom-right-radius: var(--layout-spacing-unit)

  &__headline
    display: block
    color: rgba(255, 255, 255, 0.70)
    font-size: var(--font-size-5)
    font-weight: 600
    margin: 0 0 calc(2 * var(--layout-spacing-unit)) 0

  &__items
    list-style: none
    margin: 0
    padding: 0
    display: grid
    grid-gap: calc(2 * var(--layout-spacing-unit))

  &__item
    height: calc(3.75 * var(--layout-spacing-unit))
    display: flex
    align-items: center
    color: var(--font-color-contrast-high)
    text-decoration: none
    &:hover,
    &:focus-visible
      color: var(--font-color-contrast-high)
      text-decoration: underline
      outline: none
      outline-offset: none
    &--single
      height: 2.75rem
      padding: 0 calc(2 * var(--layout-spacing-unit))

  &__img,
  &__icon
    color: inherit
    margin-right: var(--layout-spacing-unit)

  &__img
    width: 21px
    height: auto

</style>
