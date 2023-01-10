<template>
  <div
    v-show="visible"
    :class="['announcement', `announcement--${severity}`]"
    role="alert"
  >
    <div class="content">
      <h4 class="announcement-title">
        {{ $localized(title) }}
      </h4>
      <p
        v-if="message"
        class="announcement-message"
      >
        {{ $localized(message) }}
      </p>
      <slot />
    </div>
    <a
      v-if="!sticky"
      href="#"
      class="close-link"
      @click.prevent="onCloseClick"
    >
      X
    </a>
  </div>
  <modal-wrapper
    v-if="showModal"
    :is-active="true"
    :full="true"
    :teleport-to-body="false"
    @background-click="showModal = false"
  >
    <modal-dialog
      :title="DIALOG_TITLE"
      class="read-confirmation-dialog-modal"
      @cancel="closeAndKeep()"
    >
      <main class="read-confirmation-dialog">
        <div>
          {{ $localized(title) }}: {{ $localized(message) }}
        </div>
      </main>
      <footer>
        <button
          ref="acceptButton"
          class="primary"
          @click="closeAndHide()"
        >
          <span>
            {{ CONFIRM }}
          </span>
        </button>
      </footer>
    </modal-dialog>
  </modal-wrapper>
</template>

<script lang="ts">
import { LocalizedString, PortalAnnouncementSeverity } from '@/store/modules/portalData/portalData.models';
import { defineComponent, PropType } from 'vue';
import ModalDialog from '@/components/modal/ModalDialog.vue';
import ModalWrapper from '@/components/modal/ModalWrapper.vue';
import _ from '@/jsHelper/translate';

export default defineComponent({
  name: 'Announcement',
  components: {
    ModalWrapper,
    ModalDialog,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: Object as PropType<LocalizedString>,
      required: true,
    },
    message: {
      type: Object as PropType<LocalizedString>,
      default: '',
    },
    severity: {
      type: String as PropType<PortalAnnouncementSeverity>,
      default: 'success',
    },
    sticky: {
      type: Boolean,
      default: false,
    },
    needsConfirmation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: this.getAnnouncementVisibility(),
      showModal: false,
    };
  },
  computed: {
    CONFIRM(): string {
      return _('Confirm');
    },
    DIALOG_TITLE(): string {
      return _('Please confirm');
    },
  },
  methods: {
    setAnnouncementVisibility(visibility: boolean): void {
      this.visible = false;
      localStorage.setItem(`${this.name}_visible`, JSON.stringify(visibility));
    },
    getAnnouncementVisibility(): boolean {
      const visibility = localStorage.getItem(`${this.name}_visible`);
      if (visibility) {
        return JSON.parse(visibility);
      }
      return true;
    },
    onCloseClick() {
      if (this.needsConfirmation) {
        this.showModal = true;
      } else {
        this.setAnnouncementVisibility(false);
      }
    },
    closeAndHide() {
      this.showModal = false;
      this.setAnnouncementVisibility(false);
    },
    closeAndKeep() {
      this.showModal = false;
    },
  },
});

</script>

<style lang="stylus" scoped>
.announcement
  display: grid
  grid-template-columns: 1fr auto
  gap: 2rem
  justify-content: center
  background-color: var(--serveroverview-tile-hover-color)
  color: white
  min-height: 2rem

  .content
    text-align: center

  .announcement-title
    margin-right: .5rem

  .close-link
    padding: .4rem
    font-size: 1.2rem
    color: #fff
    text-decoration: none

  .close-link
    padding: .4rem
    font-size: 1.2rem
    color: #fff
    text-decoration: none

  .announcement-message
    margin-right: .5rem

  .announcement-close
    margin-left: .5rem

  &--info
    background-color: var(--bgc-announcements-info)

  &--danger
    background-color: var(--bgc-announcements-danger)

  &--success
    background-color: var(--bgc-announcements-success)

  &--warn
    background-color: var(--bgc-announcements-warn)

.read-confirmation-dialog
  overflow-y: auto !important
  a
    color: inherit
    transition: color var(--portal-transition-duration), text-decoration-thickness var(--portal-transition-duration)
    text-decoration: underline
    text-decoration-thickness: 1px

    &:focus
      color: var(--color-accent)
      text-decoration-thickness: 3px

.read-confirmation-dialog-modal
  display: flex
  flex-direction: column
</style>
