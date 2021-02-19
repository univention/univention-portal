<template>
  <home />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { store } from '@/store';
import Home from '@/views/Home.vue';

@Options({
  name: 'App',

  components: {
    Home,
  },
  /* eslint-disable */
  mounted() {
    store.dispatch('loadPortal');
  }
  /* eslint-enable */
})

export default class App extends Vue {
  store: typeof store = store;
}
</script>
