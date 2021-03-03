<template>
  <a
    v-is="hasSubmenu ? 'div' : 'a'"
    class="menu-item"
    :href="bestLink"
  >
    <portal-icon
      v-if="subItem"
      icon="chevron-left"
      icon-width="2rem"
      class="menu-item__arrow menu-item__arrow--left"
    />
    {{ menuLabel }}
    
    <template
      v-if="subMenu.length > 0"
    >
      <div
        class="menu-item__counter"
      >
        {{ subMenu.length }}
      </div>
      <portal-icon
        v-if="!subItem"
        icon="chevron-right"
        icon-width="2rem"
        class="menu-item__arrow menu-item__arrow--right"
      />
    </template>
  </a>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';
import bestLink from '@/jsHelper/bestLink.js';

import PortalIcon from '@/components/globals/PortalIcon.vue';

@Options({
  name: 'MenuItem',
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
    subItem: {
      type: Boolean,
      default: false,
    },
    menuLink: {
      type: Array,
    },
    isSubMenuParent: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      metaData: 'meta/getMeta',
    }),
    bestLink(): string {
      return this.menuLink ? bestLink(this.menuLink, this.metaData.fqdn) : '';
    },
    hasSubmenu(): boolean {
      return this.subMenu.length > 0 && (!this.subItem || this.isFirstSubItem);
    },
    isFirstSubItem(): boolean {
      return this.subItem && this.isSubMenuParent;
    },
  },
})

export default class MenuItem extends Vue {}
</script>

<style lang="stylus">
.menu-item
  position: relative
  z-index: 15
  display: flex
  align-items: center
  padding: 20px 0 20px 20px

  &:hover
    background-color: #272726
    cursor: pointer

  &__counter
    position: absolute
    right: 0
    margin-right: 40px
    display: inline

  &__arrow
    position: absolute
    display: inline
    font-size: inherit
    width: 1em
    height: 1em
    stroke: currentColor
    stroke-width: 2
    stroke-linecap: round
    stroke-linejoin: round
    fill: none
    transition: color 250ms
    &--left
      left: 12px
    &--right
      right: 0
      margin-right: 12px
</style>
