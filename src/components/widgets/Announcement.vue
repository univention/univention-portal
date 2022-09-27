<template>
  <div
    class="announcement"
    :class="`announcement--${type}`"
    role="alert"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

type AnnouncementType = 'success' | 'error' | 'warning';

export default defineComponent({
  name: 'Announcement',
  props: {
    type: {
      type: String as () => AnnouncementType,
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
  background-color: var(--bgc-success)
  min-height: 2rem
  width: 80vw;

  &--error
    background-color: var(--bgc-error)

  &--warning
    background-color: var(--bgc-warning)

</style>
