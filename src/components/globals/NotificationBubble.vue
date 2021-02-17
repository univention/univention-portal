<template>
  <div>
    <transition name="fade">
      <slot
        v-if="bubbleStateStandalone"
        name="bubble-standalone"
      />
    </transition>

    <slot
      name="bubble-embedded"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

@Options({
  name: 'NotificationBubble',
  computed: {
    ...mapGetters({
      bubbleState: 'notificationBubble/bubbleState',
      bubbleStateStandalone: 'notificationBubble/bubbleStateStandalone',
    }),
  },
})

export default class NotificationBubble extends Vue {}
</script>

<style lang="stylus">
.notification-bubble
  min-width: 320px;
  max-width: 320px;

  &__container
    max-width: 288px;
    background-color: rgba(0,0,0,0.4);
    backdrop-filter: blur(20px);
    border-radius: var(--border-radius-notification);
    padding: 16px;
    font-size: 16px;
    margin-bottom: 16px;

  &__standalone
    position: absolute
    right: 20px
    top: 8rem
    margin: 0;

  &__embedded
    position: relative

// animation
.fade-enter-active,
.fade-leave-active
  transition: opacity .5s

.fade-enter,
.fade-leave-to
  opacity: 0
</style>
