<template>
  <div class="portal-search">
    <input
      ref="portalSearchInput"
      v-model="portalSearch"
      type="text"
      class="portal-search__input"
      @input="searchTiles"
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
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.portalSearchInput.focus();
    });
  },
  computed: {
    ...mapGetters({
      originalArray: 'categories/categoryStateOriginal',
      modalState: 'modal/modalState',
    }),
  },
  methods: {
    searchTiles() {
      const that = this;
      let list = this.originalArray;

      if (this.portalSearch !== '') {
        console.log(this.originalArray);
        list = this.originalArray.map((element) => ({
          ...element,
          title: element.title,
          tiles: element.tiles.filter((tile) => tile.title.toLowerCase().includes(this.portalSearch.toLowerCase()) ||
            tile.description.toLowerCase().includes(this.portalSearch.toLowerCase()) ||
            element.title.toLowerCase().includes(this.portalSearch.toLowerCase())),
        }));
      }
      this.newList = list;
      this.$store.dispatch('categories/filterTiles', this.newList);
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
