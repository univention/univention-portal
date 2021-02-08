<template>
  <router-view />
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { store } from '@/store/index';

export default class App extends Vue {
  store: typeof store = store;
  /* eslint-disable */
  mounted() {
    store.dispatch('loadPortal');
  }
  /* eslint-enable */
}
</script>

<style lang="stylus">
body
  font-family: 'Open Sans', sans-serif;
  font-weight: normal;
  line-height: var(--font-lineheight-normal);
  font-size: var(--font-size-normal);
  color: var(--font-color-contrast-high);
  margin-top: var(--portal-header-height)
  background-color: var(--bgc-content-body);
h2
  font-size: var(--font-size-header2);
  line-height: var(--font-lineheight-normal);
  font-weight: 600;
</style>
