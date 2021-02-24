<template>
  <div class="portal">
    <portal-background />
    <portal-header />

    <div
      v-show="!activeTabIndex"
      class="portal-categories"
    >
      <template v-if="categoryArray">
        <portal-category
          v-for="(category, index) in categoryArray"
          :key="index"
          :title="category.title"
          :tiles="category.tiles"
        />
      </template>
    </div>

    <div
      v-show="activeTabIndex"
      class="portal-iframes"
    >
      <portal-iframe
        v-for="(item, index) in tabs"
        :key="index"
        :link="item.iframeLink"
        :is-active="activeTabIndex == index + 1"
      />
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
    <cookie-banner />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

import PortalIframe from 'components/PortalIframe.vue';
import PortalCategory from 'components/PortalCategory.vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';
import PortalHeader from '@/components/PortalHeader.vue';
import PortalFolder from '@/components/PortalFolder.vue';
import PortalModal from '@/components/globals/PortalModal.vue';

import PortalBackground from '@/components/PortalBackground.vue';
import CookieBanner from '@/components/CookieBanner.vue';

import userMixin from '@/mixins/userMixin.vue';

@Options({
  name: 'Home',
  components: {
    PortalCategory,
    PortalFolder,
    PortalHeader,
    PortalIcon,
    PortalIframe,
    PortalModal,
    PortalBackground,
    CookieBanner,
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
      tabs: 'tabs/allTabs',
      activeTabIndex: 'tabs/activeTabIndex',
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
      this.$store.dispatch('categories/setStandard');
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
.portal-categories
  position: relative;
  // z-index: 1;
  padding: calc(7 * var(--layout-spacing-unit)) calc(6 * var(--layout-spacing-unit));

  /* just during dev anyway */
  button svg
    color: black

.portal-iframes
  position: fixed;
  top: var(--portal-header-height);
  border: 0px solid var(--color-grey8);
  border-top-width: var(--portal-header-to-content-seperator-height);
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
</style>
