<template>
  <div class="self-service-disabled">
    <h1 class="self-service-disabled__title">
      {{ TITLE }}
    </h1>
    <p class="self-service-disabled__text">
      {{ TEXT }}
    </p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import _ from '@/jsHelper/translate';

export default defineComponent({
  name: 'SelfServiceDisabled',
  computed: {
    TITLE(): string {
      return _('This service is disabled');
    },
    TEXT(): string {
      return _('If you have problems using the self service instance, please contact your system administrator.');
    },
  },
});
</script>
<style lang="stylus">
.self-service-disabled
  position: relative
  display: flex
  flex-direction: column

  @media $mqSmartphone
    margin-left: 1em

  &__title
    margin-bottom: 0
</style>
