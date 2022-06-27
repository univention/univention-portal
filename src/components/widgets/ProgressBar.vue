<template>
  TEST asd
  <progress class="progress-bar"
      :name="name"
      :value="modelValue"
      max="100"
      @change="$emit('update:modelValue')"
  />
  aaaa
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProgressBar',
  props: {
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      // required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    //
  },
  methods: {
    focus() {
      // @ts-ignore TODO
      this.$refs.input.focus();
    },
  },
});
</script>

<style lang="css">
.progress-bar {
  border: 0;
  height: 1rem;
  border-radius: 9px;
}
</style>
