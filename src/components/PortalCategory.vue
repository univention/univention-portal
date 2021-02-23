<template>
  <div class="portal-category">
    <h2 class="portal-category__title">
      {{ $localized(title) }}
    </h2>
    <div class="portal-category__tiles">
      <div
        v-for="(tile, index) in tiles"
        :key="index"
      >
        <portal-tile
          v-if="isTile(tile)"
          :title="$localized(tile.title)"
          :link="tile.link"
          :description="$localized(tile.description)"
          :tile="tile"
        />
        <portal-folder
          v-if="isFolder(tile)"
          :title="$localized(tile.title)"
          :tiles="tile.tiles"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PortalTile from '@/components/PortalTile.vue';
import PortalFolder from '@/components/PortalFolder.vue';

import Translate from '@/i18n/Translate.vue';

@Options({
  name: 'PortalCategory',
  components: {
    PortalTile,
    PortalFolder,
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
  },
  data() {
    return {
      isActive: false,
      toolTip: {},
    };
  },
  methods: {
    isTile(obj: typeof PortalTile) {
      return !this.isFolder(obj);
    },
    isFolder(obj: typeof PortalTile) {
      return obj instanceof PortalFolder;
    },
  },
})

export default class PortalCategory extends Vue {
  title!: object;

  tiles!: [PortalTile];
}
</script>

<style scoped lang="stylus">
.portal-category
  margin-bottom: calc(10 * var(--layout-spacing-unit));

  &__tiles
    display: grid
    grid-template-columns: repeat(auto-fill, var(--app-tile-side-length))
    grid-gap: calc(6 * var(--layout-spacing-unit))

</style>
