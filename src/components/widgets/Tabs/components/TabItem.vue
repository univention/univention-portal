<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TabItem',
  props: {
    tab: {
      type: String,
      required: true,
    },
  },
});
</script>
