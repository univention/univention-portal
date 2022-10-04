<template>
  <div :class="['announcement', `announcement--${severity}`]" role="alert">
    <h5 class="announcement-title">{{ $localized(title) }}</h5>
    <p class="announcement-message" v-if="message">{{ $localized(message) }}</p>
    <input
      class="announcement-checkbox"
      :id="`announcement-${title}`"
      ref="input"
      :name="`announcement-${title}`"
      type="checkbox"
      :checked=false
    >
    <slot />
  </div>
</template>

<script lang="ts">
import { LocalizedString, PortalAnnouncementSeverity } from '@/store/modules/portalData/portalData.models';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'Announcement',
  props: {
    title: {
      type: Object as PropType<LocalizedString>,
      required: true,
    },
    message: {
      type: Object as PropType<LocalizedString>,
    },
    severity: {
      type: String as PropType<PortalAnnouncementSeverity>,
      default: 'success',
    },
  },
});
</script>

<style lang="stylus">
.announcement
  display: flex
  align-items: center
  justify-content: center
  background-color: var(--serveroverview-tile-hover-color)
  color: white
  min-height: 2rem
  
  .announcement-title
    margin-right: 5px

  .announcement-message
    margin-right: 5px

  &--info
    background-color: var(--color-accent)

  &--danger
    background-color: var(--bgc-error)

  &--success
    background-color: var(--bgc-success)

  &--warn
    background-color: var(--bgc-warning)

</style>
