<!--
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
-->
<template>
  <teleport
    :disabled="!teleportToBody"
    to="body"
  >
    <transition name="modalWrapperFade">
      <div
        v-if="isActive"
        v-bind="$attrs"
        :id="setID"
        ref="modalWrapper"
        :class="{
          'modal-wrapper': !isActive,
          'modal-wrapper--isVisible': isActive,
          'modal-wrapper--isVisibleFullscreen': isActive && full,
          'modal-wrapper--isSecondLayer': isSecondModalActive
        }"
        @click.self="$emit('backgroundClick', $event);"
      >
        <slot />
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'ModalWrapper',
  inheritAttrs: false,
  props: {
    isActive: {
      type: Boolean,
      required: true,
    },
    full: {
      type: Boolean,
      default: false,
    },
    modalLevel: {
      type: Number,
      default: 1,
    },
    teleportToBody: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['backgroundClick'],
  computed: {
    ...mapGetters({
      isTouchDevice: 'device/isTouchDevice',
    }),
    isSecondModalActive(): boolean {
      return this.modalLevel === 2 && this.isActive;
    },
    setID(): string | null {
      return this.isActive ? `modal-wrapper--isVisible-${this.modalLevel}` : null;
    },
  },
  watch: {
    isActive(newValue: boolean) {
      const appElement = document.getElementById('app');
      if (appElement) {
        if (newValue && this.isTouchDevice) {
          appElement.setAttribute('inert', '');
        } else {
          appElement.removeAttribute('inert');
        }
      }
    },
  },
  beforeUnmount() {
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.removeAttribute('inert');
    }
  },
});
</script>

<style lang="stylus">
.modal-wrapper
    position: fixed
    width: 100%
    height: 100%
    top: 0
    right: 0
    bottom: 0
    left: 0
    background-color: var(--bgc-underlay)
    pointer-events: none

    &--isVisible
      position: fixed
      width: 100%
      height: 100vh
      top: 0
      right: 0
      bottom: 0
      left: 0
      z-index: $zindex-2
      background-color: var(--bgc-underlay)
      display: flex
      align-items: center
      justify-content: center
      &:not(.modal-wrapper--selfservice)
        flex-direction: column

      &> *
        position: relative
        z-index: 1

    &--isSecondLayer
      z-index: $zindex-3

      &> *
        position: relative
        z-index: 1

    &--isVisibleFullscreen
      z-index: $zindex-4

.modalWrapperFade-enter-active,
.modalWrapperFade-leave-active
  transition: opacity 0.2s ease

.modalWrapperFade-enter-from,
.modalWrapperFade-leave-to
  opacity: 0

.modalWrapperFade-enter-from .flyout-wrapper--right,
.modalWrapperFade-leave-to .flyout-wrapper--right
  transform: translate3d(110%, 0, 0)

.modalWrapperFade-enter-from .flyout-wrapper--left,
.modalWrapperFade-leave-to .flyout-wrapper--left
  transform: translate3d(-110%, 0, 0)
</style>
