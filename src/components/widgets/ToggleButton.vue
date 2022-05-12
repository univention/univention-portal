<template>
  <icon-button
    :icon="isInitialState ? toggleIcon.firstStateIcon : toggleIcon.secondStateIcon"
    :aria-label-prop="TOGGLE_LABEL"
    :active-at="activeAt"
    class="toggle-button"
    data-test="toggle-button"
    @click="toggleButton()"
  />
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue';

import IconButton from '@/components/globals/IconButton.vue';

export default defineComponent({
  name: 'ToggleButton',
  components: {
    IconButton,
  },
  props: {
    displayInitial: {
      type: Boolean,
      default: true,
    },
    toggleLabel: {
      type: Object as PropType<Record<string, string>>,
      required: true,
    },
    toggleIcon: {
      type: Object as PropType<Record<string, string>>,
      required: true,
    },
    activeAt: {
      type: Array,
      default: () => ['portal'],
    },
  },
  emits: ['toogleFunction'],
  data() {
    return {
      isInitialState: this.displayInitial,
    };
  },
  computed: {
    TOGGLE_LABEL(): string {
      return this.isInitialState ? this.toggleLabel.firstStateLabel : this.toggleLabel.secondStateLabel;
    },
  },
  methods: {
    toggleButton(): void {
      this.isInitialState = !this.isInitialState;
      this.$emit('toogleFunction');
    },
  },
});

</script>
