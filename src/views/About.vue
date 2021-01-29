<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Category title="Applications" />
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Category from "@/components/Category.vue"; // @ is an alias to /src

@Options({
  components: {
    Category
  }
})
export default class About extends Vue {}
</script>
