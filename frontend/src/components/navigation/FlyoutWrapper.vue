<!--
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
-->
<template>
  <div
    :class="[
      'flyout-wrapper',
      { 'flyout-wrapper--isVisible': isVisible },
      fromLeft ? 'flyout-wrapper--left' : 'flyout-wrapper--right'
    ]"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FlyoutWrapper',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    fromLeft: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="stylus">
.flyout-wrapper
  width: 100%
  max-width: 23rem
  position: fixed
  top:  calc(var(--portal-header-height) + var(--layout-spacing-unit))
  bottom: var(--layout-spacing-unit)
  z-index: 100
  background-color: var(--bgc-content-container)
  transition: transform cubic-bezier(0, 0, 0.2, 1) 0.15s
  border-radius: 0.5rem 0 0 0.5rem // TODO CUSTOM CSS

  &--left
    left: 0
    right: auto
    top: 0
    transform: translate3d(-110%, 0, 0)
    border-right-radius: 1rem

  &--right
    right: 0
    left: auto
    transform: translate3d(110%, 0, 0)

  &--isVisible
    transform: translate3d(0, 0, 0) scale(1, 1)
    transition: transform cubic-bezier(0, 0, 0.2, 1) 0.15s
</style>
