<template>
  <div class="tooltip">
    <div class="tooltip__header">
      <div class="tooltip__thumbnail">
				<img
          :src="icon"
          :alt="`${title} logo`"
          class="tooltip__logo"
        >
			</div>
      <div class="tooltip__title">
        {{ title }}
      </div>
    </div>
    <div class="tooltip__description">
      {{ description }}
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
.tooltip {
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

    & .tooltip__thumbnail {
      width: calc(3 * var(--layout-spacing-unit));
      height: calc(3 * var(--layout-spacing-unit));
      margin-right: calc(3 * var(--layout-spacing-unit-small));
    }
  }
}

.tooltip__thumbnail {
  border-radius: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--box-shadow);
  background: var(--color-grey40);
}

.tooltip__logo {
  width: 80%;
  vertical-align: middle;
  border: 0;
}
</style>
