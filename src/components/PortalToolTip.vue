<template>
  <div class="appDescription">
    <div class="appDescription__header">
      <div class="tile__box--thumbnail">
				<img
          :src="icon"
          :alt="`${title} logo`"
          class="tile__logo"
        >
			</div>
      <div>
        {{ title }}
      </div>
    </div>
    <div>
      Description: {{ description }}
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  name: "PortalToolTip",
  props: {
    title: String,
    link: String,
    icon: String,
    description: String
  }
})

export default class PortalToolTip extends Vue {
  title!: string;
  link!: string;
  icon!: string;
  description!: string;
}
</script>

<style scoped lang="stylus">
.appDescription {
  font-size: var(--font-size-small);
  position: fixed;
  bottom: calc(2 * var(--layout-spacing-unit));
  right: calc(2 * var(--layout-spacing-unit));
  background-color: var(--color-grey0);
  border-radius: 16px;
  max-width: calc(40 * var(--layout-spacing-unit));
  padding: calc(2 * var(--layout-spacing-unit));
  box-shadow: var(--box-shadow);
  pointer-events: none;

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: calc(2 * var(--layout-spacing-unit));

    & .tile__box--thumbnail {
      width: calc(3 * var(--layout-spacing-unit));
      height: calc(3 * var(--layout-spacing-unit));
      margin-right: calc(3 * var(--layout-spacing-unit-small));
    }
  }
}

.tile__box,
.tile__box--thumbnail,
.tile__box--thumbnail--folder {
  border-radius: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--box-shadow);
  background: var(--color-grey40);
}

.tile__box--thumbnail {
  background: #0000ff
}

.tile__logo {
  width: 80%;
  vertical-align: middle;
  border: 0;
}
</style>
