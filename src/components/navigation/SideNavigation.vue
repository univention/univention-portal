<template>
  <nav class="navigation">
    <ul>
      <li v-if="username">
        {{ username }}
      </li>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
      <li>Item 4</li>
      <li v-if="isAdmin">
        Portal bearbeiten
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "SideNavigation",
  computed: {
    username(): string {
      return this.$store.state.user.username;
    },
    isAdmin(): boolean {
      return this.$store.state.user.isAdmin;
    },
  }
})
export default class SideNavigation extends Vue {}
</script>

<style lang="stylus">
.navigation
  height: calc(100vh - (var(--portal-header-height) + 0.5rem));

  a
    color: #fff;
</style>
