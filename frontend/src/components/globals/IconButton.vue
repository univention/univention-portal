<!--
  SPDX-FileCopyrightText: 2021-2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
-->
<template>
  <tabindex-element
    :id="id"
    :active-at="activeAt"
    :aria-label="ariaLabelProp"
    :class="{
      'button--icon--inputfield-sized': hasButtonStyle,
      'button--icon--small': sizeVariant === 'small',
    }"
    class="button--icon"
    tag="button"
    type="button"
    @click.prevent.stop="$emit('click')"
  >
    <slot />
    <portal-icon
      :icon="icon"
    />
  </tabindex-element>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { randomId } from '@/jsHelper/tools';
import TabindexElement from '@/components/activity/TabindexElement.vue';
import PortalIcon from '@/components/globals/PortalIcon.vue';

export default defineComponent({
  name: 'IconButton',
  components: {
    PortalIcon,
    TabindexElement,
  },
  props: {
    id: {
      type: String,
      default: () => `icon-button-${randomId()}`,
    },
    icon: {
      type: String,
      required: true,
    },
    activeAt: {
      type: Array,
      default: () => ['portal'],
    },
    ariaLabelProp: {
      type: String,
      required: true,
    },
    hasButtonStyle: {
      type: Boolean,
      default: false,
    },
    sizeVariant: {
      type: String,
      default: 'medium',
      validator: (value: string) => ['small', 'medium'].includes(value),
    },
  },
  emits: ['click'],
});
</script>
