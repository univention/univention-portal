<template>
  <input
    type="number"
    :id="forAttrOfLabel"
    :name="name"
    :value="modelValue"
    :aria-invalid="invalid"
    :aria-describedby="invalidMessageId || null"
    min="1"
    max="5"
    data-test="number-spinner"
    @input="$emit('update:modelValue', $event.target.value)"
    >
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import _ from '@/jsHelper/translate';
import { isValid } from '@/jsHelper/forms';

interface NumberSpinnerData {
  modelValueData: Array<unknown>,
}

export default defineComponent({
  name: 'NumberSpinner',
  props: {
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Number,
      required: true,
    },
    invalidMessage: {
      type: String,
      default: '',
    },
    forAttrOfLabel: {
      type: String,
      required: true,
    },
    invalidMessageId: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data(): NumberSpinnerData {
    return {
      modelValueData: [],
    };
  },
  computed: {
    invalid(): boolean {
      return !isValid({
        type: 'NumberSpinner',
        invalidMessage: this.invalidMessage,
      });
    },
  },
  updated() {
    console.log('Updated', this.modelValueData);
  },
  methods: {

  },
});

</script>
