<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Category
      v-for="(category, index) in categories"
      :key="index"
      :title="category.title"
      :tiles="category.tiles"
    />
  </div>
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Category from "@/components/Category.vue"; // @ is an alias to /src

@Options({
  components: {
    Category
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    }
  }
})
export default class About extends Vue {}
</script>
