<template>
  <div class="portal-tooltip">
    <div class="portal-tooltip__header">
      <div class="portal-tooltip__thumbnail">
        <img
          :src="icon"
          :alt="`${title} logo`"
          class="portal-tooltip__logo"
        >
      </div>
      <div class="portal-tooltip__title">
        {{ title }}
      </div>
    </div>

    <!-- eslint-disable vue/no-v-html -->
    <div
      v-if="description"
      class="portal-tooltip__description"
      v-html="description"
    />
    <!-- eslint-enable vue/no-v-html -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'PortalToolTip',
  props: {
    title: String,
    link: String,
    icon: String,
    description: String,
  },
})

export default class PortalToolTip extends Vue {
  title!: string;

  link!: string;

  icon!: string;

  description!: string;
}
</script>

<style scoped lang="stylus">
.portal-tooltip
  font-size: 16px // 0.8rem
  position: fixed
  bottom: calc(2 * 1rem)
  right: calc(2 * 1rem)
  background-color: #1e1e1d
  border-radius: 16px
  max-width: calc(40 * 1rem)
  padding: calc(2 * 1rem)
  box-shadow: 0rem 0.3rem 0.6rem rgba(0, 0, 0, 0.16)
  pointer-events: none

  &__header
    display: flex
    align-items: center
    margin-bottom: calc(2 * 1rem)

  &__thumbnail
    border-radius: 15%
    display: flex
    align-items: center
    justify-content: center
    box-shadow: 0 0.3rem 0.6rem rgba(0, 0, 0, 0.16)
    background: #868681

    .portal-tooltip__header &
      width: calc(3 * 1rem)
      height: calc(3 * 1rem)
      margin-right: calc(3 * calc(1rem / 2))

  &__logo
    width: 80%
    vertical-align: middle
    border: 0
</style>
