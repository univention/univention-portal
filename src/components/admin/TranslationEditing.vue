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
  <modal-dialog
    :title="TRANSLATION_OF"
    :modal-level="modalLevel"
    @cancel="cancel"
  >
    <form class="translation-editing">
      <label
        v-for="locale in locales"
        :key="locale"
      >
        {{ locale }}
        <span
          v-if="locale === 'en_US'"
        >
          *
        </span>
        <input
          v-model="translationObject[locale]"
          :placeholder="inputValue.en_US"
        >
      </label>
      <div class="translation-editing__footer-buttons">
        <button
          type="button"
          @click.prevent="cancel()"
        >
          {{ CANCEL }}
        </button>
        <button
          class="primary"
          type="button"
          @click.prevent="closeDialog()"
        >
          {{ SAVE }}
        </button>
      </div>
    </form>
  </modal-dialog>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import _ from '@/jsHelper/translate';

import ModalDialog from '@/components/modal/ModalDialog.vue';
import ModalWrapper from '@/components/modal/ModalWrapper.vue';

export default defineComponent({
  name: 'TranslationEditing',
  components: {
    ModalDialog,
    ModalWrapper,
  },
  props: {
    title: {
      type: String,
      default: 'REMOVE',
    },
    inputValue: {
      type: Object,
      required: true,
    },
    modalLevelProp: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      translationObject: {},
    };
  },
  computed: {
    ...mapGetters({
      locales: 'locale/getAvailableLocales',
      getModalError: 'modal/getModalError',
    }),
    TRANSLATION_OF(): string {
      return _('Translation: %(key1)s', { key1: this.title });
    },
    CANCEL(): string {
      return _('Cancel');
    },
    SAVE(): string {
      return _('Save');
    },
    modalLevel(): string {
      // Modal 2 Because it set the correct tabindizies for elements in modal Level 1
      return this.modalLevelProp === 1 ? 'modal' : 'modal2';
    },
  },
  mounted() {
    console.log('this.inputValue', this.inputValue);
  },
  methods: {
    cancel(): void {
      this.$store.dispatch('modal/hideAndClearModal', this.modalLevelProp);
    },
    saveTranslations(): Record<string, unknown> {
      Object.keys(this.locales).forEach((key) => {
        if (!this.translationObject[this.locales[key]]) {
          this.translationObject[this.locales[key]] = this.inputValue.en_US;
        }
      });
      return this.translationObject;
    },
    closeDialog(): void {
      const translations = this.saveTranslations();
      this.$store.dispatch('modal/resolve', {
        level: this.modalLevelProp,
        translations,
      });
    },
  },
});

</script>

<style lang="stylus">
.translation-editing
  &__footer-buttons
    display: flex
    justify-content: space-between
    width: var(--inputfield-width)
</style>
