<template>
  <div class="about">
    <button v-on:click="devEmpty">Empty</button>
    <button v-on:click="devStandard">Standard</button>
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
  },
  methods: {
    devEmpty() {
      this.$store.commit("devEmpty");
    },
    devStandard() {
      this.$store.commit("devStandard");
    }
  }
})
export default class About extends Vue {}
</script>
