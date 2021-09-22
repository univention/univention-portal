<template>
  <div
    aria-live="assertive"
    aria-atomic="true"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ScreenReaderAnnouncer',
  props: {
  },
});
</script>
