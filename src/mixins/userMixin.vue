<script>
import { mapGetters } from 'vuex';

const userMixin = {
  computed: {
    ...mapGetters({
      userState: 'user/userState',
    }),
    username() {
      return this.userState.username;
    },
    isAdmin() {
      return this.userState.isAdmin;
    },
  },
  methods: {
    login() {
      this.$store.dispatch('user/setLogin');
    },
    logout() {
      this.$store.dispatch('user/setLogout');
    },
  },
};

export default userMixin;
</script>
