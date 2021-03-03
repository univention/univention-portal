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
          :drop-zone="index"
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

<script>
import { mapGetters } from 'vuex';

import PortalIframe from 'components/PortalIframe';
import PortalCategory from 'components/PortalCategory';
import PortalIcon from '@/components/globals/PortalIcon';
import PortalHeader from '@/components/PortalHeader';
import PortalFolder from '@/components/PortalFolder';
import PortalModal from '@/components/globals/PortalModal';

import PortalBackground from '@/components/PortalBackground';
import CookieBanner from '@/components/CookieBanner';

import notificationMixin from '@/mixins/notificationMixin';

export default {
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
  mixins: [notificationMixin],
  data() {
    return {
      categoryList: [],
    };
  },
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
      let categoryTempArray = this.originalArray;
      this.$nextTick(() => {
        categoryTempArray = this.filteredCategories ? this.filteredCategories : this.originalArray;
      });

      // TODO: fix it!
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.categoryList = categoryTempArray;

      return categoryTempArray;
    },
  },
  methods: {
    closeModal() {
      if (!this.modalStubborn) {
        this.$store.dispatch('modal/setHideModal');
      }
    },
  },
};
</script>

<style scoped lang="stylus">
.portal-categories
  position: relative;
  // z-index: 1;
  padding: calc(7 * var(--layout-spacing-unit)) calc(6 * var(--layout-spacing-unit));

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
