<template>
  <div :class="`notification-bubble__${bubbleContainer}`">
    <div class="notification-bubble__container">
      <div>
        <div class="notification-bubble__header">
          <div class="notification-bubble__title">
            {{ bubbleContent.bubbleTitle }}
          </div>

          <header-button
            :aria-label="bubbleContent.bubbleLabel"
            :icon="bubbleContent.bubbleIcon"
            @click="dismissBubble(`${bubbleContainer}`)"
          />
        </div>

        <div class="notification-bubble__content">
          <!-- eslint-disable vue/no-v-html -->
          <div
            v-if="bubbleContent && bubbleContent.bubbleDescription"
            ref="bubbleContent"
            class="notification-bubble__message"
            @click="bubbleClick"
            v-html="bubbleContent.bubbleDescription"
          />
          <!-- eslint-enable vue/no-v-html -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

import HeaderButton from '@/components/navigation/HeaderButton.vue';

import userMixin from '@/mixins/userMixin.vue';
import notificationMixin from '@/mixins/notificationMixin.vue';

@Options({
  name: 'NotificationBubbleSlot',
  components: {
    HeaderButton,
  },
  mixins: [
    userMixin,
    notificationMixin,
  ],
  props: {
    bubbleContainer: {
      type: String,
      default: 'standalone',
    },
  },
  computed: {
    ...mapGetters({
      bubbleContent: 'notificationBubble/bubbleContent',
    }),
  },
})

export default class NotificationBubbleSlot extends Vue {}
</script>

<style lang="stylus">
.notification-bubble
  &__standalone
    max-width: 320px
    position: absolute
    right: 20px
    top: 8rem
    z-index: 10

  &__embedded
    max-width: 320px
    position: relative
    right: 0
    top: 0

  &__container
    max-width: 288px
    background-color: rgba(0,0,0,0.4)
    backdrop-filter: blur(20px)
    border-radius: var(--border-radius-notification)
    padding: 16px
    font-size: 16px
    margin-bottom: 16px

  &__header
    display: flex
    align-items: center
    margin-bottom: 8px

  &__title
    flex: 1 1 auto

  &__content
    padding: 0 !important
    display: block
    overflow: auto

  &__message
    text-decoration: none

    &>a
      color: #fff!important
      transition: color 250ms
      text-decoration: underline
</style>
