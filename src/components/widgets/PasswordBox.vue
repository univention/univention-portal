<template>
  <input
    :id="inputId"
    :name="name"
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
    name: {
      type: String,
      required: true,
    },
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
        type: 'PasswordBox',
        invalidMessage: this.invalidMessage,
      });
    },
  },
});
</script>
