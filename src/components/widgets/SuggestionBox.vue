<template>
  <div
    class="suggestion-box"
    tabindex="0"
    @focusout="toggleSuggestionList(false)"
  >
    <input
      :id="forAttrOfLabel"
      ref="input"
      :value="value"
      :disabled="disabled"
      :tabindex="tabindex"
      :required="required"
      :name="name"
      :aria-invalid="invalid"
      :aria-describedby="invalidMessageId || undefined"
      data-test="suggestion-box"
      @input="updateModelValue"
      @keydown.esc.prevent="toggleSuggestionList(false)"
      @keydown.enter.prevent="onSelectOption(availableOptions[activeOptionIndex])"
      @keydown.arrow-up.prevent="movingOption('up')"
      @keydown.arrow-down.prevent="movingOption('down')"
    >
    <IconButton
      class="suggestion-box-icon-button"
      icon="chevron-down"
      aria-label-prop="Open mail domain list"
      @click="toggleSuggestionList"
      @keydown.esc.prevent="toggleSuggestionList(false)"
    />
    <Transition>
      <div
        v-if="isSuggestionListOpen"
        class="suggestion-box-suggestion-list"
      >
        <div
          v-for="(option, index) in availableOptions"
          :key="option"
          class="suggestion-box-suggestion-list-option"
          :class="{ 'suggestion-box-suggestion-list-option--selected': index === activeOptionIndex }"
          @click="onSelectOption(option)"
        >
          <span
            class="suggestion-box-suggestion-list-option-text"
          >
            {{ option }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { isValid } from '@/jsHelper/forms';
import IconButton from '@/components/globals/IconButton.vue';

export default defineComponent({
  name: 'SuggestionBox',
  components: {
    IconButton,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    forAttrOfLabel: {
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
    suggestedOptions: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isSuggestionListOpen: false,
      activeOptionIndex: -1,
      value: '',
    };
  },
  computed: {
    invalid(): boolean {
      return !isValid({
        type: 'SuggestionBox',
        invalidMessage: this.invalidMessage,
      });
    },
    availableOptions(): string[] {
      if (!this.value) return this.suggestedOptions;
      return this.suggestedOptions.filter((option) => option.toLowerCase().includes(this.value.toLowerCase()));
    },
  },
  watch: {
    isSuggestionListOpen(isOpen: boolean) {
      if (!isOpen) {
        this.activeOptionIndex = -1;
      }
    },
  },
  methods: {
    updateModelValue(event: Event): void {
      const target = event.target as HTMLInputElement;
      const value: string = target.value;
      this.toggleSuggestionList(!!value);
      this.value = value;
      this.$emit('update:modelValue', value);
    },
    onSelectOption(option: string): void {
      this.value = option;
      this.isSuggestionListOpen = false;
      this.$emit('update:modelValue', option);
    },
    toggleSuggestionList(isOpen?: boolean): void {
      this.isSuggestionListOpen = isOpen !== undefined ? isOpen : !this.isSuggestionListOpen;
    },
    movingOption(direction: 'up' | 'down') {
      if (!this.isSuggestionListOpen) {
        this.toggleSuggestionList(true);
      }
      if (direction === 'up') {
        this.activeOptionIndex -= 1;
        if (this.activeOptionIndex < 0) {
          this.activeOptionIndex = this.availableOptions.length - 1;
        }
      } else {
        this.activeOptionIndex += 1;
        if (this.activeOptionIndex >= this.availableOptions.length) {
          this.activeOptionIndex = 0;
        }
      }
    },
  },
});
</script>

<style lang="stylus">
.suggestion-box
  width: fit-content
  position: relative
  &-icon-button
    position: absolute
    top: var(--layout-spacing-unit-small)
    right: 0
  &-suggestion-list
    display: flex
    flex-direction: column
    &-option
      padding: var(--layout-spacing-unit)
      background-color: var(--bgc-popup)
      font-size: var(--font-size-4)
      cursor: pointer
      &--selected, &:hover
        background-color: var(--bgc-popup-item-hover)
      &--highlight
        background-color: var(--bgc-popup-item-selected) !important

      &:first-child
        border-top-left-radius: var(--border-radius-interactable)
        border-top-right-radius: var(--border-radius-interactable)

      &:last-child
        border-bottom-left-radius: var(--border-radius-interactable)
        border-bottom-right-radius: var(--border-radius-interactable)
</style>
