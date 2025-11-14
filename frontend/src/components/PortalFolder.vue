<!--
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
-->
<template>
  <div
    class="portal-folder"
    :draggable="editMode && !inModal"
    :class="[
      { 'portal-folder__in-modal': inModal },
    ]"
    @dragstart="dragstart"
    @dragenter="dragenter"
    @dragend="dragend"
    @dragover.prevent
    @drop="dropped"
  >
    <div class="portal-tile__icon-bar">
      <icon-button
        v-if="editMode && !inModal && showEditButtonWhileDragging"
        icon="edit-2"
        class="button--icon--circle button--icon--edit-mode button--shadow"
        :aria-label-prop="EDIT_FOLDER"
        @click="editFolder"
      />
      <icon-button
        v-if="editMode && !inModal && showMoveButtonWhileDragging"
        :id="`${layoutId}-move-button`"
        ref="mover"
        icon="move"
        class="button--icon--circle button--icon--edit-mode button--shadow"
        :aria-label-prop="MOVE_FOLDER"
        @click="dragKeyboardClick"
        @keydown.esc="dragend"
        @keydown.left="dragKeyboardDirection($event, 'left')"
        @keydown.right="dragKeyboardDirection($event, 'right')"
        @keydown.up="dragKeyboardDirection($event, 'up')"
        @keydown.down="dragKeyboardDirection($event, 'down')"
        @keydown.tab="handleTabWhileMoving"
      />
      <icon-button
        v-if="inModal && isTouchDevice"
        :id="`${layoutId}-close-button`"
        icon="x"
        class="button--icon--circle button--icon--edit-mode button--shadow"
        :tabindex="inModal ? 0 : -1"
        :aria-label-prop="CLOSE_FOLDER"
        @click="closeFolder"
        @touchstart.prevent="closeFolder"
      />
    </div>
    <tabindex-element
      :id="id"
      :tag="isOpened"
      :active-at="activeAt"
      class="portal-tile__box"
      :class="[{
        'portal-tile__box--accessible-zoom': inModal && updateZoomQuery(),
        'portal-tile__box--dragging': isBeingDragged,
        'portal-tile__box--with-scaling-hover': !inModal,
      }]"
      data-test="portal-folder"
      role="dialog"
      :aria-modal="inModal ? 'true' : undefined"
      :aria-labelledby="inModal ? `${id}-content` : undefined"
      :aria-label="ariaLabelFolder"
      @click="openFolder"
      @keypress.enter="openFolder"
      @keydown.esc.stop="closeFolder"
    >
      <component
        :is="useNativeHtmlList && editMode ? 'div' : 'TemplateWrapper'"
        data-test="editmode-wrapper"
        :class="{
          'portal-folder__thumbnails': useNativeHtmlList && editMode,
          'portal-folder__thumbnails--in-modal': inModal && useNativeHtmlList && editMode
        }"
      >
        <component
          :is="useNativeHtmlList ? 'ul' : 'div'"
          :tabindex="useNativeHtmlList ? undefined : -1"
          :class="{
            'portal-folder__thumbnails': !(editMode && useNativeHtmlList),
            'portal-folder__thumbnails--display-contents': editMode && useNativeHtmlList,
            'portal-folder__thumbnails--in-modal': inModal && !(useNativeHtmlList && editMode)
          }"
          data-test="portalFolder"
        >
          <component
            :is="useNativeHtmlList ? 'li' : 'div'"
            v-for="(tile, index) in filteredTiles"
            :key="tile.id"
            :class="`portal-folder__thumbnail ${isMoreThanFiveOrTen(index)}`"
            :inert="!inModal"
          >
            <portal-tile
              :id="`${inModal ? 'modal-' : 'folder-'}${tile.id}`"
              :ref="'portalFolderChildren' + index"
              :layout-id="tile.layoutId"
              :dn="tile.dn"
              :super-dn="dn"
              :title="tile.title"
              :description="tile.description"
              :keywords="tile.keywords"
              :activated="tile.activated"
              :anonymous="tile.anonymous"
              :background-color="tile.backgroundColor"
              :links="tile.links"
              :allowed-groups="tile.allowedGroups"
              :link-target="tile.linkTarget"
              :target="tile.target"
              :original-link-target="tile.originalLinkTarget"
              :path-to-logo="tile.pathToLogo"
              :minified="!inModal"
              :from-folder="true"
            />
          </component>
          <div
            v-if="editMode && inModal && !useNativeHtmlList"
            class="portal-folder__thumbnail portal-folder__thumbnail--tile-add"
          >
            <div class="portal-tile__root-element">
              <tile-add
                :for-folder="true"
                :super-dn="dn"
                :super-layout-id="layoutId"
              />
            </div>
          </div>
        </component>
        <div
          v-if="editMode && inModal && useNativeHtmlList"
          class="portal-folder__thumbnail portal-folder__thumbnail--tile-add"
        >
          <div class="portal-tile__root-element">
            <tile-add
              :for-folder="true"
              :super-dn="dn"
              :super-layout-id="layoutId"
            />
          </div>
        </div>
      </component>
    </tabindex-element>
    <span
      :id="`${id}-content`"
      class="portal-folder__name"
      @click="openFolder"
      @keydown.enter="openFolder"
      @keydown.space.prevent="openFolder"
    >
      {{ $localized(title) }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { mapGetters } from 'vuex';
import Region from '@/components/activity/Region.vue';
import TabindexElement from '@/components/activity/TabindexElement.vue';
import PortalTile from '@/components/PortalTile.vue';
import Draggable from '@/mixins/Draggable.vue';
import IconButton from '@/components/globals/IconButton.vue';
import TemplateWrapper from '@/components/globals/TemplateWrapper.vue';
import TileAdd from '@/components/admin/TileAdd.vue';
import { LocalizedString, Tile, TileOrFolder } from '@/store/modules/portalData/portalData.models';
import _ from '@/jsHelper/translate';
import { doesTitleMatch, doesKeywordsMatch, doesDescriptionMatch } from '@/jsHelper/portalCategories';

export default defineComponent({
  name: 'PortalFolder',
  components: {
    PortalTile,
    IconButton,
    TileAdd,
    TabindexElement,
    Region,
    TemplateWrapper,
  },
  mixins: [
    Draggable,
  ],
  props: {
    id: {
      type: String,
      default: '',
    },
    layoutId: {
      type: String,
      required: true,
    },
    dn: {
      type: String,
      required: true,
    },
    superDn: {
      type: String,
      required: true,
    },
    title: {
      type: Object as PropType<LocalizedString>,
      required: true,
    },
    tiles: {
      type: Array as PropType<Tile[]>,
      required: true,
    },
    inModal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      lastDir: 'dragndrop/getLastDir',
      searchQuery: 'search/searchQuery',
      featureToggles: 'featureToggles/featureToggles',
      isTouchDevice: 'device/isTouchDevice',
    }),
    activeAt(): string[] {
      if (this.editMode) {
        return ['portal'];
      }
      return ['portal', 'header-search'];
    },
    ariaLabelFolder(): string | null {
      const numberOfItems = this.tiles.length;
      let itemString = '';
      if (this.tiles.length === 0) {
        itemString = _('No items');
      } else if (this.tiles.length === 1) {
        itemString = _('Item');
      } else {
        itemString = _('Items');
      }

      return !this.inModal ? `${this.$localized(this.title)} ${_('Folder')}: ${numberOfItems} ${itemString}` : null;
    },
    isOpened(): string {
      return this.inModal ? 'div' : 'button';
    },
    EDIT_FOLDER(): string {
      return _('Edit Folder: %(folder)s', { folder: this.$localized(this.title) });
    },
    MOVE_FOLDER(): string {
      return _('Move Folder: %(folder)s', { folder: this.$localized(this.title) });
    },
    CLOSE_FOLDER(): string {
      return _('Close Folder: %(folder)s', { folder: this.$localized(this.title) });
    },
    filteredTiles(): Tile[] {
      const filteredTiles = this.tiles.filter((tile) => (
        doesTitleMatch(tile as TileOrFolder, this.searchQuery) ||
        doesDescriptionMatch(tile as TileOrFolder, this.searchQuery) ||
        doesKeywordsMatch(tile as TileOrFolder, this.searchQuery)
      ));
      if (filteredTiles.length === 0) {
        return this.tiles;
      }
      return filteredTiles;
    },
    useNativeHtmlList(): boolean {
      return this.featureToggles.native_html_list ?? false;
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.updateZoomQuery);
    });

    if (this.$refs.mover) {
      // @ts-ignore
      this.handleDragFocus(this.$refs.mover.$el, this.lastDir);
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateZoomQuery);
  },
  methods: {
    async dropped() {
      if (!this.editMode || !this.inModal) {
        return;
      }
      this.$store.dispatch('portalData/saveLayout');
    },
    closeFolder(): void {
      this.$store.dispatch('modal/closeFolder');
    },
    openFolder(ev: Event) {
      if (this.inModal) {
        return;
      }
      this.$store.dispatch('modal/setAndShowModal', {
        name: 'PortalFolder',
        props: { ...(this.$props as object), id: `${this.id}-modal`, inModal: true },
      });
      this.$store.dispatch('activity/setRegion', `${this.id}-modal-content`);
      ev.stopPropagation();
    },
    editFolder() {
      this.$store.dispatch('modal/setAndShowModal', {
        name: 'AdminFolder',
        stubborn: true,
        props: {
          modelValue: this.$props,
          superDn: this.superDn,
          label: _('Edit folder'),
        },
      });
    },
    isMoreThanFiveOrTen(index): string {
      let classSuffix = '';
      if (!this.inModal) {
        if (index === 3 && this.tiles.length > 4) {
          classSuffix = 'portal-folder__thumbnail--mobile';
        } else if (index === 8 && this.tiles.length >= 10) {
          classSuffix = 'portal-folder__thumbnail--desktop';
        }
      }
      return classSuffix;
    },
    updateZoomQuery(): boolean {
      const browserZoomLevel = Math.round((window.devicePixelRatio * 100) / 2);
      // BROWSER ZOOM DEFAULT: 100
      // MOBILE ZOOM DEFAULT: 100 - 150
      // BROWSER ZOOM WCAG2.1 AA: 200
      return !!browserZoomLevel && browserZoomLevel >= 200;
    },
  },
});
</script>

<style lang="stylus">
.portal-folder
  position: relative
  width: var(--app-tile-side-length)
  display: flex
  flex-direction: column
  align-items: center
  cursor: pointer

  &__name
    font-weight: var(--font-weight-bold)
    text-align: center
    width: 100%
    word-wrap: break-word
    hyphens: auto

  &__in-modal
    cursor: default
    width: calc(3*var(--app-tile-side-length))
    max-width: @width

    .portal-tile__root-element
      align-items: flex-start!important;

    button
      text-transform: none

    .portal-folder__name
      font-size: var(--font-size-1)
      width: 100%

    > .portal-tile

      &__box // Big FOLDER
        width: calc(5 * var(--app-tile-side-length))
        height: @width
        max-width: 100vw
        margin-bottom: calc(2 * var(--layout-spacing-unit))
        max-height: 80vh
        border-radius: 2rem

        @media $mqSmartphone
          max-width: 90vw
          margin-bottom: 0
          max-height: 90vw
          border-radius: 2rem

        &--accessible-zoom
          @media $mqSmartphone
            max-height: calc(100vh -  var(--portal-header-height) - (10 * var(--layout-spacing-unit)));
            margin-top: calc(var(--portal-header-height) + var(--layout-spacing-unit));

        .portal-tile
          width: var(--app-tile-side-length)

          &__box
            width: var(--app-tile-side-length)
            height: @width
            margin-bottom: calc(2 * var(--layout-spacing-unit))
    .portal-folder__thumbnail
      margin-bottom: calc(5 * var(--layout-spacing-unit))

    .portal-folder__thumbnails .portal-tile__name
        display: block;

  &__thumbnails
    width: 100%
    height: 100%
    display: flex
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    padding: 0.3rem;
    box-sizing: border-box;
    overflow: hidden
    outline: 0
    > div
        display: flex
        align-content: center
        justify-content: center

    &--display-contents
      display: contents

    &--in-modal
      max-height: calc(100vh - var(--portal-header-height) - var(--portal-header-height) - var(--portal-header-height));
      overflow: auto
      box-sizing: border-box;
      padding:  var(--portal-folder-padding)
      padding-bottom: 0

      > div
        height: auto
      .portal-folder__thumbnail--tile-add
        align-items: start
      .portal-folder__thumbnail:after {
        display: none;
      }
      .portal-folder__thumbnail:nth-child(n+10)
        display: block
    .portal-tile--minified:focus .portal-tile__box
      border-color: transparent

    .portal-tile
      width: calc(0.25 * var(--app-tile-side-length))

      &__box
        width: calc(0.25 * var(--app-tile-side-length))
        height: @width
        padding:  calc(var(--layout-spacing-unit))
        margin-bottom: 0

      &__name
        display: none
      &__root-element
        align-items: center
      ^[0]__thumbnail
        margin-bottom: 0
        display: flex
        align-content: center
        justify-content: center
        width: var(--portal-folder-tile-width)
        height: var(--portal-folder-tile-width)

        @media $mqSmartphone
          height: 50%
          width: var(--portal-folder-tile-width)
          max-width: 50%

  .portal-tile__box
    background-color: var(--bgc-content-container)
    padding: 0
    overflow: hidden

    .portal-tile__box
      background-color: var(--bgc-apptile-default)

  &__thumbnail
    &:nth-child(n+10)
      display: none
    &--desktop
      position: relative

      .portal-tile__box
        box-shadow: none

      &:after
          content: '...'
          position: absolute
          width: 100%
          height: @width
          top: 0
          bottom:0
          right: 0
          line-height: 300%
          background-color: var(--bgc-content-container)
          pointer-events: none
        @media $mqSmartphone
          display: none

    &--mobile
      position: relative

      &:after
        @media $mqSmartphone
          content: '...'
          position: absolute
          width: 100%
          height: @width
          top: 0
          bottom:0
          right: 0
          line-height: 300%
          background-color: var(--bgc-content-container)
          pointer-events: none

   > .portal-tile__icon-bar
    top: calc(-12 * var(--layout-spacing-unit-small))

</style>
