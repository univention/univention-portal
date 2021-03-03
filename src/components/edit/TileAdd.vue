<template>
  <div
    class="tile-add"
    @click="showMenu()"
  />
</template>

<script>
export default {
  name: 'TielAdd',
  methods: {
    showMenu() {
      console.log('showMenu');
    },
  },
};
</script>

<style lang="stylus" scoped>
.tile-add
  margin: 0
  width: var(--app-tile-side-length)
  height: var(--app-tile-side-length)
  min-width: var(--app-tile-side-length)
  border-radius: 15%
  border: 3px solid var(--color-grey40)
  background-color: transparent
  background-image: url('../../assets/img/plus_grey.svg')
  background-position: center
  background-size: 3em
  background-repeat: no-repeat
  cursor: pointer
</style>
