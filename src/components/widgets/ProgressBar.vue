<template>
  <div class="progress-bar">
    <div
      class="progress-bar__title"
      :aria-label="title"
    >{{ title }}</div>

    <div
      class="progress-bar__line"
      role="progressbar"
      :class="{'progress-bar__line--empty': modelValue <= 0}"
    >
      <div
        class="progress-bar__percent"
        role="presentation"
        :style="{ width: (modelValue || 0) + '%'}"
      />
    </div>
    <div class="progress-bar__message">
      <span>{{ message }}</span>
      <span>{{ modelValue + '%' }}</span>
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
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="stylus" scoped>
@keyframes loop {
  0% { background-position-x: 0; }
  100% { background-position-x: -100px}
}

.progress-bar {
  min-width: 20rem;
  padding: 1rem;
  border-radius: var(--border-radius-interactable)
  color: var(--font-color-contrast-high);

  &__title {
    height: 6rem;
    line-height: 6rem;
    font-size: var(--font-size-2);
    font-weight: var(--font-weight-bold);
  }

  &__line {
    border: none;
    background-color: var(--bgc-progressbar-empty);
    height: 0.5rem;

    &--empty {
      background: repeating-linear-gradient(
          135deg,
          var(--font-color-contrast-middle),
          var(--font-color-contrast-middle) 1.25rem,
          var(--font-color-contrast-low) 1.25rem,
          var(--font-color-contrast-low) 2.5rem
      );
      animation: loop 3s infinite linear forwards;
    }
  }

  &__percent {
    border: none;
    background-color: var(--button-primary-bgc);
    height: 100%;
  }

  &__message {
    display: flex;
    justify-content: space-between;

    line-height: 3rem;
    font-size: var(--font-size-4);
    color: var(--font-color-contrast-middle);
  }
}
</style>
