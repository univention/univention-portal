<template>
  <div class="portal-category">
    <h2 class="portal-category__title">
      {{ $localized(title) }}
    </h2>
    <div class="portal-category__tiles dragdrop__container">
      <template v-if="editMode">
        <draggable-wrapper
          v-model="vTiles"
          :drop-zone-id="dropZone"
          :data-drop-zone-id="dropZone"
          transition="100"
          class="dragdrop__drop-zone"
        >
          <template #item="{ item }">
            <div class="dragdrop__draggable-item">
              <portal-tile
                v-if="isTile(item)"
                v-bind="item"
                :data-tile="$localized(item.title)"
                :title="item.title"
              />

              <portal-folder
                v-if="isFolder(item)"
                v-bind="item"
                :data-folder="$localized(item.title)"
              />
            </div>
          </template>
        </draggable-wrapper>
      </template>

      <template v-else>
        <div
          v-for="(tile, index) in tiles"
          :id="index"
          :key="index"
        >
          <portal-tile
            v-if="isTile(tile)"
            v-bind="tile"
          />
          <portal-folder
            v-if="isFolder(tile)"
            v-bind="tile"
          />
        </div>
      </template>
    </div>

    <draggable-debugger
      v-if="editMode && debug"
      :items="vTiles"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

import PortalTile from '@/components/PortalTile.vue';
import PortalFolder from '@/components/PortalFolder.vue';

import DraggableWrapper from '@/components/dragdrop/DraggableWrapper.vue';
import DraggableDebugger from '@/components/dragdrop/DraggableDebugger.vue';

@Options({
  name: 'PortalCategory',
  components: {
    PortalTile,
    PortalFolder,
    DraggableWrapper,
    DraggableDebugger,
  },
  props: {
    title: {
      type: Object,
      required: true,
    },
    tiles: {
      type: Array,
      required: true,
    },
    dropZone: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      vTiles: this.tiles,
      isActive: false,
      debug: false, // `true` enables the debugger for the tiles array(s) in admin mode
      toolTip: {},
    };
  },
  watch: {
    vTiles(val) {
      // TODO: save drag & drop changes
      console.info('saveState');
      console.log('val: ', val);
    },
  },
  computed: {
    ...mapGetters({
      editMode: 'portalData/editMode',
    }),
  },
  methods: {
    isTile(obj: PortalTile | PortalFolder): boolean {
      return !this.isFolder(obj);
    },
    isFolder(obj: PortalTile | PortalFolder): obj is PortalFolder {
      return 'tiles' in obj;
    },
    changed() {
      console.log('changed');
    },
  },
})

export default class PortalCategory extends Vue {
  title!: Record<string, string>;

  tiles!: Array<PortalTile>;
}
</script>

<style lang="stylus">
.portal-category
  margin-bottom: calc(10 * var(--layout-spacing-unit));

  &__tiles
    display: grid
    grid-template-columns: repeat(auto-fill, var(--app-tile-side-length))
    grid-gap: calc(6 * var(--layout-spacing-unit))

  &__drop-zone
    &--hidden
      display: none

  &__drag-element
    height: 210px
    width: 160px

  &__tile-dotted
    width: calc(20 * var(--layout-spacing-unit))
    height: calc(20 * var(--layout-spacing-unit))
    border-radius: 15%
    border: 3px dashed var(--color-grey40) !important

</style>
