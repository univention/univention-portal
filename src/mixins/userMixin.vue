<script>
import { mapGetters } from 'vuex';

const userMixin = {
  data() {
    return {
      userData: {},
    };
  },
  computed: {
    ...mapGetters({
      userState: 'user/userState',
    }),
    isAdmin() {
      return this.userState.isAdmin;
    },
  },
  methods: {
    login() {
      this.$store.dispatch('user/setLogin');

      // store login data in local-storage
      this.handleLocalStorage('store', 'ucs-login', JSON.stringify(this.userState));

      this.userData = this.userState;
    },
    logout() {
      this.$store.dispatch('user/setLogout');

      // remove login data from local-storage
      this.handleLocalStorage('delete', 'ucs-login');

      this.userData = {};
    },
    // eslint-disable-next-line consistent-return
    handleLocalStorage(option, key, payload) {
      // detect if localstorage is supported
      if (typeof (Storage) !== 'undefined') {
        // store data
        if (option === 'store') {
          localStorage.setItem(key, payload);
        }

        // get data
        if (option === 'get') {
          return localStorage.getItem(key);
        }

        // delete data
        if (option === 'delete') {
          localStorage.removeItem(key);
        }
      }
    },
    isLoggedIn() {
      let userDataStored = {};
      let isLoggedIn = false;

      if (this.userState) {
        userDataStored = this.userState;
      } else {
        userDataStored = this.handleLocalStorage('get', 'ucs-login');
      }

      if (userDataStored.loggedIn) {
        isLoggedIn = true;
        this.userData = userDataStored;
      }

      return isLoggedIn;
    },
  },
};

export default userMixin;
</script>
