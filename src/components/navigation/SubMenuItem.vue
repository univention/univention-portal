<template>
  <div
    id="umcMenuCertificates__slide"
    class="menuSlide visibleSlide topLevelSlide"
  >
    <div
      class="menuSlideHeader fullWidthTile subMenu"
    >
      <!-- <svg class="featherIcon icon-chevron-left" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use xlink:href="/univention/js/dijit/themes/umc/images/feather-sprite.svg#chevron-left"></use></svg> -->
      <div
        data-dojo-attach-point="labelNode"
      >
        Certificates
      </div>
    </div>
    <div
      id="umc_widgets_ContainerWidget_5"
      class="umcContainerWidget menuSlideItemsContainer"
    >
      <div
        id="umc_menu_MenuItem_0"
        class="menuItem fullWidthTile"
      >
        Root certificate
      </div>
      <div
        id="umc_menu_MenuItem_1"
        class="menuItem fullWidthTile"
      >
        Certificate revocation list
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import PortalIcon from '@/components/globals/PortalIcon.vue';

@Options({
  name: 'SubMenuItem',
  components: {
    PortalIcon,
  },
  props: {
    menuLabel: {
      type: String,
      default: '',
    },
    subMenu: {
      type: Array,
      default: () => [],
    },
  },
})

export default class SubMenuItem extends Vue {}
</script>

<style lang="stylus">
.mobileMenu .menuSlides.popupSlideNormalTransition .menuSlide {
    transform: translate3d(100%, 0, 0);
    -ms-transform: translate(100%, 0);
}
.mobileMenu .menuSlides .menuSlide {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    transition: transform cubic-bezier(0.4, 0, 0.6, 1) 0.15s;
}
.mobileMenu .menuSlides, .mobileMenu .menuSlide {
    position: absolute;
    z-index: 0;
    background: inherit;
}
*, p, label, h1, h2, h3, h4, h5, h6, input, .dijitReset, .dijitTitlePaneTitleFocus .dijitTitlePaneTextNode, .umc .dijitCalendar table .dijitCalendarDayLabelTemplate .dijitCalendarDayLabel, .umcModuleTitle, .umc .umcUDMDetailPage .umcPageHeader h2 {
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    color: inherit;
}
.mobileMenu .menuSlides .topLevelSlide {
    z-index: 1;
}

.mobileMenu .menuSlideHeader.subMenu {
    cursor: pointer;
}
.mobileMenu .menuSlideHeader {
    cursor: default;
    padding-left: 15px;
    margin-bottom: 8px;
    font-weight: 500;
    text-transform: uppercase;
}
.mobileMenu .fullWidthTile {
    position: relative;
    display: flex;
    align-items: center;
    padding: 1em 0;
}

.mobileMenu .menuSlideHeader .featherIcon {
    margin-right: 0.5rem;
}

svg:not(:root) {
    overflow: hidden;
}
.featherIcon {
    font-size: inherit;
    width: 1em;
    height: 1em;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
    transition: color 250ms;
}
</style>
