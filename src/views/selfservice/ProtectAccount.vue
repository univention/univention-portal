<template>
  <site
    :title="TITLE"
    :ucr-var-for-frontend-enabling="'umc/self-service/protect-account/frontend/enabled'"
  >
    <div>{{ SUBTITLE }}</div>
    <my-form
      v-model="loginValues"
      :widgets="loginWidgets"
    >
      <footer v-if="!renewOptionsLoaded">
        <button
          type="submit"
          @click.prevent="onContinue"
        >{{ CONTINUE }}</button>
      </footer>
    </my-form>
  </site>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { umc } from '@/jsHelper/umc';
import _ from '@/jsHelper/translate';
import Site from '@/views/selfservice/Site.vue';
import MyForm from '@/components/forms/Form.vue';
import { allValid, initialValue, validateAll } from '@/jsHelper/forms';

interface Data {
  loginWidgets: any[],
  loginValues: any,
  renewWidgets: any[],
  renewValues: any,
  origFormValues: any,
}

export default defineComponent({
  name: 'ProtectAccount',
  components: {
    Site,
    MyForm,
  },
  data(): Data {
    return {
      loginWidgets: [{
        type: 'TextBox',
        name: 'username',
        label: _('Username'),
        invalidMessage: '',
        required: true,
      }, {
        type: 'PasswordBox',
        name: 'password',
        label: _('Password'),
        invalidMessage: '',
        required: true,
      }],
      loginValues: {
        username: 'user', // TODO
        password: 'univention', // TODO
      },
      renewWidgets: [],
      renewValues: {},
      origFormValues: {},
    };
  },
  computed: {
    TITLE(): string {
      return _('Protect account');
    },
    SUBTITLE(): string {
      return _('Everyone forgets his password now and then. Protect yourself and activate the opportunity to set a new password.');
    },
    CONTINUE(): string {
      return _('Continue');
    },
    renewOptionsLoaded(): boolean {
      return this.renewWidgets.length > 0;
    },
  },
  methods: {
    onContinue() {
      validateAll(this.loginWidgets, this.loginValues);
      if (allValid(this.loginWidgets)) {
        this.loginWidgets.forEach((widget) => {
          widget.disabled = true;
        });
        this.loadRenewOptions();
      }
    },
    onCancel() {
      this.renewWidgets = [];
      this.renewValues = {};
      this.loginWidgets.forEach((widget) => {
        widget.disabled = false;
      });
      this.loginValues = {
        username: '',
        password: '',
      };
    },
    loadRenewOptions() {
      this.$store.dispatch('activateLoadingState');
      umc('command/passwordreset/get_contact', {
        username: this.loginValues.username,
        password: this.loginValues.password,
      })
        .then((answer) => {
          const renewOptions = answer.data.result;
        })
        .catch((error) => {
          // TODO get real error message from request
          // TODO put error message in modal
          this.$store.dispatch('notifications/addErrorNotification', {
            title: _('Failed to retrieve renew options'),
            description: 'Failed to retrieve renew options',
          });
          this.onCancel();
        })
        .finally(() => {
          this.$store.dispatch('deactivateLoadingState');
        });
    },
  },
});
</script>
