<template>
  <div class="progress-bar">
    <progress
      :id="forAttrOfLabel"
      ref="progress-bar"
      class="progress-bar__field"
      :value="modelValue"
      max="100"
      :name="name"
      :tabindex="tabindex"
      :required="required"
    />
    <div class="progress-bar__message">
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProgressBar',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    tabindex: {
      type: Number,
      default: 0,
    },
    forAttrOfLabel: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="stylus" scoped>
.progress-bar {
  min-height: 1rem;
  padding: 1rem 0;
  border-radius: var(--border-radius-interactable)
  color: var(--font-color-contrast-high);

  &__label {
    display: block;
    line-height: 2rem;
  }

  &__field {
    line-height: 1rem;
    border-radius: 1rem;
    border: 0;
    width: 100%;
    color: var(--button-primary-bgc);

    /* Firefox */
    &::-moz-progress-bar {
      background-color: var(--button-primary-bgc);
    }

    /* Chrome */
    &::-webkit-progress-value {
      background-color: var(--button-primary-bgc);
    }

    /* Polyfill */
    &[aria-valuenow]:before  {
      background-color: var(--button-primary-bgc);
    }
  }

  &__message {
    line-height: 2rem;
  }
}
</style>
