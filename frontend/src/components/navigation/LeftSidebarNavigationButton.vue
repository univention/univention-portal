<!--
  Copyright 2021-2024 Univention GmbH

  https://www.univention.de/

  All rights reserved.

  The source code of this program is made available
  under the terms of the GNU Affero General Public License version 3
  (GNU AGPL V3) as published by the Free Software Foundation.

  Binary versions of this program provided by Univention to you as
  well as other copyrighted, protected or trademarked materials like
  Logos, graphics, fonts, specific documentations and configurations,
  cryptographic keys etc. are subject to a license agreement between
  you and Univention and not subject to the GNU AGPL V3.

  In the case you use this program under the terms of the GNU AGPL V3,
  the program is provided in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License with the Debian GNU/Linux or Univention distribution in file
  /usr/share/common-licenses/AGPL-3; if not, see
  <https://www.gnu.org/licenses/>.
-->
<template>
  <button
    class="left-sidebar-navigation"
    :class="{ 'left-sidebar-navigation--active': isMenuActive }"
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
  width: 68px
  height: 60px
  flex-shrink: 0
  background: var(--button-bgc)
  border-radius: 0

  @media $mqSmartphone
    width: 50px
    height: 50px

  &:hover
    background-color: var(--color-accent)

  &:focus
    outline: none
    background-color: var(--color-accent)

  &:active
     background-color: var(--color-accent)

  &--active
    background-color: var(--color-accent)
</style>
