<template>
  <nav
    class="dijit dijitReset dijitInline ucsButton ucsIconButton dijitToggleButton"
  >
    <span role="presentation" widgetid="umc_widgets_ToggleButton_1"
      ><span
        class="dijitReset dijitInline dijitButtonNode"
        data-dojo-attach-event="ondijitclick:__onClick"
        role="presentation"
        ><span
          class="dijitReset dijitStretch dijitButtonContents"
          data-dojo-attach-point="titleNode,focusNode"
          role="button"
          aria-labelledby="umc_widgets_ToggleButton_1_label"
          tabindex="0"
          id="umc_widgets_ToggleButton_1"
          title=""
          style="user-select: none;"
        >
          <span
            class="dijitReset dijitInline dijitButtonText dijitDisplayNone"
            id="umc_widgets_ToggleButton_1_label"
            data-dojo-attach-point="containerNode"
          ></span></span></span
      ><input
        type="button"
        value=""
        class="dijitOffScreen"
        data-dojo-attach-event="onclick:_onClick"
        tabindex="-1"
        aria-hidden="true"
        data-dojo-attach-point="valueNode"
    /></span>
  </nav>
</template>
<script lang="ts">
export default {
  name: "Navigation",
};
</script>
