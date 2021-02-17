<template>
  <div
    id="_PortalIframesContainer_0"
    class="portal__iframeTabs"
    data-dojo-type="portal/_PortalIframeTabsContainer"
    data-dojo-attach-point="iframeTabs"
    widgetid="_PortalIframesContainer_0"
  >
    <div
      id="_PortalIframeTab_0"
      class="iframeTab"
      tabindex="0"
      widgetid="_PortalIframeTab_0"
    >
      <div class="iframeTab__background" />
      <img
        class="iframeTab__logo"
        src="/assets/img/svg/nav_tab_test.svg"
        alt="No Group logo"
      >
      <span
        class="iframeTab__title"
        title=""
        data-dojo-attach-point="titleNode"
      >
        No Group
      </span>
      <header-button
        aria-label="xyz"
        icon="x"
        class="iframeTab__closeButton"
        @click="dismissBubble"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HeaderButton from '@/components/header/HeaderButton.vue';

import userMixin from '@/mixins/userMixin.vue';

@Options({
  name: 'HeaderTabs',
  components: {
    HeaderButton,
  },
  mixins: [
    userMixin,
  ],
  // props: {
  //   icon: {
  //     type: String,
  //     required: true,
  //   },
  //   ariaLabel: {
  //     type: String,
  //     required: true,
  //   },
  // },

  methods: {
    // click() {
    //   if (this.isActiveButton) {
    //     this.$store.dispatch('navigation/setActiveButton', '');
    //   } else {
    //     this.$store.dispatch('navigation/setActiveButton', this.icon);
    //   }
    // },
  },

  computed: {
    // isActiveButton() {
    //   return this.$store.state.navigation.activeButton === this.icon;
    // },
  },
})

export default class HeaderTabs extends Vue {}
</script>

<style lang="stylus">
.portal__iframeTabs {
  display: flex;
  flex: 1 1 auto;
  margin-left: calc(5 * var(--layout-spacing-unit));

  &.iframeTab {
    --tabColor: transparent;
    outline: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    min-width: calc(30 * var(--layout-spacing-unit));
    position: relative;

    &__background {
      transition: background-color 250ms;
      position: absolute;
      top: 10px;
      right: -1px;
      bottom: 0;
      left: -1px;
      border-radius: 8px 8px 0 0;
      background-color: var(--tabColor);
      z-index: -1;
    }
  }
}
</style>
