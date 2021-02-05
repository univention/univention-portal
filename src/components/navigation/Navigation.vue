<template>
  <nav class="navigation">
    <ul>
      <li>lkasjdlaksdj</li>
      <li>lkasjdlaksdj</li>
      <li>lkasjdlaksdj</li>
      <li>lkasjdlaksdj</li>
    </ul>
  </nav>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "Navigation",
  props: {},
  computed: {},
})
export default class Navigation extends Vue {}
</script>
<style lang="stylus">
.navigation
  height: calc(100vh - (var(--portal-header-height) + 0.5rem));

  a
    color: #fff;
</style>
