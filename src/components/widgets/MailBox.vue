<template>
  <div class="mailbox">
    <input
      :id="forAttrOfLabel"
      ref="input"
      v-model="mailValue"
      :disabled="disabled"
      :tabindex="tabindex"
      :required="required"
      :name="name"
      type="email"
      :aria-invalid="invalid"
      :aria-describedby="invalidMessageId || undefined"
      data-test="mail-box"
      @keydown.arrow-up.prevent="movingDomainOption('up')"
      @keydown.arrow-down.prevent="movingDomainOption('down')"
    >
    <IconButton
      class="mailbox__icon-button"
      icon="chevron-down"
      aria-label-prop="Open mail domain list"
      @click="toggleDomainList"
    />
    <Transition>
      <div
        v-if="isDomainListOpen"
        class="mailbox__domain-list"
      >
        <div
          v-for="(availableMailDomain, index) in availableMailDomains"
          :key="index"
          :class="['mailbox__domain-list-option', { 'mailbox__domain-list-option--selected': index === selectedDomainIndex }]"
          @click="selectDomainOption(index)"
        >
          <mark class="mailbox__domain-list-option--highlight">
            {{ domainText(mailPrefix, availableMailDomain).hightlightPart }}
          </mark>{{ domainText(mailPrefix, availableMailDomain).nonHightlightPart }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isValid } from '@/jsHelper/forms';
import IconButton from '@/components/globals/IconButton.vue';

interface MailBoxData {
  mailValue: string;
  isDomainListOpen: boolean;
  selectedDomainIndex: number | null;
}

export default defineComponent({
  name: 'MailBox',
  components: {
    IconButton,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    forAttrOfLabel: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    invalidMessage: {
      type: String,
      default: '',
    },
    invalidMessageId: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    tabindex: {
      type: Number,
      default: 0,
    },
    required: {
      type: Boolean,
      default: false,
    },
    mailDomainList: {
      type: Array as () => string[],
      required: true,
    },
  },
  emits: ['update:modelValue'],
  data(): MailBoxData {
    return {
      mailValue: '',
      isDomainListOpen: false,
      selectedDomainIndex: 0,
    };
  },
  computed: {
    invalid(): boolean {
      return !isValid({
        type: 'MailBox',
        invalidMessage: this.invalidMessage,
      });
    },
    mailPrefix(): string {
      if (this.mailValue.includes('@')) return this.mailValue.split('@')[0];
      return '';
    },
    mailDomain(): string {
      if (this.mailValue.includes('@')) return this.mailValue.split('@')[1];
      return '';
    },
    availableMailDomains(): string[] {
      return this.mailDomainList.filter(
        (mailDomain) => mailDomain.includes(this.mailDomain),
      );
    },
  },
  watch: {
    mailValue(value: string) {
      this.selectedDomainIndex = null;
      if (value.includes('@')) {
        this.isDomainListOpen = true;
      } else {
        this.isDomainListOpen = false;
      }
    },
  },
  methods: {
    toggleDomainList(isDomainListOpen?: boolean) {
      if (isDomainListOpen) {
        this.isDomainListOpen = isDomainListOpen;
      } else {
        this.isDomainListOpen = !this.isDomainListOpen;
      }
    },
    domainText(mailPrefix: string, mailDomain: string) {
      const mail = `${mailPrefix}@${mailDomain}`;
      if (mail.includes(this.mailValue)) {
        const hightlightPart = mail.substring(
          mail.indexOf(this.mailValue), this.mailValue.length,
        );
        const nonHightlightPart = mail.substring(
          this.mailValue.length,
        );
        return {
          hightlightPart,
          nonHightlightPart,
        };
      }
      return {
        hightlightPart: '',
        nonHightlightPart: mail,
      };
    },
    movingDomainOption(direction: 'up' | 'down') {
      if (this.selectedDomainIndex === null) this.selectedDomainIndex = 0;
      if (direction === 'up') {
        this.selectedDomainIndex -= 1;
        if (this.selectedDomainIndex < 0) {
          this.selectedDomainIndex = this.availableMailDomains.length - 1;
        }
      } else {
        this.selectedDomainIndex += 1;
        if (this.selectedDomainIndex >= this.availableMailDomains.length) {
          this.selectedDomainIndex = 0;
        }
      }
    },
    selectDomainOption(index: number) {
      this.mailValue = `${this.mailPrefix}@${this.availableMailDomains[index]}`;
      this.toggleDomainList(false);
    },
  },
});
</script>

<style lang="stylus">
.mailbox
  width: fit-content
  position: relative
  &__icon-button
    position: absolute
    top: var(--layout-spacing-unit-small)
    right: 0
  &__domain-list
    display: flex
    flex-direction: column
    &-option
      padding: var(--layout-spacing-unit)
      border-radius: var(--border-radius-interactable)
      background-color: var(--bgc-popup)
      font-size: var(--font-size-4)
      cursor: pointer
      &--selected, &:hover
        background-color: var(--bgc-popup-item-hover)
      &--highlight
        background-color: var(--bgc-popup-item-selected) !important
</style>
