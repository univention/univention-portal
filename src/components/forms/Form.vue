<template>
  <form>
    <form-element
      v-for="widget in widgets"
      :key="widget.name"
      :ref="widget.name"
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
import { isValid } from '@/jsHelper/forms';

function isInteractable(widget) {
  return !(widget.readonly ?? false) && !(widget.disabled ?? false);
}

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
    focus(widgetName) {
      // @ts-ignore TODO
      this.$refs[widgetName].focus();
      // TODO focus only if interactable?
    },
    focusFirstInteractable() {
      // @ts-ignore TODO
      const first = this.widgets.find((widget) => isInteractable(widget));
      if (first) {
        this.focus(first.name);
      }
    },
    focusFirstInvalid() {
      // @ts-ignore TODO
      const first = this.widgets.find((widget) => isInteractable(widget) && !isValid(widget));
      if (first) {
        this.focus(first.name);
      }
    },
  },
});
</script>
