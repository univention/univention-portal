<!--
  Copyright 2021-2022 Univention GmbH
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
  <div
    class="multi-choice"
  >
    <select
      :id="forAttrOfLabel"
      :name="name"
      aria-hidden="true"
      :aria-invalid="invalid"
      :aria-describedby="invalidMessageId || null"
      multiple
      class="multi-choice-select"
    >
      <option
        v-for="(item, index) in selectedValue"
        :key="index"
        :value="item"
        selected
      >
        {{ item }}
      </option>
    </select>
    <div class="multi-choice-checkboxes">
      <div
        v-for="(item, index) in lists"
        :key="index"
        ref="checkboxEls"
        class="multi-choice-checkboxes__checkbox"
      >
        <input
          :id="`multi-choice-checkboxes__checkbox--${index}`"
          :checked="selectedValue.includes(item)"
          type="checkbox"
          @click="checkItem(item)"
        >
        <label :for="`multi-choice-checkboxes__checkbox--${index}`">
          {{ item.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isValid } from '@/jsHelper/forms';

export default defineComponent({
  name: 'MultiChoice',
  props: {
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Array,
      default: () => [],
      required: true,
    },
    lists: {
      type: Array,
      default: () => [],
      required: true,
    },
    invalidMessage: {
      type: String,
      default: '',
    },
    forAttrOfLabel: {
      type: String,
      required: true,
    },
    invalidMessageId: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      selectedValue: [] as string[],
    };
  },
  computed: {
    invalid(): boolean {
      return !isValid({
        type: 'MultiChoice',
        invalidMessage: this.invalidMessage,
      });
    },
  },
  methods: {
    checkItem(item: string) {
      // if the item is already selected, remove it from selectedValue; otherwise push it to modelValue
      if (this.selectedValue.includes(item)) {
        this.selectedValue = this.selectedValue.filter((value) => value !== item);
      } else {
        this.selectedValue.push(item);
      }
      this.$emit('update:modelValue', this.selectedValue);
    },
  },
});
</script>

<style lang="stylus">
.multi-choice
  background-color: var(--bgc-inputfield-on-container);
  border-radius: var(--border-radius-container);
  max-height: 10rem
  min-height: 3rem
  overflow-y: scroll

  &-select
    width: 0
    height: 0
    visibility: hidden

  &-checkboxes
    display: flex
    flex-direction: column
    padding: calc(var(--layout-spacing-unit) / 2) calc(var(--layout-spacing-unit) * 2)

    &__checkbox
      display: flex;
      margin-bottom: var(--layout-spacing-unit);
      flex-direction: row;
      align-items: flex-end;

      &::after
          margin-bottom: 0
      & label
        width: 100%
</style>
