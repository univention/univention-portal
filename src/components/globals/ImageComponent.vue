<template>
  <img
    :src="imagePath"
    :class="defaultClass"
    :alt="altText"
  >
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  name: 'ImageComponent',
  props: {
    filePath: {
      type: String,
      default: '/img',
    },
    fileName: {
      type: String,
      default: 'default_nav_tab_icon.jpg',
    },
    fileType: {
      type: String,
      default: 'jpg',
    },
    altText: {
      type: String,
      default: 'Alternative Text',
    },
    defaultClass: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      imagePath: '',
    };
  },

  created() {
    this.imageUrl();
  },

  computed: {

  },

  methods: {
    imageUrl() {
      // const imagePath = '/img/nav_tab_test.svg';
      const imagePath = `${this.filePath}/${this.fileName}`;

      console.log('imagePath: ', imagePath);
      this.imagePath = imagePath;
    },
  },
})

export default class ImageComponent extends Vue {}
</script>

<style lang="stylus">

</style>
