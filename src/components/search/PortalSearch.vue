<template>
  <div class="portal-search">
    <input
      ref="portal-search__input"
      v-model="portalSearch"
      type="text"
      class="portal-search__input"
      @input="heck2"
    >
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

@Options({
  name: 'PortalSearch',
  props: {},
  data() {
    return {
      modalVisible: false,
      portalSearch: '',
      newList: [],
      tileArray: [],
    };
  },
  computed: {
    ...mapGetters({
      originalArray: 'categories/categoryState',
      loading: 'loading/loadingState',
    }),
    filterByTextInput() {
      this.originalArray.filter((item) => item.title.includes(this.PortalSearch));
    },
  },
  methods: {
    heck2() {
      const that = this;
      const list = this.originalArray.map((element) => ({
        ...element,
        tiles: element.tiles.filter((tile) => tile.title.toLowerCase().includes(that.portalSearch.toLowerCase())),
      }));
      this.newList = list;
      this.$store.dispatch('categories/filterTiles', this.newList);
    },
  },
})
export default class PortalModal extends Vue {}
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
