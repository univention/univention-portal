<template>
  <div
    id="headerTabWrapper"
    ref="headerTabWrapper"
    class="header-tabs"
  >
    <div
      :id="`headerTab__${tabIndex}`"
      :ref="`headerTab__${tabIndex}`"
      :tabindex="tabIndex"
      class="header-tabs__container header-tabs__container--selected"
      @click="focusTab(tabToken)"
    >
      <div class="header-tabs__background" />
      <image-component
        v-if="tabImage && (Object.keys(tabImage).length > 0)"
        :file-path="tabImage.filePath"
        :file-name="tabImage.fileName"
        :file-type="tabImage.fileType"
        :alt-text="tabImage.altText"
        default-class="header-tabs__logo"
      />
      <span
        class="header-tabs__title"
        :title="tabLabel"
      >
        {{ tabLabel }}
      </span>
      <header-button
        v-if="!tabStatic"
        :icon="tabIcon"
        :aria-label="ariaLabel"
        class="header-tabs__close-button"
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
  name: 'HeaderTabs',
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
    focusTab(token) {
      console.log('focusTab: ', token);
      if (token) {
        // add some fancy stuff ;)
      }
    },
    closeTab(token) {
      if (token) {
        this.$store.dispatch('tabs/deleteTab', token);
      }
    },
  },
})

export default class HeaderTabs extends Vue {}
</script>

<style lang="stylus">
.header-tabs {
  display: flex;
  flex: 1 1 auto;
  margin-left: calc(3 * var(--layout-spacing-unit));

  &:first-of-type {
    margin-left: -18px;
  }

  &__container {
    --tabColor: transparent;
    outline: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    min-width: calc(30 * var(--layout-spacing-unit));
    padding-top: 10px;
    position: relative
    z-index: 1

    &--selected {
      --tabColor: var(--color-grey8);
      z-index: 2;
      height: 50px;
    }
  }

  &__background {
    transition: background-color 250ms;
    position: absolute;
    top: 10px;
    right: -1px;
    bottom: 0;
    left: -1px;
    border-radius: 8px 8px 0 0;
    background-color: var(--tabColor);
    z-index: -1;
  }

  &__logo {
    width: 1em;
    margin: 0 0.5em;
  }

  &__title {
    flex: 1 1 auto;
    width: 20ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__close-button {
    --button-icon-length: 1.3em;
    margin-left: 0.5em;
    position: relative
    z-index: 10
  }
}
</style>
