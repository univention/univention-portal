<template>
  <div class="progress-bar">
    <label
      class="progress-bar__label"
      :aria-label="label"
      :for="forAttrOfLabel"
    >{{ label }}</label>
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

<style lang="stylus">
.progress-bar {
  min-height: 1rem;
  padding: 1rem;
  border-radius: var(--border-radius-interactable)
  background-color: var(--bgc-content-body);
  color: var(--font-color-contrast-high);

  &__label {
    display: block;
    line-height: 2rem;
    background-color: var(--bgc-content-header);
  }

  &__field {
    line-height: 1rem;
    border-radius: 1rem;
    border: 0;
    width: 100%;
  }

  &__message {
    line-height: 2rem;
  }
}
</style>
