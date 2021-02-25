<template>
  <div class="portal-category">
    <h2 class="portal-category__title">
      {{ hasTiles(tiles) }}
    </h2>
    <div class="portal-category__tiles">
      <template
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
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import PortalTile from '@/components/PortalTile.vue';
import PortalFolder from '@/components/PortalFolder.vue';

import Translate from '@/i18n/Translate.vue';

import { mapGetters } from 'vuex';

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
  computed: {
    ...mapGetters({
      searchQuery: 'search/searchQuery',
    }),
  },
  methods: {
    isTile(obj) { // obj: typeof PortalTile -> make it work with this
      const tileTitle = obj.title;
      return !this.isFolder(obj) && this.$localized(tileTitle).toLowerCase()
        .includes(this.searchQuery.toLowerCase());
    },
    isFolder(obj) { // obj: typeof PortalTile -> make it work with this
      if (obj instanceof PortalFolder) {
        obj.tiles.forEach((tile) => this.$localized(tile.title).toLowerCase()
          .includes(this.searchQuery.toLowerCase()) && obj instanceof PortalFolder);
      }
    },
    hasTiles(tiles) {
      console.log('tiles', this.$localized(this.title));
      console.log('tiles', tiles);
      return this.title;
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
