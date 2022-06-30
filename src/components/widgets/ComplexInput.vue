<template>
  <div class="complex-input">
    <my-form
      ref="form"
      v-model="localValue"
      :widgets="modelWidgets"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MyForm from 'components/forms/Form.vue';

export default defineComponent({
  name: 'ComplexInput',
  components: {
    MyForm,
  },
  props: {
    modelValue: {
      type: Array,
      default: () => [],
      required: true,
    },
    modelWidgets: {
      type: Array,
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
  // data() {
  //   return {
  //     localValue: this.modelValue,GenaHJDR
  //   };
  // },
  computed: {
    localValue() {
      return {
        get: () => {
          const localValue: any = {};
          this.modelWidgets.reduce((widget: any) => {
            localValue[widget.type] = widget.modelValue;
          });

          console.log({ localValue });
          return localValue;
        },
        set: (newValue) => {
          this.$emit('update:modelValue', newValue);
        },
      };
    },
  },
});
</script>
