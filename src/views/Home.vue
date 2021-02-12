<template>
  <div>
    <portal-header />

    <div class="portal">
      <button @click="devEmpty">
        <portal-icon
          icon="circle"
          icon-width="1em"
        />
        Empty
      </button>
      <button @click="devStandard">
        <portal-icon
          icon="check-circle"
          icon-width="1em"
        />
        Standard
      </button>
      <button @click="devFolder">
        <portal-icon
          icon="folder"
          icon-width="1em"
        />
        Folder
      </button>
      <button @click="login">
        <portal-icon
          icon="log-in"
          icon-width="1em"
        />
        Login
      </button>
      <button @click="logout">
        <portal-icon
          icon="log-out"
          icon-width="1em"
        />
        Logout
      </button>

      <portal-category
        v-for="(category, index) in categoryArray"
        :key="index"
        :title="category.title"
        :tiles="category.tiles"
      />
    </div>

    <portal-standby v-if="loading" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

import PortalCategory from 'components/PortalCategory.vue'; // @ is an alias to /src
import PortalIcon from '@/components/globals/PortalIcon.vue';
import PortalHeader from '@/components/PortalHeader.vue';
import PortalStandby from '@/components/PortalStandby.vue';

import userMixin from '@/mixins/userMixin.vue';

@Options({
  name: 'Home',
  components: {
    PortalCategory,
    PortalHeader,
    PortalIcon,
    PortalStandby,
  },
  data() {
    return {
      categoryList: [],
    };
  },
  mounted() {
    console.log(this.categories);
    this.$store.dispatch('categories/storeOriginalArray', this.categories);
  },
  mixins: [userMixin],
  computed: {
    ...mapGetters({
      categories: 'categories/categoryState',
      filteredCategories: 'categories/categoryState',
      originalArray: 'categories/categoryState',
      loading: 'loading/loadingState',
    }),
    categoryArray() {
      this.$nextTick(() => {
        this.categoryList = this.filteredCategories ? this.filteredCategories : this.originalArray;
        return this.categoryList;
      });
    },
  },
  methods: {
    devEmpty() {
      this.$store.dispatch('categories/setDevEmpty');
    },
    devFolder() {
      this.$store.dispatch('categories/setDevFolder');
    },
    devStandard() {
      this.$store.dispatch('categories/setDevStandard');
    },
  },
})
export default class PortalHome extends Vue {}
</script>

<style scoped lang="stylus">
.portal
  position: relative;
  padding: calc(7 * var(--layout-spacing-unit)) calc(6 * var(--layout-spacing-unit));
  button svg /* just during dev anyway */
    color: black
</style>
