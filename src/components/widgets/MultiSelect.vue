<!--
  Copyright 2021 Univention GmbH

  https://www.univention.de/

  All rights reserved.

  The source code of this program is made available
  under the terms of the GNU Affero General Public License version 3
  (GNU AGPL V3) as published by the Free Software Foundation.

  Binary versions of this program provided by Univention to you as
  well as other copyrighted, protected or trademarked materials like
  Logos, graphics, fonts, specific documentations and configurations,
  cryptographic keys etc. are subject to a license agreement between
  you and Univention and not subject to the GNU AGPL V3.

  In the case you use this program under the terms of the GNU AGPL V3,
  the program is provided in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public
  License with the Debian GNU/Linux or Univention distribution in file
  /usr/share/common-licenses/AGPL-3; if not, see
  <https://www.gnu.org/licenses/>.
-->
<template>
  <div class="multi-select">
    <label>{{ label }}</label>
    <div
      class="multi-select__select"
    >
      <label
        v-for="value in modelValue"
        :key="value"
      >
        <input
          type="checkbox"
          :tabindex="tabindex"
          @change="toggleSelection(value)"
        >
        <span>{{ dnToLabel(value) }}</span>
      </label>
    </div>
    <footer class="multi-select__footer">
      <button
        type="button"
        :tabindex="tabindex"
        @click.prevent="add"
      >
        <portal-icon
          icon="plus"
        />
        {{ ADD }}
      </button>
      <button
        type="button"
        :tabindex="tabindex"
        @click.prevent="remove"
      >
        <portal-icon
          icon="trash"
        />
        {{ REMOVE }}
      </button>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import _ from '@/jsHelper/translate';

import PortalIcon from '@/components/globals/PortalIcon.vue';

interface MultiSelectSelection {
  selection: string[],
}

export default defineComponent({
  name: 'MultiSelect',
  components: {
    PortalIcon,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Array as PropType<string[]>,
      required: true,
    },
    tabindex: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],
  data(): MultiSelectSelection {
    return {
      selection: [],
    };
  },
  computed: {
    ADD(): string {
      return _('Add');
    },
    REMOVE(): string {
      return _('Remove');
    },
  },
  methods: {
    toggleSelection(value: string) {
      const idx = this.selection.indexOf(value);
      if (idx > -1) {
        this.selection.splice(idx, 1);
      } else {
        this.selection.push(value);
      }
    },
    dnToLabel(dn: string): string {
      const idx = dn.indexOf(',');
      return dn.slice(3, idx);
    },
    add() {
      this.$store.dispatch('modal/setShowModalPromise', {
        level: 2,
        name: 'AddObjects',
        props: {
          alreadyAdded: this.modelValue,
        },
        stubborn: true,
      }).then((values) => {
        this.$store.dispatch('modal/hideAndClearModal', 2);
        const newValues = this.modelValue.concat(values.selection);
        newValues.sort();
        this.$emit('update:modelValue', newValues);
      });
    },
    remove() {
      const values = this.modelValue.filter((value) => !this.selection.includes(value));
      this.$emit('update:modelValue', values);
    },
  },
});
</script>

<style lang="stylus">
.multi-select
  &__select
    padding: 0 var(--layout-spacing-unit)
    background-color: var(--bgc-inputfield-on-container)
    border: 0.1rem solid var(--bgc-inputfield-on-container)
    border-radius: var(--border-radius-interactable)
    height: calc(5 * var(--inputfield-size))
    overflow: auto

    label
      margin-top: var(--layout-spacing-unit)
      display: flex

      input
        flex-shrink: 0

      span
        overflow: hidden
        text-overflow: ellipsis

  &__footer
    margin: var(--layout-spacing-unit) 0
    display: flex
    button + button
      margin-left: var(--layout-spacing-unit)
</style>
