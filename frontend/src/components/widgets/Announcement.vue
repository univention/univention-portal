<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Announcement',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
});
</script>
