<template>
  <select
    :id="inputId"
    ref="select"
    :name="name"
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
    name: {
      type: String,
      required: true,
    },
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
    inputId: {
      type: String,
      required: true,
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
  methods: {
    focus() {
      // @ts-ignore
      this.$refs.select.focus();
    },
  },
});
</script>
