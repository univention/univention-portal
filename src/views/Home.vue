<template>
  <Header></Header>
  <div class="about">
    <button v-on:click="devEmpty">
      <Icon icon="circle" />
      Empty
    </button>
    <button v-on:click="devStandard">
      <Icon icon="check-circle" />
      Standard
    </button>
    <button v-on:click="devFolder">
      <Icon icon="folder" />
      Folder
    </button>
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
import Icon from "@/components/Icon.vue";
import Header from "@/components/Header.vue";

@Options({
  components: {
    Category,
    Header,
    Icon,
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
  },
  methods: {
    devEmpty() {
      this.$store.commit("devEmpty");
    },
    devStandard() {
      this.$store.commit("devStandard");
    },
    devFolder() {
      this.$store.commit("devFolder");
    },
  },
})
export default class About extends Vue {}
</script>
