<template>
  <div class="accordion-item">
    <slot
      name="header"
      @click="toggleExpanded"
    >
      <div
        class="accordion-item-header"
        @click="toggleExpanded"
      >
        <h2 class="accordion-item-header__title">
          {{ title }}
        </h2>
        <IconButton
          class="accordion-item-header__expanded-button"
          :class="{
            'accordion-item-header__expanded-button--expanded': isExpanded,
          }"
          aria-label-prop="Expand"
          icon="chevron-down"
        />
      </div>
    </slot>
  </div>
  <div
    v-if="isExpanded"
    class="accordion-item-body"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import IconButton from '@/components/globals/IconButton.vue';

export default defineComponent({
  name: 'AccordionItem',
  components: { IconButton },
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isExpanded: false,
    };
  },
  methods: {
    toggleExpanded() {
      this.isExpanded = !this.isExpanded;
    },
  },
});
</script>

<style lang="stylus">
.accordion-item
  --bgc-titlepane-hover: rgba(255,255,255,0.04)
  border-top: 2px solid var(--bgc-content-body)
  margin-bottom: 0

  &-header
    display: flex
    align-items: center
    justify-content: space-between
    transition: background-color 0.2s
    padding: var(--layout-spacing-unit)

    &:hover
      background-color: var(--bgc-titlepane-hover)
      cursor: pointer

    &__title
      font-size: var(--font-size-2)
      line-height: var(--font-lineheight-normal)
      font-weight: 600

    &__expanded-button
      transition: transform 0.5s
      &--expanded
        transform: rotate(180deg)

  &-body
    padding: var(--layout-spacing-unit)
</style>
