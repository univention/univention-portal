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
  <div class="form-entry-edit">
    <template
      v-if="!showGroupsLayer"
    >
      <div
        :style="`background: ${entryForm.backgroundColor || 'var(--color-grey40)'}`"
        class="portal-tile__box"
      >
        <img
          :src="entryForm.pathToLogo || './questionMark.svg'"
          :alt="`Logo ${$localized(entryForm.title)}`"
          class="portal-tile__img form-entry-edit__img"
          onerror="this.src='./questionMark.svg'"
        >
      </div>
      <div
        :title="$localized(entryForm.title)"
        class="portal-tile__name form-entry-edit__name"
      >
        {{ $localized(entryForm.title) }}
      </div>
      <hr>
    </template>

    <!-- Step 0 -->
    <template
      v-if="step === 0 && !showGroupsLayer"
    >
      <div class="modal-admin__layout-row">
        <div class="form-input__wrapper">
          <label class="form-input__label">
            <translate i18n-key="INTERNAL_NAME" />
            <span> *</span>
          </label>
          <div
            class="form-input__container"
          >
            <!-- TODO: BUG!!! closes the modal if I type -->
            <input
              v-model="entryForm.id"
              type="text"
              :placeholder="INTERNAL_NAME"
              :disabled="getCurrentModal === 'editEntry'"
              class="form-input--default form-input--text"
              name="id"
              autocomplete="off"
              tabindex="0"
              aria-required="true"
              aria-invalid="false"
              @blur="checkInput($event, 'blur')"
              @keyup="checkInput($event, 'keyup')"
            >
            <p class="form-entry-edit__checkbox">
              <!-- TODO: BUG!!! not checked if activated is true in portal.json -->
              <input
                :id="`${entryForm.id}_label`"
                v-model="entryForm.activated"
                type="checkbox"
                class="form-input--checkbox"
                name="activated"
                autocomplete="off"
                tabindex="0"
              >
              <label
                :for="`${entryForm.id}_label`"
                class="form-entry-edit__checkbox--label"
              >
                <translate i18n-key="ACTIVATED" /> - {{ entryForm.activated }}
              </label>
            </p>
          </div>
        </div>

        <template v-if="showAllowedGroups">
          <div class="form-input__wrapper">
            <label class="modal-admin__label">
              <translate i18n-key="RESTRICT_VISIBILITY_TO_GROUPS" /> *
            </label>
            <span class="modal-admin__hint-wrapper">
              <portal-icon
                icon="help-circle"
                icon-width="2rem"
                class="modal-admin__hint-icon"
                @click="toggleHint()"
              />
              <span
                v-if="showHint"
                class="modal-admin__hint"
              >
                <div class="modal-admin__hint-connector" />
                <div
                  class="modal-admin__hint-content"
                  role="alert"
                >
                  <translate i18n-key="MODAL_HINT_RESTRICT_VISIBILITY" />
                </div>
              </span>
            </span>
          </div>
          <div class="form-input__wrapper">
            <div class="form-entry-edit__groups-container">
              <p class="form-entry-edit__checkbox">
                <input
                  id="select_all"
                  v-model="selectAll"
                  type="checkbox"
                  class="form-input--checkbox"
                  name="select_all"
                  autocomplete="off"
                  tabindex="0"
                >
                <label
                  for="select_all"
                  class="form-entry-edit__checkbox--label"
                >
                  <translate i18n-key="SELECT_ALL" />
                </label>
              </p>
              <hr>
              <p
                v-for="(group, index) in entryForm.allowedGroups"
                :key="group"
                class="form-entry-edit__checkbox"
              >
                <input
                  :id="index"
                  v-model="entryForm.selectedGroups"
                  :value="group.id"
                  :checked="group.active"
                  type="checkbox"
                  class="form-input--checkbox"
                  autocomplete="off"
                  tabindex="0"
                  aria-required="true"
                  aria-invalid="false"
                  @click="triggerGroupItem"
                >
                <label
                  :for="index"
                  class="form-entry-edit__checkbox--label"
                >
                  {{ group.name }}
                </label>
              </p>
            </div>

            <div class="form-entry-edit__groups-footer">
              <span class="modal-admin__button">
                <button
                  class="modal-admin__button--inner"
                  @click.prevent="addGroups"
                >
                  <portal-icon
                    icon="plus"
                  />
                  <translate
                    i18n-key="ADD"
                  />
                </button>
              </span>

              <span class="modal-admin__button">
                <button
                  class="modal-admin__button--inner"
                  @click.prevent="removeGroups"
                >
                  <portal-icon
                    icon="trash"
                  />
                  <translate
                    i18n-key="REMOVE"
                  />
                </button>
              </span>
            </div>
          </div>
        </template>
      </div>
    </template>
    <!-- //Step 0 -->

    <!-- Step 1 -->
    <template
      v-if="step === 1 && !showGroupsLayer"
    >
      <div class="modal-admin__layout-row">
        <image-upload
          v-model="entryForm.pathToLogo"
          label="Icon"
        />

        <div class="form-input__wrapper">
          <label class="form-input__label">
            <translate i18n-key="BACKGROUND_COLOR" />
          </label>
          <div class="form-input__container">
            <input
              v-model="entryForm.backgroundColor"
              type="text"
              :placeholder="BACKGROUND_COLOR"
              :class="{'form-input--error' : formErrors.error.title_de.error}"
              class="form-input--default form-input--text"
              name="backgroundColor"
              autocomplete="off"
              tabindex="0"
              aria-required="false"
              aria-invalid="false"
            >
          </div>
        </div>
      </div>
    </template>
    <!-- //Step 1 -->

    <!-- Step 2 -->
    <template
      v-if="step === 2 && !showGroupsLayer"
    >
      <div class="modal-admin__layout-row">
        <div>
          <label class="modal-admin__label">
            <translate i18n-key="DISPLAY_NAME" /> *
          </label>
          <span class="modal-admin__hint-wrapper">
            <portal-icon
              icon="help-circle"
              icon-width="2rem"
              class="modal-admin__hint-icon"
              @click="toggleHint()"
            />
            <span
              v-if="showHint"
              class="modal-admin__hint"
            >
              <div class="modal-admin__hint-connector" />
              <div
                class="modal-admin__hint-content"
                role="alert"
              >
                <translate i18n-key="MODAL_HINT_HEADLINE" />
              </div>
            </span>
          </span>
        </div>

        <div class="form-input__wrapper">
          <label class="form-input__label">
            <translate i18n-key="LANGUAGE_CODE" />
          </label>
          <div
            class="form-input__container"
          >
            <input
              v-model="entryForm.key.en_US"
              type="text"
              :placeholder="LANGUAGE_CODE"
              :disabled="true"
              class="form-input--default form-input--text"
              name="key.en_US"
              autocomplete="off"
              tabindex="0"
              aria-required="true"
              aria-invalid="false"
            >
          </div>
        </div>

        <div class="form-input__wrapper">
          <label
            :class="{'form-input__label--error' : formErrors.error.title_en.error}"
            class="form-input__label"
          >
            <translate i18n-key="DISPLAY_NAME" />
          </label>
          <portal-icon
            v-if="formErrors.error.title_en.error"
            class="form-input__icon--error"
            icon="alert-circle"
            icon-width="2rem"
          />
          <div
            class="form-input__container"
          >
            <input
              v-model="entryForm.title.en_US"
              type="text"
              :placeholder="DISPLAY_NAME"
              :class="{'form-input--error' : formErrors.error.title_en.error}"
              class="form-input--default form-input--text"
              name="title.en_US"
              autocomplete="off"
              tabindex="0"
              aria-required="true"
              aria-invalid="false"
              @blur="checkInput($event, 'blur')"
              @keyup="checkInput($event, 'keyup')"
            >
          </div>
          <!-- <span
            v-if="formErrors.error.title_en.error"
            class="form-input__error-message"
          >
            {{ $localized(formErrors.error.title_en.message) }}
          </span> -->
        </div>

        <div class="form-input__wrapper">
          <label class="form-input__label">
            <translate i18n-key="LANGUAGE_CODE" />
          </label>
          <div
            class="form-input__container"
          >
            <input
              v-model="entryForm.key.de_DE"
              type="text"
              :placeholder="LANGUAGE_CODE"
              :disabled="true"
              class="form-input--default form-input--text"
              name="key.de_DE"
              autocomplete="off"
              tabindex="0"
              aria-required="true"
              aria-invalid="false"
            >
          </div>
        </div>

        <div class="form-input__wrapper">
          <label
            :class="{'form-input__label--error' : formErrors.error.title_de.error}"
            class="form-input__label"
          >
            <translate i18n-key="DISPLAY_NAME" />
          </label>
          <portal-icon
            v-if="formErrors.error.title_de.error"
            class="form-input__icon--error"
            icon="alert-circle"
            icon-width="2rem"
          />
          <div
            class="form-input__container"
          >
            <input
              v-model="entryForm.title.de_DE"
              type="text"
              :placeholder="DISPLAY_NAME"
              :class="{'form-input--error' : formErrors.error.title_de.error}"
              class="form-input--default form-input--text"
              name="title.de_DE"
              autocomplete="off"
              tabindex="0"
              aria-required="true"
              aria-invalid="false"
              @blur="checkInput($event, 'blur')"
              @keyup="checkInput($event, 'keyup')"
            >
          </div>
          <!-- <span
            v-if="formErrors.error.title_de.error"
            class="form-input__error-message"
          >
            {{ $localized(formErrors.error.title_de.message) }}
          </span> -->
        </div>
      </div>
    </template>
    <!-- //Step 2 -->

    <!-- Step 3 -->
    <template
      v-if="step === 3 && !showGroupsLayer"
    >
      <div class="modal-admin__layout-row">
        <div class="form-input__wrapper">
          <label class="form-input__label">
            <translate i18n-key="LINK" /> *
          </label>
          <div
            v-for="(item, index) in entryForm.links"
            :key="`links-${index}`"
            class="form-input__container"
          >
            <input
              v-model="entryForm.links[index].value"
              type="text"
              :placeholder="LINK"
              class="form-input--default form-input--text"
              autocomplete="off"
              tabindex="0"
              aria-required="true"
              aria-invalid="false"
            >
            <span
              v-if="entryForm.links.length > 1"
              class="modal-admin__button"
            >
              <button
                class="modal-admin__button--inner"
                @click.prevent="removeField(index, entryForm.links)"
              >
                <portal-icon
                  icon="trash"
                />
                <translate
                  i18n-key="REMOVE"
                />
              </button>
            </span>
          </div>

          <span class="modal-admin__button">
            <button
              class="modal-admin__button--inner"
              @click.prevent="addField(input, entryForm.links)"
            >
              <portal-icon
                icon="plus"
              />
              <translate
                i18n-key="NEW_ENTRY"
              />
            </button>
          </span>
        </div>
      </div>
    </template>
    <!-- //Step 3 -->

    <!-- Step 4 -->
    <template
      v-if="step === 4 && !showGroupsLayer"
    >
      <div class="modal-admin__layout-row">
        <div>
          <label class="modal-admin__label">
            <translate i18n-key="DESCRIPTION" /> *
          </label>
          <span class="modal-admin__hint-wrapper">
            <portal-icon
              icon="help-circle"
              icon-width="2rem"
              class="modal-admin__hint-icon"
              @click="toggleHint()"
            />
            <span
              v-if="showHint"
              class="modal-admin__hint"
            >
              <div class="modal-admin__hint-connector" />
              <div
                class="modal-admin__hint-content"
                role="alert"
              >
                <translate i18n-key="MODAL_HINT_DESCRIPTION" />
              </div>
            </span>
          </span>
        </div>

        <div class="form-input__wrapper">
          <label class="form-input__label">
            <translate i18n-key="LANGUAGE_CODE" />
          </label>
          <div
            class="form-input__container"
          >
            <input
              v-model="entryForm.key.en_US"
              type="text"
              :placeholder="LANGUAGE_CODE"
              :disabled="true"
              class="form-input--default form-input--text"
              name="key.en_US"
              autocomplete="off"
              tabindex="0"
              aria-required="true"
              aria-invalid="false"
            >
          </div>
        </div>

        <div class="form-input__wrapper">
          <label
            :class="{'form-input__label--error' : formErrors.error.description_en.error}"
            class="form-input__label"
          >
            <translate i18n-key="DESCRIPTION" />
          </label>
          <portal-icon
            v-if="formErrors.error.description_en.error"
            class="form-input__icon--error"
            icon="alert-circle"
            icon-width="2rem"
          />
          <div
            class="form-input__container"
          >
            <input
              v-model="entryForm.description.en_US"
              type="text"
              :placeholder="DESCRIPTION"
              :class="{'form-input--error' : formErrors.error.description_en.error}"
              class="form-input--default form-input--text"
              name="description.en_US"
              autocomplete="off"
              tabindex="0"
              aria-required="true"
              aria-invalid="false"
              @blur="checkInput($event, 'blur')"
              @keyup="checkInput($event, 'keyup')"
            >
          </div>
          <!-- <span
            v-if="formErrors.error.description_en.error"
            class="form-input__error-message"
          >
            {{ $localized(formErrors.error.title_en.message) }}
          </span> -->
        </div>

        <div class="form-input__wrapper">
          <label class="form-input__label">
            <translate i18n-key="LANGUAGE_CODE" />
          </label>
          <div
            class="form-input__container"
          >
            <input
              v-model="entryForm.key.de_DE"
              type="text"
              :placeholder="LANGUAGE_CODE"
              :disabled="true"
              class="form-input--default form-input--text"
              name="key.de_DE"
              autocomplete="off"
              tabindex="0"
              aria-required="true"
              aria-invalid="false"
            >
          </div>
        </div>

        <div class="form-input__wrapper">
          <label
            :class="{'form-input__label--error' : formErrors.error.description_de.error}"
            class="form-input__label"
          >
            <translate i18n-key="DESCRIPTION" />
          </label>
          <portal-icon
            v-if="formErrors.error.description_de.error"
            class="form-input__icon--error"
            icon="alert-circle"
            icon-width="2rem"
          />
          <div
            class="form-input__container"
          >
            <input
              v-model="entryForm.description.de_DE"
              type="text"
              :placeholder="DESCRIPTION"
              :class="{'form-input--error' : formErrors.error.description_de.error}"
              class="form-input--default form-input--text"
              name="description.de_DE"
              autocomplete="off"
              tabindex="0"
              aria-required="true"
              aria-invalid="false"
              @blur="checkInput($event, 'blur')"
              @keyup="checkInput($event, 'keyup')"
            >
          </div>
          <!-- <span
            v-if="formErrors.error.description_de.error"
            class="form-input__error-message"
          >
            {{ $localized(formErrors.error.title_de.message) }}
          </span> -->
        </div>
      </div>
    </template>
    <!-- //Step 4 -->

    <!-- showGroupsLayer -->
    <template
      v-if="showGroupsLayer"
    >
      <div class="modal-admin__layout-row">
        <div
          :title="$localized(entryForm.title)"
          class="portal-tile__name form-entry-edit__name"
        >
          TODO: Add form once the service is available
        </div>
        <hr>

        <div class="form-input__wrapper">
          <div class="form-entry-edit__groups-footer">
            <template
              v-if="getInnerModal"
            >
              <span class="modal-admin__button">
                <button
                  class="modal-admin__button--inner"
                  @click.prevent="addGroups"
                >
                  <portal-icon
                    icon="x"
                  />
                  <translate
                    i18n-key="CANCEL"
                  />
                </button>
              </span>

              <span class="modal-admin__button">
                <button
                  class="modal-admin__button--inner"
                  @click.prevent="saveGroups"
                >
                  <portal-icon
                    icon="check"
                  />
                  <translate
                    i18n-key="ADD"
                  />
                </button>
              </span>
            </template>
          </div>
        </div>
      </div>
    </template>
    <!-- //showGroupsLayer -->
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

import ImageUpload from '@/components/widgets/ImageUpload.vue';

import PortalIcon from '@/components/globals/PortalIcon.vue';

import Translate from '@/i18n/Translate.vue';

// let temp = Object.freeze({});

export default defineComponent({
  name: 'FormEntryEdit',
  components: {
    PortalIcon,
    Translate,
    ImageUpload,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
  },
  emits: [
    'closeModal',
    'update:modelValue',
  ],
  setup(props, { emit }) {
    // store
    const store = useStore();
    const getCurrentModal = computed(() => store.getters['admin/getCurrentModal']);

    // data
    const showHint = ref(false);
    const showGroupsLayer = ref(false);
    const showAllowedGroups = false;
    const getInnerModal = computed(() => store.getters['admin/getInnerModal']);

    const formErrors = reactive({
      error: {
        id: {
          error: false,
          message: {
            de_DE: 'Eingabe fehlt!',
            en_EN: 'Value missing!',
          },
        },
        title_de: {
          error: false,
          message: {
            de_DE: 'Eingabe fehlt!',
            en_EN: 'Value missing!',
          },
        },
        title_en: {
          error: false,
          message: {
            de_DE: 'Eingabe fehlt!',
            en_EN: 'Value missing!',
          },
        },
        description_de: {
          error: false,
          message: {
            de_DE: 'Eingabe fehlt!',
            en_EN: 'Value missing!',
          },
        },
        description_en: {
          error: false,
          message: {
            de_DE: 'Eingabe fehlt!',
            en_EN: 'Value missing!',
          },
        },
      },
    });

    // without v-model usage
    // let entryForm = { ...props.modelValue }; // reassign object

    // for v-model usage
    const entryForm = computed({
      get: () => props.modelValue,
      // set: (value) => store.dispatch('admin/setTileObject', value),
      set: (value) => emit('update:modelValue', value),
    });

    console.log('entryForm: ', entryForm);

    // computed
    const selectAll = computed({
      // eslint-disable-next-line arrow-body-style
      get: () => {
        return entryForm.value.allowedGroups ? entryForm.value.selectedGroups.length === entryForm.value.allowedGroups.length : false;
      },
      set: (value) => {
        console.log('value: ', value);

        const selectedItems = [];

        entryForm.value.allowedGroups.forEach((group) => {
          group.active = value;
          /* eslint-disable no-confusing-arrow */
          entryForm.value.allowedGroups.map(
            (groupItem) => groupItem.id === group.id ? {
              ...entryForm.value.allowedGroups,
              ...group,
            } : groupItem,
          );
          /* eslint-enable no-confusing-arrow */
          if (value) {
            selectedItems.push(group.id);
          }
        });
        entryForm.value.selectedGroups = selectedItems;
      },
    });

    // methods
    const toggleHint = () => {
      // HINT: the Vue3 way
      showHint.value = !showHint.value;
    };

    const checkInput = (e, action) => {
      // console.log('checkInput: ', action, e.target.value);

      if ((e.target.value === '') && (action === 'blur')) {
        switch (e.target.name) {
          case 'id':
            formErrors.error.id.error = true;
            break;
          case 'title.de_DE':
            formErrors.error.title_de.error = true;
            break;
          case 'title.en_US':
            formErrors.error.title_en.error = true;
            break;
          default:
            // nothing defined
        }
      }

      if (e.target.value !== '' && action === 'keyup') {
        switch (e.target.name) {
          case 'id':
            formErrors.error.id.error = false;
            break;
          case 'title.de_DE':
            formErrors.error.title_de.error = false;
            break;
          case 'title.en_US':
            formErrors.error.title_en.error = false;
            break;
          default:
            // nothing defined
        }
      }
    };

    const triggerGroupItem = (e) => {
      const itemState = entryForm.value.allowedGroups[e.target.value - 1].active;

      if (itemState) {
        entryForm.value.allowedGroups[e.target.value - 1].active = false;
      } else {
        entryForm.value.allowedGroups[e.target.value - 1].active = true;
      }
    };

    const resetModal = (action) => {
      if (action) {
        emit(action);
      }
    };

    const addGroups = () => {
      console.log('addGroups');
      // HINT: the Vue3 way
      showGroupsLayer.value = !showGroupsLayer.value;
      console.log('showGroupsLayer.value: ', showGroupsLayer.value);

      store.dispatch('admin/setInnerModal', showGroupsLayer.value);
    };

    const removeGroups = () => {
      console.log('removeGroups');

      // TODO: remove selected items from allowedGroups array
    };

    const saveGroups = () => {
      console.log('saveGroups');
      // HINT: the Vue3 way
      showGroupsLayer.value = !showGroupsLayer.value;

      // TODO: save selected items to the allowedGroups array

      store.dispatch('admin/setInnerModal', showGroupsLayer.value);
    };

    const addField = (value, fieldType) => {
      console.log('value: ', value);
      console.log('fieldType: ', fieldType);

      fieldType.push({ value: '' });
    };

    const removeField = (index, fieldType) => {
      fieldType.splice(index, 1);
    };

    // const updateMessage = (e) => {
    //   console.log('entryForm before update: ', entryForm);
    //   console.log('updateMessage target.name: ', e.target.name);
    //   console.log('updateMessage target.value: ', e.target.value);

    //   e.preventDefault();
    //   const [formItem, key] = e.target.name.split('.');

    //   if (key) {
    //     // if you have nested keys to update
    //     entryForm = {
    //       ...entryForm,
    //       [formItem]: {
    //         ...entryForm[formItem],
    //         [key]: e.target.value,
    //       },
    //     };
    //   } else {
    //     // if you're updating on the first level
    //     entryForm = {
    //       ...entryForm,
    //       [formItem]: e.target.value,
    //     };
    //   }

    //   console.log('entryForm updated: ', entryForm);

    //   // store data in local storage
    //   localStorage.setItem('tile', JSON.stringify(entryForm));

    //   emit('update:modelValue', entryForm);

    //   // store.dispatch('admin/updateTileObject', entryForm);
    //   // store.dispatch('admin/updateTileObject', e.target.value);
    // };

    // mounted
    onMounted(() => {
      // set focus on first visible input
      let i = 0;

      for (i; document.forms[0].elements[i].type === 'hidden'; i += 1);
      document.forms[0].elements[i].focus();
    });

    return {
      showHint,
      showAllowedGroups,
      entryForm,
      formErrors,
      toggleHint,
      checkInput,
      selectAll,
      triggerGroupItem,
      resetModal,
      addGroups,
      showGroupsLayer,
      removeGroups,
      getInnerModal,
      saveGroups,
      addField,
      removeField,
      getCurrentModal,
      // updateMessage,
    };
  },
});
</script>

<style lang="stylus">
.form-entry-edit
  padding-bottom: calc(var(--layout-spacing-unit) * 4)

  &__name
    font-size: var(--font-size-2)
    padding-bottom: var(--layout-spacing-unit)
    text-align: start !important

  &__checkbox
    display: flex
    flex-flow: row
    cursor: pointer

    &--label
      padding-top: calc(var(--layout-spacing-unit) / 2)
      cursor: pointer

  &__groups-container
    display: block
    width: 95%
    padding: 0 calc(3 * var(--layout-spacing-unit-small)) !important
    margin-bottom: var(--layout-spacing-unit)
    font-size: var(--font-size-3)
    color: var(--font-color-cotrast-high)
    background-color: var(--inputfield-bgc)
    border: 1px solid var(--inputfield-bgc)
    border-radius: var(--border-radius-interactable)
    transition: background-color, color, border
    transition-duration: 250ms
    box-shadow: var(--box-shadow)

  &__groups-footer
    background-color: var(--color-grey0)
    display: flex
    justify-content: space-between
    padding: var(--layout-spacing-unit) calc(var(--layout-spacing-unit) * 3)
    flex-wrap: wrap
</style>
