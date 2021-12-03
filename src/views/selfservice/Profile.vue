<template>
  <site
    :title="TITLE"
    :ucr-var-for-frontend-enabling="'umc/self-service/profiledata/enabled'"
  >
    <div>{{ SUBTITLE }}</div>
    <my-form
      v-model="loginValues"
      :widgets="loginWidgets"
    >
      <footer v-if="!attributesLoaded">
        <button
          type="submit"
          @click.prevent="onContinue"
        >{{ CONTINUE }}</button>
      </footer>
    </my-form>
    <my-form
      v-if="attributesLoaded"
      v-model="attributeValues"
      :widgets="attributeWidgets"
    >
      <footer>
        <button
          type="button"
          @click="onCancel"
        >{{ CANCEL }}</button>
        <button
          type="submit"
          class="primary"
          @click.prevent="onSave"
        >{{ SAVE }}</button>
      </footer>
    </my-form>
  </site>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { isEmpty, isEqual } from 'lodash';
import { umc } from '@/jsHelper/umc';
import _ from '@/jsHelper/translate';
import FormElement from '@/components/forms/FormElement.vue';
import MyForm from '@/components/forms/Form.vue';
import { validateAll, initialValue, isValid, allValid } from '@/jsHelper/forms';
import Site from '@/views/selfservice/Site.vue';

interface Data {
  loginWidgets: any[],
  loginValues: any,
  attributeWidgets: any[],
  attributeValues: any,
  origFormValues: any,
}

export default defineComponent({
  name: 'Profile',
  components: {
    MyForm,
    FormElement,
    Site,
  },
  data(): Data {
    // TODO translations
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
        username: '',
        password: '',
      },
      attributeWidgets: [],
      attributeValues: {},
      origFormValues: {},
    };
  },
  computed: {
    TITLE(): string {
      return _('Profile');
    },
    SUBTITLE(): string {
      return _('Customize your profile');
    },
    USERNAME(): string {
      return _('Username');
    },
    PASSWORD(): string {
      return _('Password');
    },
    CONTINUE(): string {
      return _('Continue');
    },
    CANCEL(): string {
      return _('Cancel');
    },
    SAVE(): string {
      return _('Save');
    },
    attributesLoaded(): boolean {
      return this.attributeWidgets.length > 0;
    },
  },
  methods: {
    onContinue() {
      validateAll(this.loginWidgets, this.loginValues);
      if (allValid(this.loginWidgets)) {
        this.loginWidgets.forEach((widget) => {
          widget.disabled = true;
        });
        this.loadAttributes();
      }
    },
    onCancel() {
      this.attributeWidgets = [];
      this.attributeValues = {};
      this.loginWidgets.forEach((widget) => {
        widget.disabled = false;
      });
      this.loginValues = {
        username: '',
        password: '',
      };
    },
    onSave() {
      validateAll(this.attributeWidgets, this.attributeValues);
      if (!allValid(this.attributeWidgets)) {
        return;
      }

      const alteredValues = Object.keys(this.attributeValues).reduce((_alteredValues, attributeName) => {
        if (!isEqual(this.attributeValues[attributeName], this.origFormValues[attributeName])) {
          _alteredValues[attributeName] = this.attributeValues[attributeName];
        }
        return _alteredValues;
      }, {});

      if (isEmpty(alteredValues)) {
        this.$store.dispatch('notifications/addSuccessNotification', {
          title: _('Profile changes'),
          description: 'Your profile data is up to date',
        });
        return;
      }
      this.save(alteredValues);
    },
    save(values) {
      this.$store.dispatch('activateLoadingState');
      umc('command/passwordreset/validate_user_attributes', {
        username: this.loginValues.username,
        password: this.loginValues.password,
        attributes: values,
      })
        .then((answer) => {
          const result = answer.data.result;
          this.attributeWidgets.forEach((widget) => {
            const validationObj = result[widget.name];
            if (validationObj !== undefined) {
              switch (widget.type) {
                case 'TextBox':
                case 'DateBox':
                case 'ComboBox':
                case 'PasswordBox':
                  widget.invalidMessage = validationObj.message;
                  break;
                case 'MultiInput':
                  // TODO test if non array can come from backend
                  if (Array.isArray(validationObj.message)) {
                    widget.invalidMessage = {
                      all: '',
                      values: validationObj.message,
                    };
                  } else {
                    widget.invalidMessage = {
                      all: validationObj.message,
                      values: [],
                    };
                  }
                  break;
                default:
                  break;
              }
            }
          });
          if (allValid(this.attributeWidgets)) {
            umc('command/passwordreset/set_user_attributes', {
              username: this.loginValues.username,
              password: this.loginValues.password,
              attributes: values,
            }).then(() => {
              this.$store.dispatch('notifications/addSuccessNotification', {
                title: _('Profile changes'),
                description: 'Successfully saved changes',
              });
              this.updateOrigFormValues();
            });
          }
        })
        .catch((error) => {
          // TODO get real error message from request
          // TODO put error message in modal
          this.$store.dispatch('notifications/addErrorNotification', {
            title: _('Failed to save profile'),
            description: 'Failed to save profile',
          });
        })
        .finally(() => {
          this.$store.dispatch('deactivateLoadingState');
        });
    },
    updateOrigFormValues() {
      this.origFormValues = JSON.parse(JSON.stringify(this.attributeValues));
    },
    loadAttributes() {
      this.$store.dispatch('activateLoadingState');
      umc('command/passwordreset/get_user_attributes_descriptions', {})
        .then((answer) => {
          const widgets = answer.data.result;
          const attributes = widgets.map((widget) => widget.id);
          return umc('command/passwordreset/get_user_attributes_values', {
            username: this.loginValues.username,
            password: this.loginValues.password,
            attributes,
          }).then((answer2) => {
            const values = answer2.data.result;
            const sanitizeWidget = (widget) => {
              const w: any = {
                // TODO unhandled fields that come from command/passwordreset/get_user_attributes_descriptions
                // description: ""
                // multivalue: false
                // size: "TwoThirds"
                // syntax: "TwoThirdsString"
                type: widget.type,
                name: widget.id ?? '',
                label: widget.label ?? '',
                required: widget.required ?? false,
                readonly: !(widget.editable ?? true) || (widget.readonly ?? false),
              };
              if (widget.type === 'ComboBox') {
                w.options = widget.staticValues;
              }
              if (widget.type === 'MultiInput') {
                w.subtypes = widget.subtypes.map((subtype) => sanitizeWidget(subtype));
              }
              return w;
            };
            const sanitized = widgets.map((widget) => sanitizeWidget(widget));
            sanitized.forEach((widget) => {
              values[widget.name] = initialValue(widget, values[widget.name]);
            });
            this.attributeWidgets = sanitized;
            this.attributeValues = values;
            this.updateOrigFormValues();
            // TODO focus first interactable widget
          });
        })
        .catch((error) => {
          // TODO get real error message from request
          // TODO put error message in modal
          this.$store.dispatch('notifications/addErrorNotification', {
            title: _('Failed to retrieve profile'),
            description: 'Failed to retrieve profile',
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
