<template>
  <div>
    <input type="text">
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'PortalSearch',
  props: {},
  data() {
    return {
      modalVisible: false,
    };
  },
  computed: {},

  methods: {},
})
export default class PortalSearch extends Vue {}
</script>
<style></style>
