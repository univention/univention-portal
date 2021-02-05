<template>
  <div>
    <portal-header />

    <div class="portal">
      <button @click="devEmpty">
        <portal-icon
          icon="circle"
          iconWidth="1em"
        />
        Empty
      </button>
      <button @click="devStandard">
        <portal-icon
          icon="check-circle"
          iconWidth="1em"
        />
        Standard
      </button>
      <button @click="devFolder">
        <portal-icon
          icon="folder"
          iconWidth="1em"
        />
        Folder
      </button>

      <portal-category
        v-for="(category, index) in categories"
        :key="index"
        :title="category.title"
        :tiles="category.tiles"
      />
    </div>

    <portal-standby v-if="loading" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import PortalCategory from "@/components/PortalCategory.vue"; // @ is an alias to /src
import PortalIcon from "@/components/globals/PortalIcon.vue";
import PortalHeader from "@/components/PortalHeader.vue";
import PortalStandby from "@/components/PortalStandby.vue";

@Options({
  components: {
    PortalCategory,
    PortalHeader,
    PortalIcon,
    PortalStandby
  },
  computed: {
    categories() {
      return this.$store.state.categories;
    },
    loading() {
      return this.$store.state.loading;
    }
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
    }
  }
})
export default class PortalHome extends Vue {}
</script>

<style scoped lang="stylus">
.portal
  position: relative;
  padding: calc(7 * var(--layout-spacing-unit)) calc(6 * var(--layout-spacing-unit));
</style>
