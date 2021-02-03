<template>
  <Header></Header>
  <div class="portal">
    <button v-on:click="devEmpty">
      <Icon icon="circle" iconWidth="1em" />
      Empty
    </button>
    <button v-on:click="devStandard">
      <Icon icon="check-circle" iconWidth="1em" />
      Standard
    </button>
    <button v-on:click="devFolder">
      <Icon icon="folder" iconWidth="1em" />
      Folder
    </button>
    <Category
      v-for="(category, index) in categories"
      :key="index"
      :title="category.title"
      :tiles="category.tiles"
    />
  </div>
  <Standby v-if="loading" />
</template>
<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Category from "@/components/Category.vue"; // @ is an alias to /src
import Icon from "@/components/Icon.vue";
import Header from "@/components/Header.vue";
import Standby from "@/components/Standby.vue";

@Options({
  components: {
    Category,
    Header,
    Icon,
    Standby,
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
    loading() {
      return this.$store.state.loading;
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
<style scoped lang="stylus">
.portal
  position: relative;
  padding: calc(7 * var(--layout-spacing-unit)) calc(6 * var(--layout-spacing-unit));
</style>
