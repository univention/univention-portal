<template>
  <div class="portal-search">
    <input
      ref="portal-search__input"
      type="text"
      class="portal-search__input"
    >
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'PortalSearch',
  props: {},
  data() {
    return {
      modalVisible: false,
    };
  },
  computed: {},

  methods: {},
})
export default class PortalModal extends Vue {}
</script>
<style lang="stylus">
.portal-search {
  &__input {
    height: 5.8rem;
    width: 100%;
    background-color: transparent;
    color: #fff;
    border: 1px solid white;
    border-radius: var(--border-radius-interactable);
    __border-radius: var(--border-radius-interactable);
    font-size: 2rem;
    padding-left: 2rem;

    &:focus {
      border-color: var(--color-primary);
      outline: none;
    }
  }
}
</style>
