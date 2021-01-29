<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Tile title="ownCloud" link="https://www.owncloud.com" />
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Tile from "@/components/Tile.vue"; // @ is an alias to /src

@Options({
  components: {
    Tile
  }
})
export default class About extends Vue {}
</script>
