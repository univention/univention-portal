<template>
  <label>
    {{ label }}
    <required-field-label v-if="required" />
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RequiredFieldLabel from '@/components/forms/RequiredFieldLabel.vue';

export default defineComponent({
  name: 'Label',
  components: {
    RequiredFieldLabel,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
