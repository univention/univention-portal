<template>
  <div class="portal-category">
    <h2
      v-if="showCategoryHeadline"
      class="portal-category__title"
    >
      {{ $localized(title) }}
    </h2>
    <div class="portal-category__tiles">
      <template
        v-for="(tile, index) in tiles"
        :key="index"
      >
        <portal-tile
          v-if="isTile(tile)"
          v-bind="tile"
          :ref="'tile' + index"
          :tile="tile"
        />
        <portal-folder
          v-if="isFolder(tile)"
          :ref="'tile' + index"
          v-bind="tile"
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
      showCategoryHeadline: false,
    };
  },
  mounted() {
    this.hasTiles(this.tiles);
  },
  updated() {
    this.hasTiles(this.tiles);
  },
  computed: {
    ...mapGetters({
      searchQuery: 'search/searchQuery',
    }),
  },
  methods: {
    isTile(obj: any): boolean {
      return !this.isFolder(obj) && this.tileMatchesQuery(obj);
    },
    isFolder(obj: any): boolean {
      return !!obj.tiles && this.folderMatchesQuery(obj);
    },
    tileMatchesQuery(obj: any): boolean {
      return this.$localized(obj.title).toLowerCase()
        .includes(this.searchQuery.toLowerCase());
    },
    folderMatchesQuery(obj: any): boolean {
      let matchesQuery = false;
      obj.tiles.forEach((tile) => {
        if (this.$localized(tile.title).toLowerCase()
          .includes(this.searchQuery.toLowerCase())) {
          matchesQuery = true;
        }
      });
      return matchesQuery;
    },
    hasTiles(tiles) {
      const refArray = Object.entries(this.$refs);
      const children = refArray.filter((ref) => ref[1] !== null);
      if (children.length > 0) {
        this.showCategoryHeadline = true;
      } else {
        this.showCategoryHeadline = false;
      }
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
