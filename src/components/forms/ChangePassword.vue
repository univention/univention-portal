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
    i18n-title-key="CHANGE_PASSWORD"
    @cancel="cancel"
  >
    <form
      @submit.prevent="finish"
    >
      <label for="oldPassword">
        <translate i18n-key="OLD_PASSWORD" />
        <input-error-message
          :display-condition="!oldPasswordSet && submitButtonClicked"
          error-message="Please enter your old password"
        />
      </label>
      <input
        id="oldPassword"
        ref="oldPassword"
        v-model="oldPassword"
        name="old-password"
        type="password"
      >
      <label for="newPassword">
        <translate i18n-key="NEW_PASSWORD" />
        <input-error-message
          :display-condition="!newPasswordSet && submitButtonClicked"
          error-message="Please enter your new password"
        />
      </label>
      <input
        id="newPassword"
        ref="newPassword"
        v-model="newPassword"
        name="new-password"
        type="password"
      >
      <label for="newPasswordRetype">
        <translate i18n-key="NEW_PASSWORD" /> (<translate i18n-key="RETYPE" />)
        <input-error-message
          :display-condition="!newPassword2Set && submitButtonClicked"
          error-message="Please confirm your new password."
        />
        <input-error-message
          error-message="The new passwords don't match"
          :display-condition="!newPasswordsMatch && submitButtonClicked"
        />
      </label>
      <input
        id="newPasswordRetype"
        ref="newPassword2"
        v-model="newPassword2"
        name="new-password-retype"
        type="password"
      >
      <footer>
        <button
          type="button"
          @click.prevent="cancel"
        >
          <translate i18n-key="CANCEL" />
        </button>
        <button
          type="submit"
          @click.prevent="finish"
        >
          <translate i18n-key="CHANGE_PASSWORD" />
        </button>
      </footer>
    </form>
  </modal-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { setInvalidity } from '@/jsHelper/tools';

import Translate from '@/i18n/Translate.vue';
import ModalDialog from '@/components/modal/ModalDialog.vue';
import InputErrorMessage from '@/components/forms/InputErrorMessage.vue';

interface ChangePasswordData {
    oldPassword: string,
    newPassword: string,
    newPassword2: string,
    submitButtonClicked: boolean,
}

export default defineComponent({
  name: 'ChangePassword',
  components: {
    ModalDialog,
    Translate,
    InputErrorMessage,
  },
  data(): ChangePasswordData {
    return {
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
      submitButtonClicked: false,
    };
  },
  computed: {
    oldPasswordSet(): boolean {
      return !!this.oldPassword;
    },
    newPasswordSet(): boolean {
      return !!this.newPassword;
    },
    newPassword2Set(): boolean {
      return !!this.newPassword2;
    },
    newPasswordsMatch(): boolean {
      return this.newPassword === this.newPassword2;
    },
  },
  mounted(): void {
    (this.$refs.oldPassword as HTMLElement).focus();
  },
  methods: {
    finish() {
      this.submitButtonClicked = true;
      setInvalidity(this, 'oldPassword', !this.oldPasswordSet);
      setInvalidity(this, 'newPassword', !this.newPasswordSet);
      setInvalidity(this, 'newPassword2', !this.newPasswordsMatch);
      const everythingIsCorrect = this.oldPasswordSet && this.newPasswordSet && this.newPasswordsMatch;
      if (!everythingIsCorrect) {
        if (!this.oldPasswordSet) {
          (this.$refs.oldPassword as HTMLElement).focus();
        } else if (!this.newPasswordSet) {
          (this.$refs.newPassword as HTMLElement).focus();
        } else if (!this.newPassword2Set || !this.newPasswordsMatch) {
          (this.$refs.newPasnewPassword2sword as HTMLElement).focus();
        }
        return;
      }
      this.$store.dispatch('modal/resolve', {
        level: 1,
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      });
    },
    cancel() {
      // for second modal purpose
      // this.$store.dispatch('modal/hideAndClearModal', 2);
      this.$store.dispatch('modal/hideAndClearModal');
    },
  },
});
</script>
