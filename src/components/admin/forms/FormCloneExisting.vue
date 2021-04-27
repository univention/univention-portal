<template>
  <div v-if="cloneListing">
    <div class="modal-admin__layout-row">
      <div class="form-input__wrapper">
        <label
          class="form-input__label"
        >
          <translate i18n-key="DISPLAY_NAME" />
          <span v-if="inputMandatory"> *</span>
        </label>
        <div
          class="form-input__container"
        >
          <input
            v-model="cloneForm.display_name"
            id="dn"
            type="text"
            :placeholder="INTERNAL_NAME"
            :list="dataList"
            class="form-input--default form-input--text"
            name="display_name"
            autocomplete="off"
            tabindex="0"
            aria-required="true"
            aria-invalid="false"
            @input="setDn"
          >
          <datalist
            id="cloneList"
          >
            <option
              v-for="item in cloneListing"
              :key="item.dn"
              :value="$localized(getName(item))"
              :data-value="item.dn"
            />
          </datalist>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';

import PortalIcon from '@/components/globals/PortalIcon.vue';

import Translate from '@/i18n/Translate.vue';

export default defineComponent({
  name: 'FormCloneExisting',
  components: {
    PortalIcon,
    Translate,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    cloneListing: {
      type: Array,
      required: true,
    },
  },
  emits: [
    'closeModal',
    'removeCategory',
    'saveCategory',
    'update:modelValue',
  ],
  setup(props, { emit }) {
    // data
    const showHint = ref(false);
    const dataList = 'cloneList';

    // v-model
    const cloneForm = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    // methods
    const toggleHint = () => {
      // HINT: the Vue3 way
      showHint.value = !showHint.value;
    };

    const getName = (item) => {
      let ret = '';
      if (item && item.name) {
        ret = item.name;
      }

      if (item && item.display_name) {
        ret = item.display_name;
      }
      return ret;
    };

    // get dn string
    const setDn = (e) => {
      const input = e.target;
      const list = input.getAttribute('list');
      const options = document.querySelectorAll(`#${list} option`);

      for (let k = 0; k < options.length; k += 1 ) {
        const option = options[k];

        if (option.value === input.value) {
          cloneForm.value.dn = option.getAttribute('data-value');
          break;
        }
      }
    };

    // mounted
    onMounted(() => {
      // set focus on first visible input
      let i = 0;

      for (i; document.forms[0].elements[i].type === 'hidden'; i += 1);
      document.forms[0].elements[i].focus();
    });

    return {
      showHint,
      dataList,
      cloneForm,
      toggleHint,
      setDn,
      getName,
    };
  },
});
</script>
