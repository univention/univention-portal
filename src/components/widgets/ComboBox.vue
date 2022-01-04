<template>
  <select
    :aria-invalid="invalid"
    :value="modelValue"
    data-test="combo-box"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option
      v-for="option in options"
      :key="option.id"
      :value="option.id"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isValid } from '@/jsHelper/forms';

export default defineComponent({
  name: 'ComboBox',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
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
        type: 'ComboBox',
        invalidMessage: this.invalidMessage,
      });
    },
  },
});
</script>
