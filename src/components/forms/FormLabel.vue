<template>
  <label :for="forAttr">
    {{ label }}
    <span
      v-if="required"
      aria-hidden="true"
    >*</span>
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import _ from '@/jsHelper/translate';

export default defineComponent({
  name: 'Label',
  props: {
    forAttr: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    invalidMessage: {
      type: String,
      default: '',
    },
  },
});
</script>
