<template>
  <button>
    aaaaaaaaaaaaaaaaaa
    {{ title }}
  </button>
</template>

<script>

import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SimpleButton',
  props: {
    title: {
      type: String,
    },
  },
});
</script>
