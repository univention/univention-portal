<!--
  SPDX-FileCopyrightText: 2025 Univention GmbH
  SPDX-License-Identifier: AGPL-3.0-only
-->
<template>
  <div class="space-page">
    <!-- Sidebar -->
    <aside
      class="space-page__sidebar"
      aria-label="Space navigation"
    >
      <div class="space-page__sidebar-header">
        <h2 class="space-page__sidebar-title">
          Chat
        </h2>
      </div>
      <nav
        class="space-page__channels"
        aria-label="Channels"
      >
        <ul
          class="space-page__channel-list"
          role="list"
        >
          <li
            v-for="channel in channels"
            :key="channel.roomId"
            class="space-page__channel-item"
            :class="{ 'space-page__channel-item--active': channel.roomId === activeChannelId }"
          >
            <button
              class="space-page__channel-button"
              :aria-current="channel.roomId === activeChannelId ? 'page' : undefined"
              @click="onSelectChannel(channel.roomId)"
            >
              <span class="space-page__channel-hash">#</span>
              <span class="space-page__channel-name">{{ channel.name }}</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="space-page__main">
      <!-- Loading state -->
      <div
        v-if="loading"
        class="space-page__status"
        role="status"
        aria-live="polite"
      >
        <p>Loading space…</p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="space-page__status space-page__status--error"
        role="alert"
      >
        <p>{{ error }}</p>
        <button
          class="space-page__retry-button"
          @click="retry"
        >
          Retry
        </button>
      </div>

      <!-- Chat content -->
      <template v-else>
        <header class="space-page__channel-header">
          <h1 class="space-page__channel-title">
            <span class="space-page__channel-hash">#</span>{{ activeChannel?.name || 'general' }}
          </h1>
        </header>

        <div
          ref="messagesContainer"
          class="space-page__messages"
          role="log"
          aria-live="polite"
          aria-label="Messages"
          @scroll="onScroll"
        >
          <button
            v-if="paginationToken"
            class="space-page__load-more"
            @click="loadOlder"
          >
            Load older messages
          </button>
          <div
            v-for="msg in messages"
            :key="msg.eventId"
            class="space-page__message"
          >
            <span class="space-page__message-sender">{{ formatSender(msg.sender) }}</span>
            <span class="space-page__message-time">{{ formatTime(msg.timestamp) }}</span>
            <p class="space-page__message-body">
              {{ msg.body }}
            </p>
          </div>
          <div
            v-if="messages.length === 0"
            class="space-page__empty"
          >
            <p>No messages yet. Start the conversation!</p>
          </div>
        </div>

        <!-- Message input -->
        <form
          class="space-page__input-area"
          @submit.prevent="onSend"
        >
          <label
            for="message-input"
            class="sr-only"
          >
            Write your message
          </label>
          <input
            id="message-input"
            v-model="newMessage"
            type="text"
            class="space-page__input"
            placeholder="Write your message"
            :disabled="!canSend"
            autocomplete="off"
          >
          <button
            type="submit"
            class="space-page__send-button"
            :disabled="!canSend || !newMessage.trim()"
            aria-label="Send message"
          >
            Send
          </button>
        </form>
        <p
          v-if="!canSend && !loading && !error"
          class="space-page__no-permission"
        >
          You do not have permission to send messages in this channel.
        </p>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  name: 'SpacePage',

  data() {
    return {
      newMessage: '',
    };
  },

  computed: {
    ...mapGetters('space', [
      'channels',
      'activeChannelId',
      'activeChannel',
      'messages',
      'canSend',
      'loading',
      'error',
    ]),
    paginationToken(): string | null {
      return this.$store.state.space.paginationToken;
    },
  },

  watch: {
    '$route.params.projectId': {
      immediate: true,
      handler(projectId: string) {
        if (projectId) {
          this.$store.dispatch('space/initSpace', projectId);
        }
      },
    },
    messages() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
  },

  methods: {
    onSelectChannel(roomId: string): void {
      this.$store.dispatch('space/selectChannel', roomId);
    },

    async onSend(): Promise<void> {
      const body = this.newMessage.trim();
      if (!body) return;
      this.newMessage = '';
      await this.$store.dispatch('space/sendMessage', body);
    },

    retry(): void {
      const projectId = this.$route.params.projectId as string;
      if (projectId) {
        this.$store.dispatch('space/initSpace', projectId);
      }
    },

    loadOlder(): void {
      this.$store.dispatch('space/loadOlderMessages');
    },

    scrollToBottom(): void {
      const container = this.$refs.messagesContainer as HTMLElement | undefined;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    onScroll(): void {
      const container = this.$refs.messagesContainer as HTMLElement | undefined;
      if (container && container.scrollTop === 0 && this.paginationToken) {
        this.loadOlder();
      }
    },

    formatSender(sender: string): string {
      // Extract local part from @user:domain
      const match = sender.match(/^@([^:]+)/);
      return match ? match[1] : sender;
    },

    formatTime(timestamp: number): string {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
  },
});
</script>

<style lang="stylus">
.space-page
  display: flex
  height: 100vh
  width: 100%
  position: fixed
  top: 0
  left: 0
  z-index: 100
  background: var(--bgc-content-body, #fff)

.space-page__sidebar
  width: 240px
  min-width: 240px
  background: var(--bgc-content-header, #2b2d31)
  color: var(--font-color-contrast, #f2f3f5)
  display: flex
  flex-direction: column
  border-right: 1px solid var(--border-color, #1e1f22)

.space-page__sidebar-header
  padding: 16px
  border-bottom: 1px solid rgba(255, 255, 255, 0.1)

.space-page__sidebar-title
  margin: 0
  font-size: 14px
  font-weight: 600
  text-transform: uppercase
  letter-spacing: 0.5px
  color: var(--font-color-contrast-muted, #949ba4)

.space-page__channels
  flex: 1
  overflow-y: auto
  padding: 8px 0

.space-page__channel-list
  list-style: none
  margin: 0
  padding: 0

.space-page__channel-item
  margin: 1px 8px
  border-radius: 4px

  &--active
    background: rgba(255, 255, 255, 0.1)

  &:hover:not(&--active)
    background: rgba(255, 255, 255, 0.05)

.space-page__channel-button
  display: flex
  align-items: center
  width: 100%
  padding: 6px 8px
  border: none
  background: transparent
  color: inherit
  font-size: 14px
  cursor: pointer
  text-align: left
  border-radius: 4px

  &:focus-visible
    outline: 2px solid var(--color-focus, #5865f2)
    outline-offset: -2px

.space-page__channel-hash
  color: var(--font-color-contrast-muted, #949ba4)
  margin-right: 4px
  font-weight: 500

.space-page__channel-name
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

.space-page__main
  flex: 1
  display: flex
  flex-direction: column
  min-width: 0

.space-page__channel-header
  padding: 12px 16px
  border-bottom: 1px solid var(--border-color, #e3e5e8)
  flex-shrink: 0

.space-page__channel-title
  margin: 0
  font-size: 16px
  font-weight: 600

.space-page__messages
  flex: 1
  overflow-y: auto
  padding: 16px
  display: flex
  flex-direction: column
  gap: 8px

.space-page__message
  padding: 4px 0

.space-page__message-sender
  font-weight: 600
  font-size: 14px
  margin-right: 8px

.space-page__message-time
  font-size: 12px
  color: var(--font-color-muted, #72767d)

.space-page__message-body
  margin: 2px 0 0
  font-size: 14px
  line-height: 1.4
  word-break: break-word

.space-page__input-area
  display: flex
  gap: 8px
  padding: 12px 16px
  border-top: 1px solid var(--border-color, #e3e5e8)
  flex-shrink: 0

.space-page__input
  flex: 1
  padding: 10px 12px
  border: 1px solid var(--border-color, #e3e5e8)
  border-radius: 8px
  font-size: 14px
  outline: none

  &:focus
    border-color: var(--color-focus, #5865f2)
    box-shadow: 0 0 0 1px var(--color-focus, #5865f2)

  &:disabled
    opacity: 0.5
    cursor: not-allowed

.space-page__send-button
  padding: 10px 20px
  border: none
  border-radius: 8px
  background: var(--color-accent, #5865f2)
  color: #fff
  font-size: 14px
  font-weight: 500
  cursor: pointer

  &:hover:not(:disabled)
    background: var(--color-accent-hover, #4752c4)

  &:disabled
    opacity: 0.5
    cursor: not-allowed

  &:focus-visible
    outline: 2px solid var(--color-focus, #5865f2)
    outline-offset: 2px

.space-page__status
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  flex: 1
  padding: 32px
  text-align: center
  font-size: 16px

  &--error
    color: var(--color-error, #ed4245)

.space-page__retry-button
  margin-top: 12px
  padding: 8px 16px
  border: 1px solid currentColor
  border-radius: 4px
  background: transparent
  color: inherit
  cursor: pointer

  &:hover
    background: rgba(237, 66, 69, 0.1)

.space-page__load-more
  align-self: center
  padding: 6px 12px
  margin-bottom: 8px
  border: 1px solid var(--border-color, #e3e5e8)
  border-radius: 4px
  background: transparent
  color: var(--color-accent, #5865f2)
  cursor: pointer
  font-size: 13px

  &:hover
    background: var(--color-accent, #5865f2)
    color: #fff

.space-page__empty
  display: flex
  align-items: center
  justify-content: center
  flex: 1
  color: var(--font-color-muted, #72767d)
  font-size: 14px

.space-page__no-permission
  padding: 0 16px 12px
  margin: 0
  font-size: 13px
  color: var(--font-color-muted, #72767d)

.sr-only
  position: absolute
  width: 1px
  height: 1px
  padding: 0
  margin: -1px
  overflow: hidden
  clip: rect(0, 0, 0, 0)
  white-space: nowrap
  border: 0
</style>
