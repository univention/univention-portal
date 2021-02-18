<template>
  <span>{{ translated }}</span>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import catalog from '@/i18n/translations.js';

@Options({
  name: 'Translate',
  props: {
    key: {
      type: String,
      required: false,
      default: 'LOGIN',
      validator(key: string) {
        return key in catalog;
      },
    },
  },
  computed: {
    translated() {
      return catalog[this.key].translated.value;
    },
  },
})

export default class Translate extends Vue {}
</script>
