<template>
  <div
    class="portal-modal"
    :class="{ 'portal-modal--isVisible': isActive }"
    v-test:click="closeEvent"
  >
    <slot>HELLO :) </slot>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { mapMutations } from "vuex";

@Options({
  name: "PortalModal",
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  directives: {
    test: {
      beforeMount(element) {
        this.event = function(event) {
          console.log("emitting event");
          element.vm.$emit(element.expression, event);
        };
        this.el.addEventListener("click", this.stopProp);
        document.body.addEventListener("click", this.event);
      },

      unmounted() {
        console.log("unbind");
        this.el.removeEventListener("click", this.stopProp);
        document.body.removeEventListener("click", this.event);
      },
    },
  },
  computed: {},
  mounted() {
    console.log(this.$store.state.modalVisible);
    console.log(this.$store.state.modalComponent);
    this.$store.commit("hideModal", "TEst");
  },
  methods: {
    ...mapMutations(["hideModal"]),
    hide: function() {
      console.log("hide");
      this.showInside = false;
    },
    closeEvent: function() {
      console.log("close event called");
      this.hide();
    },
  },
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
