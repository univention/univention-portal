<template>
  <input
    type="text"
    :value="modelValue"
    :aria-invalid="invalid"
    :id="inputId"
    data-test="text-box"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isValid } from '@/jsHelper/forms';

export default defineComponent({
  name: 'TextBox',
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
        type: 'TextBox',
        invalidMessage: this.invalidMessage,
      });
    },
  },
});
</script>
