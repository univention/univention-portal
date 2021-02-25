<template>
  <div class="portal-search">
    <input
      ref="portalSearchInput"
      v-model="portalSearch"
      type="text"
      class="portal-search__input"
      @input="searchTiles"
      @keyup.esc="closeSearchInput()"
    >
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

@Options({
  name: 'PortalSearch',
  data() {
    return {
      portalSearch: '',
      newList: '',
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.portalSearchInput.focus();
    });
  },
  beforeUnmount() {
    this.$store.dispatch('categories/filterTiles', this.originalArray);
  },
  computed: {
    ...mapGetters({
      originalArray: 'categories/categoryStateOriginal',
      modalState: 'modal/modalState',
      searchQuery: 'search/searchQuery',
    }),
  },
  methods: {
    searchTiles() {
      this.$store.dispatch('search/setSearchQuery', this.portalSearch.toLowerCase());

      // if (this.portalSearch !== '') {
      //   list = this.originalArray.map((element) => ({
      //     ...element,
      //     title: element.title,
      //     tiles: element.tiles.filter((tile) => this.$localized(tile.title).toLowerCase()
      //       .includes(this.portalSearch.toLowerCase()) ||
      //         this.$localized(tile.description).toLowerCase()
      //           .includes(this.portalSearch.toLowerCase()) ||
      //         this.$localized(element.title).toLowerCase()
      //           .includes(this.portalSearch.toLowerCase())),
      //   }));
      // }
      // this.newList = list;
    },
    closeSearchInput() {
      this.portalSearch = '';
      this.newList = '';
      this.$store.dispatch('categories/filterTiles', this.originalArray);
      this.$store.dispatch('navigation/setActiveButton', '');
    },
  },
})

export default class PortalSearch extends Vue {}
</script>

<style lang="stylus">
.portal-search {
  &__input {
    height: 5.8rem;
    width: 100%;
    background-color: transparent;
    color: #fff;
    border: 1px solid white;
    border-radius: var(--border-radius-interactable);
    __border-radius: var(--border-radius-interactable);
    font-size: 2rem;
    padding-left: 2rem;
    box-sizing: border-box;

    &:focus {
      border-color: var(--color-primary);
      outline: none;
    }
  }
}
</style>
