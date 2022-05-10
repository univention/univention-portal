<template>
  <div tabindex="-1">
    <div class="password-box">
      <input
        :id="forAttrOfLabel"
        ref="input"
        :name="name"
        type="password"
        :value="modelValue"
        :aria-invalid="invalid"
        :aria-describedby="invalidMessageId || null"
        data-test="password-box"
        @input="$emit('update:modelValue', $event.target.value)"
      >
      <icon-button
        v-if="canShowPassword"
        :icon="showPassword ? 'eye' : 'eye-off'"
        :aria-label-prop="TOGGLE_PASSWORD"
        :active-at="['selfservice']"
        class="password-box__icon"
        data-test="password-box-icon"
        @click="togglePassword()"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isValid } from '@/jsHelper/forms';
import _ from '@/jsHelper/translate';

import IconButton from '@/components/globals/IconButton.vue';

export default defineComponent({
  name: 'PasswordBox',
  components: {
    IconButton,
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
    canShowPassword: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showPassword: this.canShowPassword,
    };
  },
  computed: {
    invalid(): boolean {
      return !isValid({
        type: 'PasswordBox',
        invalidMessage: this.invalidMessage,
      });
    },
    TOGGLE_PASSWORD(): string {
      return this.showPassword ? _('Show password') : _('Hide password');
    },
  },
  methods: {
    focus(): void {
      // @ts-ignore
      this.$refs.input.focus();
    },
    togglePassword(): void {
      if (this.showPassword) {
        this.showPassword = !this.showPassword;
        (this.$refs.input as HTMLInputElement).type = 'text';
      } else {
        this.showPassword = !this.showPassword;
        (this.$refs.input as HTMLInputElement).type = 'password';
      }
    },
  },
});
</script>

<style lang="stylus">
.password-box
  position: relative

  &__icon {
    position: absolute
    right: 0
    top: 50%
    transform: translateY(-50%)
  }
</style>
