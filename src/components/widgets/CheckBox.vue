<template>
  <input
    :id="name"
    ref="input"
    :name="name"
    type="checkbox"
    :checked="modelValue"
    :aria-invalid="invalid"
    @change="$emit('update:modelValue', $event.target.checked)"
  >
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isValid } from '@/jsHelper/forms';

export default defineComponent({
  name: 'CheckBox',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    invalidMessage: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    invalid(): boolean {
      return !isValid({
        type: 'CheckBox',
        invalidMessage: this.invalidMessage,
      });
    },
  },
  methods: {
    focus() {
      // @ts-ignore TODO
      this.$refs.input.focus();
    },
  },
});
</script>
