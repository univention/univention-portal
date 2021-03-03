<script>
import { mapGetters } from 'vuex';

const userMixin = {
  computed: {
    ...mapGetters({
      userState: 'user/userState',
    }),
    mayEditPortal() {
      return this.userState.mayEditPortal;
    },
  },
  methods: {
    devLogin() {
      // fake login data in vuex store
      this.$store.dispatch('user/setDevLogin');
    },
    login(user) {
      // store login data in vuex store
      this.$store.dispatch('user/setLogin', { user });
    },
    logout() {
      // remove login data from vuex store
      this.$store.dispatch('user/setLogout');
      this.$store.dispatch('portalData/setEditMode', false);
    },
  },
};

export default userMixin;
</script>
