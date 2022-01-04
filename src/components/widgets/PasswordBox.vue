<template>
  <input
    type="password"
    :value="modelValue"
    :aria-invalid="invalid"
    data-test="password-box"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isValid } from '@/jsHelper/forms';

export default defineComponent({
  name: 'PasswordBox',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    invalidMessage: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  computed: {
    invalid(): boolean {
      return !isValid({
        type: 'PasswordBox',
        invalidMessage: this.invalidMessage,
      });
    },
  },
});
</script>
