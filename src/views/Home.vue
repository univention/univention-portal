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
      <button @click="switchLocale">
        <portal-icon
          icon="flag"
          icon-width="1em"
        />
        Switch Language
      </button>

      <template v-if="categoryArray">
        <portal-category
          v-for="(category, index) in categoryArray"
          :key="index"
          :title="category.title"
          :tiles="category.tiles"
        />
      </template>
    </div>

    <portal-modal
      :is-active="modalState"
      @click="closeModal"
    >
      <component
        :is="modalComponent"
        v-bind="modalProps"
      />
    </portal-modal>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

import PortalCategory from 'components/PortalCategory.vue'; // @ is an alias to /src
import PortalIcon from '@/components/globals/PortalIcon.vue';
import PortalHeader from '@/components/PortalHeader.vue';
import PortalTile from '@/components/PortalTile.vue';
import PortalStandby from '@/components/PortalStandby.vue';
import PortalFolder from '@/components/PortalFolder.vue';
import PortalModal from '@/components/globals/PortalModal.vue';

import userMixin from '@/mixins/userMixin.vue';

@Options({
  name: 'Home',
  components: {
    PortalCategory,
    PortalHeader,
    PortalTile,
    PortalIcon,
    PortalStandby,
    PortalFolder,
    PortalModal,
  },
  data() {
    return {
      categoryList: [],
    };
  },
  mixins: [userMixin],
  computed: {
    ...mapGetters({
      categories: 'categories/categoryState',
      filteredCategories: 'categories/categoryState',
      originalArray: 'categories/categoryState',
      modalState: 'modal/modalState',
      modalComponent: 'modal/modalComponent',
      modalProps: 'modal/modalProps',
      modalStubborn: 'modal/modalStubborn',
      // portalData: 'portalData/getPortal', // access portal data ;)
    }),
    categoryArray() {
      let catArray = this.originalArray;
      this.$nextTick(() => {
        catArray = this.filteredCategories ? this.filteredCategories : this.originalArray;
      });

      this.categoryList = catArray;

      return catArray;
    },
  },
  mounted() {
    // this.$store.dispatch('categories/setCategoryData');
  },
  methods: {
    closeModal() {
      if (!this.modalStubborn) {
        this.$store.dispatch('modal/setHideModal');
      }
    },
    devEmpty() {
      this.$store.dispatch('categories/setDevEmpty');
    },
    devFolder() {
      this.$store.dispatch('categories/setDevFolder');
    },
    devStandard() {
      this.$store.dispatch('categories/setDevStandard');
    },
    switchLocale() {
      if (this.$store.state.locale.locale === 'en_US') {
        this.$store.dispatch('locale/setLocale', { locale: 'de_DE' });
      } else {
        this.$store.dispatch('locale/setLocale', { locale: 'en_US' });
      }
    },
  },
})

export default class Home extends Vue {}
</script>

<style scoped lang="stylus">
.portal
  position: relative;
  padding: calc(7 * var(--layout-spacing-unit)) calc(6 * var(--layout-spacing-unit));
  button svg /* just during dev anyway */
    color: black
</style>
