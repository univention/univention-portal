<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="bubbleState"
        class="notification-bubble"
      >
        <div
          :class="`notification-bubble__${bubbleContainer}`"
          class="notification-bubble__container"
        >
          <div class="notification-bubble__header">
            <div class="notification-bubble__title">
              {{ bubbleContent.bubbleTitle }}
            </div>

            <header-button
              :aria-label="bubbleContent.bubbleLabel"
              :icon="bubbleContent.bubbleIcon"
              @click="dismissBubble(`${localNotification}`)"
            />
          </div>

          <div class="notification-bubble__content">
            <!-- eslint-disable vue/no-v-html -->
            <div
              v-if="bubbleContent && bubbleContent.bubbleDescription"
              ref="bubbleContent"
              class="notification-bubble__message"
              @click="handleClick"
              v-html="bubbleContent.bubbleDescription"
            />
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapGetters } from 'vuex';

import HeaderButton from '@/components/navigation/HeaderButton.vue';

import userMixin from '@/mixins/userMixin.vue';

@Options({
  name: 'NotificationBubble',
  components: {
    HeaderButton,
  },
  mixins: [userMixin],
  props: {
    bubbleContainer: {
      type: String,
      default: 'embedded',
    },
  },
  created() {
    this.setContent();
  },
  computed: {
    ...mapGetters({
      bubbleState: 'notificationBubble/bubbleState',
      bubbleContent: 'notificationBubble/bubbleContent',
    }),
  },
  methods: {
    dismissBubble() {
      if (this.bubbleState) {
        // store modal state
        this.$store.dispatch('notificationBubble/setHideBubble');
      }
    },
    setContent() {
      // TODO: replce with dynamic content from e.g. an API
      const payload = {
        bubbleIcon: 'x',
        bubbleLabel: 'Dismiss notification',
        bubbleType: 'localNotification',
        bubbleTitle: 'Login',
        bubbleDescription: 'Login <a class="notification-bubble__link" href="#">here</a> so that you can use the full range of functions of UCS.',
      };

      this.$store.dispatch('notificationBubble/setContent', payload);
    },
    handleClick(e) {
      if (e.target.matches('.notification-bubble__link, .notification-bubble__link *')) {
        this.dismissBubble();
        console.info('Bubble link clicked - TODO: add some action');
      }
    },
  },
})

export default class NotificationBubble extends Vue {}
</script>

<style lang="stylus">
.notification-bubble
  max-width: 320px;

  &__container
    max-width: 288px;
    // background-color: #aaa;
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

  &__header
    display: flex;
    align-items: center;
    margin-bottom: 8px;

  &__title
    flex: 1 1 auto;

  &__content
    padding: 0 !important;
    display: block;
    overflow: auto;

  &__message
    text-decoration: none

    &>a
      color: #fff!important;
      transition: color 250ms;
      text-decoration: underline;

// animation
.fade-enter-active,
.fade-leave-active
  transition: opacity .5s;

.fade-enter,
.fade-leave-to
  opacity: 0;
</style>
