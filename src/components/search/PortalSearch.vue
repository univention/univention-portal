<template>
  <div class="portal-search">
    <input
      ref="portal-search__input"
      v-model="portalSearch"
      type="text"
      class="portal-search__input"
    >
  </div>
  <button @click="heck" />
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
  mounted() {
    console.log('TEST', this.categories);
  },
  computed: {
    ...mapGetters({
      categories: 'categories/categoryState',
      loading: 'loading/loadingState',
    }),
    filterByTextInput() {
      this.categories.filter((item) => item.title.includes(this.PortalSearch));
    },
  },
  methods: {
    heck() {
      this.categories.forEach((category, categoryIndex) => {
        category.tiles.forEach((tile, tileIndex) => {
          if (tile.title.toLowerCase().includes(this.portalSearch.toLowerCase())) {
            if (!this.newList.length) {
              this.newList.push({ title: category.title });
            }
            this.newList.forEach((object, index) => {
              if (!object.title === category.title) {
                this.newList.push({ title: category.title });
              }
            });
            if (this.newList[categoryIndex] && category) {
              if (this.newList[categoryIndex].title === category.title) {
                this.tileArray.push(tile);
                this.newList[categoryIndex].tiles = this.tileArray;
              }
            }
          }
        });
      });
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
