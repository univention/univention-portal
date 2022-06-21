<template>
  <div class="new-password-box">
    <div class="password-box">
      <input
        :id="forAttrOfLabel"
        ref="input"
        :disabled="disabled"
        :tabindex="tabindex"
        :required="required"
        :name="name"
        type="password"
        :value="modelValue"
        :aria-invalid="invalidNew"
        :aria-describedby="invalidMessageId || null"
        data-test="password-box"
        @input="$emit('update:modelValue', $event.target.value)"
      >
      <toggle-button
        v-if="canShowPasswordNew"
        :disabled="disabled"
        :tabindex="tabindex"
        :toggle-icons="passwordIconsNew"
        :toggle-labels="TOGGLE_PASSWORD"
        class="password-box__icon"
        data-test="password-box-icon"
        :is-toggled="showPassword"
        @update:is-toggled="updateShowPassword"
      />
    </div>
    <form-label
      :label="PASSWORD_RETYPE_LABEL"
      aria-label="widget.ariaLabel || widget.label"
      for-attr="forAttrOfLabel"
      :invalid-message="invalidMessage"
      data-test="form-element-label"
      class="password-box__retype-formlabel"
    />
    <div class="password-box">
      <input
        :id="forAttrOfLabelRetype"
        ref="input"
        :disabled="disabled"
        :tabindex="tabindex"
        :required="required"
        :name="name"
        type="password"
        v-model="modelValueRetype"
        :aria-invalid="invalidRetype"
        :aria-describedby="invalidMessageIdRetype || null"
        data-test="password-box"
        @input="newPasswordValidation"
      >
      <toggle-button
        v-if="canShowPasswordRetype"
        :disabled="disabled"
        :tabindex="tabindex"
        :toggle-icons="passwordIconsRetype"
        :toggle-labels="TOGGLE_PASSWORD"
        class="password-box__icon"
        data-test="password-box-icon"
        :is-toggled="showPassword"
        @update:is-toggled="updateShowPassword"
      />
    </div>
    <input-error-message
      :id="invalidMessageIdRetype"
      :display-condition="invalidMessageRetype !== ''"
      :error-message="invalidMessageRetype"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import _ from '@/jsHelper/translate';

import FormLabel from '@/components/forms/FormLabel.vue';
import InputErrorMessage from '@/components/forms/InputErrorMessage.vue';
import PasswordBox from '@/components/widgets/PasswordBox.vue';

export default defineComponent({
  name: 'PasswordBox',
  components: {
    PasswordBox,
    FormLabel,
    InputErrorMessage,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
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
    disabled: {
      type: Boolean,
      default: false,
    },
    tabindex: {
      type: Number,
      default: 0,
    },
    required: {
      type: Boolean,
      default: false,
    },
    canShowPassword: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showPassword: false,
      modelValueRetype: '',
      invalidNew: '',
      invalidRetype: false,
      invalidMessageRetype: '',
      invalidMessageIdRetype: '',
      forAttrOfLabelRetype: '',
      canShowPasswordNew: false,
      canShowPasswordRetype: false,

    };
  },
  computed: {
    TOGGLE_PASSWORD(): Record<string, string> {
      return {
        initial: _('Show password'),
        toggled: _('Hide password'),
      };
    },
    passwordIconsNew(): Record<string, string> {
      return {
        initial: 'eye-off',
        toggled: 'eye',
      };
    },
    passwordIconsRetype(): Record<string, string> {
      return {
        initial: 'eye-off',
        toggled: 'eye',
      };
    },
    PASSWORD_RETYPE_LABEL(): string {
      return _('New password (retype)');
    },
    INVALID_MESSAGE_RETYPE(): string {
      return _('The new passwords do not match');
    },
  },
  methods: {
    focus(): void {
      // @ts-ignore
      this.$refs.input.focus();
    },
    updateShowPasswordNew(newValue) {
      this.showPassword = newValue;
      (this.$refs.input as HTMLInputElement).type = newValue ? 'text' : 'password';
    },
    updateShowPasswordRetype(newValue) {
      this.showPassword = newValue;
      (this.$refs.input as HTMLInputElement).type = newValue ? 'text' : 'password';
    },
    newPasswordValidation(): void {
      if (this.modelValue !== this.modelValueRetype) {
        this.invalidMessageRetype = this.INVALID_MESSAGE_RETYPE;
        this.invalidRetype = true;
      }
    },
  },
});
</script>

<style lang="stylus">
.password-box
  position: relative

  &__retype-formlabel {
    margin-top: calc(3 * var(--layout-spacing-unit))!important;
  }

  &__icon {
    position: absolute
    right: 0
    top: 50%
    transform: translateY(-50%)
  }
</style>
