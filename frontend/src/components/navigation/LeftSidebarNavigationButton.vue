<template>
  <button
    class="left-sidebar-navigation"
    type="button"
    aria-label="Open sidebar navigation"
    @click="toggleSidebar"
  >
    <waffle-icon />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import WaffleIcon from '../header/WaffleIcon.vue';

export default defineComponent({
  name: 'LeftSidebarNavigationButton',
  components: {
    WaffleIcon,
  },
  computed: {
    ...mapGetters({
      activeButton: 'navigation/getActiveButton',
    }),
    isMenuActive(): boolean {
      return this.activeButton === 'left-menu';
    },
  },
  methods: {
    toggleSidebar(): void {
      if (this.isMenuActive) {
        this.$store.dispatch('navigation/setActiveButton', '');
      } else {
        this.$store.dispatch('navigation/setActiveButton', 'left-menu');
      }
    },
  },
});
</script>

<style lang="stylus">
.left-sidebar-navigation
  display: flex
  align-items: center
  justify-content: center
  left: 0
  top: 0
  width: calc(var(--waffle-icon-height) + 0.5rem)
  height: calc(var(--waffle-icon-height))
  flex-shrink: 0
  background: var(--button-bgc)
  border-radius: 0

  @media $mqSmartphone
    width: 50px
    height: 50px

  &:hover,
  &:focus
    outline: none
    background-color: var(--color-accent)
</style>
