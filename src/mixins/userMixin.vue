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
    async isLoggedIn() {
      let isLoggedIn = false;
      // use next line if local storage should be use. TODO: needs to be refactored
      // let isLoggedIn = this.getLocalStorageData;

      // get data from vuex store --> not persistent!
      if ((Object.keys(this.userState).length > 0) || !isLoggedIn) {
        this.userData = this.userState;
        isLoggedIn = true;
      }

      return isLoggedIn;
    },
    getLocalStorageData() {
      let isLoggedIn = false;
      const userDataStored = this.handleLocalStorage('get', 'ucs-login');
      if (userDataStored) {
        isLoggedIn = true;
        this.userData = userDataStored;
      }
      return isLoggedIn;
    },
  },
  methods: {
    login() {
      // store login data in vuex store
      this.$store.dispatch('user/setLogin');

      // store login data in local-storage
      this.handleLocalStorage('store', 'ucs-login', JSON.stringify(this.userState));

      this.userData = this.userState;
    },
    logout() {
      // remove login data from vuex store
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
  },
};

export default userMixin;
</script>
