<template>
  <div
    :class="[
      'form-element',
      { 'form-element--invalid': invalid },
    ]"
    data-test="form-element"
  >
    <form-label
      :label="widget.label"
      :required="widget.required"
      :for="inputLabelString"
      data-test="form-element-label"
    />
    <div class="form-element__wrapper">
      <component
        :is="widget.type"
        v-bind="component"
        :model-value="modelValue"
        :input-id="inputLabelString"
        data-test="form-element-component"
        @update:model-value="$emit('update:modelValue', $event)"
      />
      <input-error-message
        :display-condition="invalidMessage !== ''"
        :error-message="invalidMessage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FormLabel from '@/components/forms/FormLabel.vue';
import InputErrorMessage from 'components/forms/InputErrorMessage.vue';
import { isValid, invalidMessage } from '@/jsHelper/forms';

// TODO load components on demand (?)
import ComboBox from '@/components/widgets/ComboBox.vue';
import DateBox from '@/components/widgets/DateBox.vue';
import MultiInput from '@/components/widgets/MultiInput.vue';
import PasswordBox from '@/components/widgets/PasswordBox.vue';
import TextBox from '@/components/widgets/TextBox.vue';
import RadioBox from '@/components/widgets/RadioBox.vue';

export default defineComponent({
  name: 'FormElement',
  components: {
    FormLabel,
    InputErrorMessage,
    ComboBox,
    DateBox,
    MultiInput,
    PasswordBox,
    TextBox,
    RadioBox,
  },
  props: {
    widget: {
      type: Object,
      required: true,
    },
    modelValue: {
      required: true,
    },
  },
  emits: ['update:modelValue'],
  computed: {
    component(): any {
      const component = JSON.parse(JSON.stringify(this.widget));
      delete component.type;
      delete component.label;
      delete component.validators;
      return component;
    },
    invalid(): boolean {
      return !isValid(this.widget);
    },
    invalidMessage(): string {
      return invalidMessage(this.widget);
    },
    inputLabelString(): string {
      return `${this.widget.label}--${this.$.uid}`;
    },
  },
});
</script>

<style lang="stylus">
.form-element
  margin-top: calc(3 * var(--layout-spacing-unit))

  input,
  select,
  label
    margin: 0

  .input-error-message
    margin: 0
    margin-top: var(--layout-spacing-unit)

  /*
  &--invalid
    > .form-element__wrapper
      padding-left: var(--layout-spacing-unit)
      margin-left: 2px
      box-shadow: inset 2px 0 var(--font-color-error)
   */
</style>
