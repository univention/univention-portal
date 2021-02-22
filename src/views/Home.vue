<template>
  <div class="portal">
    <portal-header />

    <div
      v-show="!activeTabIndex"
      class="portal-categories"
    >
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

      <portal-category
        v-for="(category, index) in categories"
        :key="index"
        :title="category.title"
        :tiles="category.tiles"
      />
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
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

import PortalIframe from 'components/PortalIframe.vue';
import PortalCategory from 'components/PortalCategory.vue';
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
    PortalFolder,
    PortalHeader,
    PortalIcon,
    PortalIframe,
    PortalModal,
    PortalStandby,
    PortalTile,
  },
  mixins: [userMixin],
  computed: {
    ...mapGetters({
      categories: 'categories/categoryState',
      modalState: 'modal/modalState',
      modalComponent: 'modal/modalComponent',
      modalProps: 'modal/modalProps',
      modalStubborn: 'modal/modalStubborn',
      tabs: 'tabs/allTabs',
      activeTabIndex: 'tabs/activeTabIndex',
      // portalData: 'portalData/getPortal', // access portal data ;)
    }),
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
.portal-categories
  position: relative;
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
