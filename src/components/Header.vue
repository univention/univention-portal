<template>
  <nav class="portal__header">
    <div class="portal__header__left" tabindex="0">
      <img class="portal__header__left__image" alt="Portal logo" />
      <h2>Univention Portal</h2>
    </div>
  </nav>
</template>
<script lang="ts">
export default {
  name: "Header",
};
</script>
<style lang="stylus">
.portal
    &__header
        position: fixed
        top: 0
        left: 0
        right: 0
        z-index: 1
        background-color: var(--bgc-content-header)
        color: var(--font-color-contrast-high)
        height: var(--portal-header-height)
        display: flex
        padding: 0 calc(2 * var(--layout-spacing-unit))

    &__header__left
        flex: 0 0 auto
        display: flex
        align-items: center
        cursor: pointer

        &__image
            display: none
</style>
