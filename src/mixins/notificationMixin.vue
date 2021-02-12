<script>
import { mapGetters } from 'vuex';

const notificationMixin = {
  computed: {
    ...mapGetters({
      bubbleState: 'notificationBubble/bubbleState',
      bubbleStateEmbedded: 'notificationBubble/bubbleStateEmbedded',
    }),
  },
  methods: {
    dismissBubble(bubbleType) {
      if ((bubbleType === 'standalone') && this.bubbleState) {
        // store modal state
        this.$store.dispatch('notificationBubble/setHideBubble');

        // TODO: remove specific bubble content
        // this.$store.dispatch('notificationBubble/setContent', {});
      } else if ((bubbleType === 'embedded') && this.bubbleStateEmbedded) {
        // store modal state
        this.$store.dispatch('notificationBubble/setHideBubbleEmbedded');

        // TODO: remove specific bubble content
        // this.$store.dispatch('notificationBubble/setContentEmbedded', {});
      } else if (this.bubbleState) {
        // store modal state
        this.$store.dispatch('notificationBubble/setHideBubble');
      }
    },
    bubbleClick(e) {
      if (e.target.matches('.notification-bubble__link, .notification-bubble__link *')) {
        this.dismissBubble();
        console.info('Bubble link clicked - TODO: add some action');
      }
    },
  },
};

export default notificationMixin;
</script>
