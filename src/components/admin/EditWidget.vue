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
    :i18n-title-key="label"
    @cancel="cancel"
  >
    <form
      class="admin-entry"
      @submit.prevent="submit"
    >
      <main>
        <slot />
      </main>
      <footer
        v-if="canRemove"
      >
        <button
          type="button"
          @click.prevent="$emit('remove')"
        >
          {{ REMOVE }}
        </button>
      </footer>
      <footer>
        <button
          type="button"
          @click.prevent="cancel"
        >
          {{ CANCEL }}
        </button>
        <button
          class="primary"
          type="submit"
          @click.prevent="submit"
        >
          {{ SAVE }}
        </button>
      </footer>
    </form>
  </modal-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import _ from '@/jsHelper/translate';

import ModalDialog from '@/components/ModalDialog.vue';

export interface ValidatableData {
  getErrors: () => Record<string, string>,
}

export default defineComponent({
  name: 'EditWidget',
  components: {
    ModalDialog,
  },
  emits: ['remove', 'save'],
  props: {
    label: {
      type: String,
      required: true,
    },
    canRemove: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object as PropType<ValidatableData>,
      required: true,
    },
  },
  computed: {
    SAVE(): string {
      return _('Save');
    },
    CANCEL(): string {
      return _('Cancel');
    },
    REMOVE(): string {
      return _('Remove here');
    },
  },
  mounted() {
    this.$el.querySelector('input:enabled')?.focus();
  },
  methods: {
    cancel() {
      this.$store.dispatch('modal/hideAndClearModal');
      this.$store.dispatch('activity/setRegion', 'portalCategories');
    },
    submit() {
      const errors = this.model.getErrors();
      if (Object.keys(errors).length === 0) {
        this.$emit('save');
      } else {
        this.$el.querySelectorAll('input').forEach((input) => {
          if (input.name) {
            if (input.name in errors) {
              input.setAttribute('invalid', 'invalid');
            } else {
              input.removeAttribute('invalid');
            }
          }
        });
        const description = Object.values(errors)
          .map((err) => _(err))
          .join('</li><li>');
        this.$store.dispatch('notifications/addErrorNotification', {
          title: _('The form data is not valid'),
          description: `<ul><li>${description}</li></ul>`,
          hidingAfter: -1,
        });
      }
    },
  },
});
</script>
