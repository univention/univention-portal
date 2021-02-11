<script>
import { mapGetters } from 'vuex';

const notificationMixin = {
  computed: {
    ...mapGetters({
      bubbleState: 'notificationBubble/bubbleState',
    }),
  },
  methods: {
    dismissBubble() {
      if (this.bubbleState) {
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
