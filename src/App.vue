<template>
  <router-view />
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { store } from '@/store';

export default class App extends Vue {
  store: typeof store = store;
  /* eslint-disable */
  mounted() {
    store.dispatch('loadPortal');
  }
  /* eslint-enable */
}
</script>
