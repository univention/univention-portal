<template>
  <img
    :src="iconSrc"
    class="grid-item-icon"
  >
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'ItemIcon',
  props: {
    iconSrc: {
      type: String as PropType<string>,
      default: '/data/icons/16x16/udm-groups-group.png',
    },
  },
});
</script>

<style lang="stylus">
.grid-item-icon
  width: 16px
  height: 16px
  margin-right: 5px
</style>
