<template>
  <modal-dialog
    :i18n-title-key="label"
    @cancel="cancel"
  >
    <form
      @submit.prevent="finish"
    >
      <main>
        <label>
          {{ NAME }}
          <input
            ref="input"
            type="text"
            autocomplete="off"
            :list="datalistId"
            name="display_name"
          >
          <datalist
            :id="datalistId"
          >
            <option
              v-for="item in items"
              :key="item.dn"
              :value="$localized(item.name)"
              :data-value="item.dn"
            />
          </datalist>
        </label>
      </main>
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
          @click.prevent="finish"
        >
          {{ ADD }}
        </button>
      </footer>
    </form>
  </modal-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import _ from '@/jsHelper/translate';

import ModalDialog from '@/components/ModalDialog.vue';

import { setInvalidity, randomId } from '@/jsHelper/tools';
import { put } from '@/jsHelper/admin';

interface ExistingEntryData {
  datalistId: string,
}

export default defineComponent({
  name: 'ExistingEntry',
  components: {
    ModalDialog,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    superDn: {
      type: String,
      required: true,
    },
    objectGetter: {
      type: String,
      required: true,
    },
    superObjectGetter: {
      type: String,
      required: true,
    },
  },
  data(): ExistingEntryData {
    return {
      datalistId: `datalist-${randomId()}`,
    };
  },
  computed: {
    ...mapGetters({
      portalDn: 'portalData/getPortalDn',
      userLinks: 'portalData/userLinks',
      menuLinks: 'portalData/menuLinks',
    }),
    superObjs(): any[] { // eslint-disable-line @typescript-eslint/no-explicit-any
      return this.$store.getters[this.superObjectGetter];
    },
    items(): any[] { // eslint-disable-line @typescript-eslint/no-explicit-any
      return this.$store.getters[this.objectGetter];
    },
    NAME(): string {
      return _('Name');
    },
    CANCEL(): string {
      return _('Cancel');
    },
    ADD(): string {
      return _('Add');
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
    async finish() {
      const input = this.$refs.input as HTMLFormElement;
      const list = input.getAttribute('list');
      const options = document.querySelectorAll(`#${list} option`);

      let dn: string | null = null;
      for (let k = 0; k < options.length; k += 1) {
        const option = options[k];

        if (option.getAttribute('value') === input.value) {
          dn = option.getAttribute('data-value');
          break;
        }
      }
      setInvalidity(this, 'input', !dn);
      if (dn) {
        let success = false;
        this.$store.dispatch('activateLoadingState');
        console.info('Adding', dn, 'to', this.superDn);
        if (this.superDn === '$$user$$') {
          const attrs = {
            userLinks: this.userLinks.concat([dn]),
          };
          success = await put(this.portalDn, attrs, this.$store, 'ENTRY_ADDED_SUCCESS', 'ENTRY_ADDED_FAILURE');
        } else if (this.superDn === '$$menu$$') {
          const attrs = {
            menuLinks: this.menuLinks.concat([dn]),
          };
          success = await put(this.portalDn, attrs, this.$store, 'ENTRY_ADDED_SUCCESS', 'ENTRY_ADDED_FAILURE');
        } else {
          const superObj = this.superObjs.find((obj) => obj.dn === this.superDn);
          const superAttrs = {
            entries: superObj.entries.concat([dn]),
          };
          if (this.objectGetter === 'portalData/portalEntries') {
            success = await put(this.superDn, superAttrs, this.$store, 'ENTRY_ADDED_SUCCESS', 'ENTRY_ADDED_FAILURE');
          } else {
            success = await put(this.superDn, superAttrs, this.$store, 'FOLDER_ADDED_SUCCESS', 'FOLDER_ADDED_FAILURE');
          }
        }
        this.$store.dispatch('deactivateLoadingState');
        if (success) {
          this.cancel();
        }
      }
    },
  },
});
</script>
