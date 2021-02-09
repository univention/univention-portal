<template>
  <teleport to="body">
    <div
      class="portal-modal"
      :class="{ 'portal-modal--isVisible': isActive }"
      @click="closeModal()"
    >
      <slot></slot>
    </div>
  </teleport>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapMutations } from "vuex";

@Options({
  name: "PortalModal",
  props: {
    isActive: {
      type: Boolean,
      required: true
    }
  },
  emits: ["changeMenuState"],

  computed: {},

  methods: {
    ...mapMutations(["hideModal"]),
    closeModal: function() {
      if (this.$store.getters.modalState) {
        console.log("before emit");
        this.$emit("changeMenuState");
        console.log("after emit");

        this.$store.commit("hideModal");
      }
    }
  }
})
export default class PortalModal extends Vue {}
</script>

<style scoped lang="stylus">
.portal-modal
    width: 100%;
    position: absolute;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -999;

    &--isVisible {
        z-index: 0;
    }
</style>
