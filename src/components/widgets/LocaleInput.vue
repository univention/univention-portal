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
  <div
    v-for="locale in locales"
    :key="locale"
  >
    <label
      :class="{'form__error--text' : getModalError && getModalError.includes(`${[label]}_${locale}`)}"
    >
      {{ label }} ({{ locale }})
    </label>
    <input
      v-model="modelValueData[locale]"
      :class="{'form__error--input' : getModalError && getModalError.includes(`${[label]}_${locale}`)}"
      autocomplete="off"
      tabindex="0"
      aria-required="true"
      aria-invalid="false"
      @blur="$formChecker(modelValueData, requiredFields, label)"
      @keyup="$formChecker(modelValueData, requiredFields, label)"
    >
    <span
      v-if="getModalError&& getModalError.includes(`${[label]}_${locale}`)"
      class="form__error--message"
    >
      <translate :i18n-key="errorText" /> ({{ locale }})
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapGetters } from 'vuex';

import Translate from '@/i18n/Translate.vue';

export default defineComponent({
  name: 'LocaleInput',
  components: {
    Translate,
  },
  props: {
    modelValue: {
      type: Object as PropType<Record<string, string>>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    requiredFields: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
    errorText: {
      type: Object as PropType<Record<string, string>>,
      default: '',
    },
  },
  emits: [
    'update:modelValue',
  ],
  data() {
    return {
      modelValueData: {},
    };
  },
  computed: {
    ...mapGetters({
      locales: 'locale/getAvailableLocales',
      getModalError: 'modal/getModalError',
    }),
  },
  created() {
    const model = this.modelValue;
    const newModel = {};

    if ('locale' in model) {
      newModel[model.locale] = model.value;
      Object.assign(this.modelValueData, newModel);
    } else {
      Object.assign(this.modelValueData, model);
    }
  },
  updated() {
    this.$emit('update:modelValue', this.modelValueData);
  },
});
</script>
