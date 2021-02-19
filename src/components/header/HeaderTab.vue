<template>
  <div
    class="header-tab"
    tabindex="0"
    @keyup.tab="focusTab(tabToken, tabIndex, `headerTab__${tabIndex}`)"
  >
    <div
      :id="`headerTab__${tabIndex}`"
      :ref="`headerTab__${tabIndex}`"
      :class="[(tabIndex > 0) || 'header-tab__container--first', 'header-tab__container']"
      @click="focusTab(tabToken, tabIndex, `headerTab__${tabIndex}`)"
    >
      <div class="header-tab__background" />
      <image-component
        v-if="tabImage && (Object.keys(tabImage).length > 0)"
        :file-path="tabImage.filePath"
        :file-name="tabImage.fileName"
        :file-type="tabImage.fileType"
        :alt-text="tabImage.altText"
        :default-class="tabImage.imageClass"
      />
      <span
        class="header-tab__title"
        :title="tabLabel"
      >
        {{ tabLabel }}
      </span>
      <header-button
        v-if="!tabStatic"
        :icon="tabIcon"
        :aria-label="ariaLabel"
        class="header-tab__close-button"
        @click.stop="closeTab(tabToken)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import HeaderButton from '@/components/header/HeaderButton.vue';
import ImageComponent from '@/components/globals/ImageComponent.vue';

@Options({
  name: 'HeaderTab',
  components: {
    HeaderButton,
    ImageComponent,
  },
  props: {
    tabIndex: {
      type: Number,
      default: 0,
    },
    tabToken: {
      type: String,
      default: '',
      required: true,
    },
    tabIcon: {
      type: String,
      default: 'x',
    },
    tabLabel: {
      type: String,
      default: 'Nav Tab',
    },
    ariaLabel: {
      type: String,
      default: 'Tab Aria Label',
    },
    tabStatic: {
      type: Boolean,
      default: false,
    },
    tabImage: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    focusTab(token, index, tab) {
      const needle = document.querySelectorAll('.header-tab__container');

      if (needle) {
        // remove selected tab classes
        Array.from(needle).forEach((el) => el.classList.remove('header-tab__container--selected'));
      }

      if (token && index) {
        // add selected tab class to current tab
        const currItem = document.querySelector(`#${tab}`);
        if (currItem) {
          currItem.classList.add('header-tab__container--selected');
        }

        // display corresponding iframe
      }
    },
    closeTab(token) {
      if (token) {
        this.$store.dispatch('tabs/deleteTab', token);
      }
    },
  },
})
export default class HeaderTab extends Vue {}
</script>

<style lang="stylus">
.header-tab

  &:focus
    outline: 0

  &__container
    --tabColor: transparent;
    outline: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    min-width: calc(30 * var(--layout-spacing-unit));
    height: 50px;
    padding-top: 10px;
    position: relative
    z-index: 1

    &:hover
      --tabColor: #272726;

    &--first
      &:hover
        --tabColor: transparent;

    &--selected
      --tabColor: var(--color-grey8);
      outline: 0;

      &:hover
        --tabColor: var(--color-grey8);

  &__background
    transition: background-color 250ms;
    position: absolute;
    top: 10px;
    right: -1px;
    bottom: 0;
    left: -1px;
    border-radius: 8px 8px 0 0;
    background-color: var(--tabColor);
    z-index: -1;

  &__logo
    width: 20px;
    margin: 0 10px;

    &--default
      width: 30px;
      margin: 0 15px;

  &__title
    flex: 1 1 auto;
    width: 20ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

  &__close-button
    --button-icon-length: 1.3em;
    margin-left: 0.5em;
    position: relative
    z-index: 10

</style>
