<template>
  <input
    type="date"
    :value="modelValue"
    :aria-invalid="invalid"
    :id="inputId"
    data-test="date-box"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isValid } from '@/jsHelper/forms';

export default defineComponent({
  name: 'DateBox',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    invalidMessage: {
      type: String,
      default: '',
    },
    inputId: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    invalid(): boolean {
      return !isValid({
        type: 'DateBox',
        invalidMessage: this.invalidMessage,
      });
    },
  },
});
</script>
