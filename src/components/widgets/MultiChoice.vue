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
    :name="name"
    class="multi-choice"
  >
    <div
      v-for="(option, index) in modelValue"
      :key="index"
      class="multi-choice__checkbox"
    >
      <input
        :id="'multi-choice-' + index"
        type="checkbox"
        :value="option.value"
        :checked="option.checked"
        @change="onChange(index)"
      >
      <label
        :for="'multi-choice-' + index"
        class="multi-choice__label"
      >
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface MultiChoiceValue {
  value: string;
  label: string;
  checked: boolean;
}

export default defineComponent({
  name: 'MultiChoice',
  props: {
    name: {
      type: String,
      required: true,
    },
    lists: {
      type: Array,
      default: () => [],
      required: true,
    },
    modelValue: {
      type: Array as () => MultiChoiceValue[],
      default: () => [],
      required: true,
    },
  },
  emits: ['update:modelValue'],
  methods: {
    onChange(index: number) {
      const newModelValue = [...this.modelValue];
      newModelValue[index].checked = !newModelValue[index].checked;
      this.$emit('update:modelValue', newModelValue);
    },
  },
});
</script>

<style lang="stylus">
.multi-choice
  background-color: var(--bgc-inputfield-on-container);
  border-radius: var(--border-radius-container);
  min-height: 30px;
  max-height: 150px;
  min-width: 250px;
  width: 100%;
  overflow-y: auto;

  &__checkbox
    display: flex
    align-items: center
    padding: 0 calc(3 * var(--layout-spacing-unit-small))

  &__label
    margin: 0
    padding: var(--layout-spacing-unit-small) 0

</style>
