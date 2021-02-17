declare module '@vue/runtime-core' {
  import store from '@/store/';

  interface ComponentCustomProperties {
    $store: store;
  }
}
