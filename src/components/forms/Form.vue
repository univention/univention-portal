<template>
  <form>
    <form-element
      v-for="widget in widgets"
      :key="widget.name"
      :widget="widget"
      :model-value="modelValue[widget.name]"
      @update:model-value="onUpdate(widget.name, $event)"
    />
    <slot />
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import FormElement from '@/components/forms/FormElement.vue';

export default defineComponent({
  name: 'Form',
  components: {
    FormElement,
  },
  props: {
    modelValue: {
      // type: Object, TODO
      required: true,
    },
    widgets: {
      // type: Array<Object> TODO
      required: true,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    onUpdate(widgetName, value) {
      const newVal = JSON.parse(JSON.stringify(this.modelValue));
      newVal[widgetName] = value;
      this.$emit('update:modelValue', newVal);
    },
  },
});
</script>
