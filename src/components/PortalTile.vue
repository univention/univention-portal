<template>
  <div>
    <component
      :is="wrapperTag"
      :href="link"
      :target="setLinkTarget"
      class="portal-tile"
      data-test="tileLink"
      @mouseover="editMode || showTooltip()"
      @mouseleave="hideTooltip"
      @mousedown="hideTooltip"
      @click="tileClick"
      @keydown.tab.exact="setFocus($event)"
      @keydown.shift.tab.exact="setFocus($event)"
    >
      <div
        :style="`background: ${backgroundColor}`"
        :class="[
          'portal-tile__box', { 'portal-tile__box--dragable': editMode }
        ]"
      >
        <img
          :src="pathToLogo"
          :alt="`Logo ${$localized(title)}`"
          class="portal-tile__img"
        >
      </div>
      <span class="portal-tile__name">
        {{ $localized(title) }}
      </span>
    </component>
    <portal-tool-tip
      v-if="isActive"
      :title="$localized(title)"
      :icon="pathToLogo"
      :description="$localized(description)"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

import PortalToolTip from '@/components/PortalToolTip.vue';
import TileClick from '@/mixins/TileClick.vue';

@Options({
  name: 'PortalTile',
  components: {
    PortalToolTip,
  },
  mixins: [
    TileClick,
  ],
  props: {
    title: {
      type: Object,
      required: true,
    },
    description: {
      type: Object,
      required: true,
    },
    pathToLogo: {
      type: String,
      required: false,
      default: 'questionMark.svg',
    },
    backgroundColor: {
      type: String,
      default: 'var(--color-grey40)',
    },
    inFolder: {
      type: Boolean,
      default: false,
    },
    hasFocus: {
      type: Boolean,
      default: false,
    },
    lastElement: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['makeStuff'],
  data() {
    return {
      isActive: false,
    };
  },
  mounted() {
    if (this.hasFocus) {
      this.$el.children[0].focus(); // sets focus to first Element in opened Folder
    }
  },
  computed: {
    wrapperTag(): string {
      return (this.inFolder || this.editMode) ? 'div' : 'a';
    },
    setLinkTarget(): string | null {
      if (this.editMode || this.linkTarget !== 'newwindow') {
        return null;
      }
      return '_blank';
    },
  },
  methods: {
    hideTooltip(): void {
      this.isActive = false;
    },
    showTooltip(): void {
      if (!this.inFolder) {
        this.isActive = true;
      }
    },
    setFocus(event): void {
      if (this.lastElement) {
        event.preventDefault();
        console.log('emmitting forward');
        this.$emit('makeStuff', 'forward');
      } else if (this.firstElement) {
        console.log('emitting backward');
        this.$emit('makeStuff', 'backward');
      }
    },
  },
})
export default class PortalTile extends Vue {
  title!: Object;

  description!: Object;

  links!: String[];

  pathToLogo?: String;

  backgroundColor = 'var(--color-grey40)';
}
</script>

<style lang="stylus">
.portal-tile
  position: relative
  outline: 0
  width: var(--app-tile-side-length)
  display: flex
  flex-direction: column
  align-items: center
  cursor: pointer
  color: var(--font-color-contrast-high)
  text-decoration: none

  &:hover
    color: var(--font-color-contrast-high)
    text-decoration: none

  &__box
    border-radius: 15%
    display: flex
    align-items: center
    justify-content: center
    box-shadow: var(--box-shadow)
    background: var(--color-grey40)
    width: var(--app-tile-side-length)
    height: @width
    margin-bottom: calc(2 * var(--layout-spacing-unit))
    border: 0.2rem solid transparent

    ~/:focus &
      border-color: var(--color-primary)

    &--dragable
      position: relative

      &:after
        content: ' ';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: $zindex-1;

  &__img
    width: 80%

  &__name
    text-align: center
    width: 100%
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
</style>
