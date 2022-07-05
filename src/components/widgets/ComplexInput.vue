<template>
  <div class="complex-input">
    <form-element
      v-for="(widget, index) in subtypes"
      :key="widget.name"
      :ref="widget.name"
      :widget="widget"
      :modelValue="modelValue[index]"
      @update:modelValue="onUpdate(widget.name, $event, index)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import FormElement from 'components/forms/FormElementCopyNeededForMultiInput.vue';
import { WidgetDefinition } from '@/jsHelper/forms';

export default defineComponent({
  name: 'ComplexInput',
  components: {
    FormElement,
  },
  props: {
    modelValue: {
      type: Array,
      default: () => [],
      required: true,
    },
    subtypes: {
      type: Array as PropType<WidgetDefinition[]>,
      default: () => [],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    onUpdate(widgetName, value, index) {
      const newVal = JSON.parse(JSON.stringify(this.modelValue));
      newVal[index] = value;
      this.$emit('update:modelValue', newVal);
    },
  },
});
</script>
