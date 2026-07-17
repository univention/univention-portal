/*
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { ActionContext } from 'vuex';
import { PortalModule, RootState } from '../../root.models';
import {
  MatrixMessage,
  MatrixRoom,
  canSendMessage,
  getMessages,
  getRoomMembership,
  getSpaceChildren,
  resolveRoomAlias,
  whoAmI,
} from '@/jsHelper/matrixClient';

export interface SpaceState {
  projectId: string;
  spaceRoomId: string;
  channels: MatrixRoom[];
  activeChannelId: string;
  messages: MatrixMessage[];
  userId: string;
  canSend: boolean;
  loading: boolean;
  error: string | null;
  paginationToken: string | null;
}

type SpaceActionContext = ActionContext<SpaceState, RootState>;

const space: PortalModule<SpaceState> = {
  namespaced: true,

  state: {
    projectId: '',
    spaceRoomId: '',
    channels: [],
    activeChannelId: '',
    messages: [],
    userId: '',
    canSend: false,
    loading: false,
    error: null,
    paginationToken: null,
  },

  mutations: {
    SET_PROJECT_ID(state: SpaceState, projectId: string): void {
      state.projectId = projectId;
    },
    SET_SPACE_ROOM_ID(state: SpaceState, roomId: string): void {
      state.spaceRoomId = roomId;
    },
    SET_CHANNELS(state: SpaceState, channels: MatrixRoom[]): void {
      state.channels = channels;
    },
    SET_ACTIVE_CHANNEL(state: SpaceState, channelId: string): void {
      state.activeChannelId = channelId;
    },
    SET_MESSAGES(state: SpaceState, messages: MatrixMessage[]): void {
      state.messages = messages;
    },
    PREPEND_MESSAGES(state: SpaceState, messages: MatrixMessage[]): void {
      state.messages = [...messages, ...state.messages];
    },
    APPEND_MESSAGE(state: SpaceState, message: MatrixMessage): void {
      state.messages = [...state.messages, message];
    },
    SET_USER_ID(state: SpaceState, userId: string): void {
      state.userId = userId;
    },
    SET_CAN_SEND(state: SpaceState, canSend: boolean): void {
      state.canSend = canSend;
    },
    SET_LOADING(state: SpaceState, loading: boolean): void {
      state.loading = loading;
    },
    SET_ERROR(state: SpaceState, error: string | null): void {
      state.error = error;
    },
    SET_PAGINATION_TOKEN(state: SpaceState, token: string | null): void {
      state.paginationToken = token;
    },
    RESET(state: SpaceState): void {
      state.projectId = '';
      state.spaceRoomId = '';
      state.channels = [];
      state.activeChannelId = '';
      state.messages = [];
      state.userId = '';
      state.canSend = false;
      state.loading = false;
      state.error = null;
      state.paginationToken = null;
    },
  },

  getters: {
    projectId: (state: SpaceState) => state.projectId,
    channels: (state: SpaceState) => state.channels,
    activeChannelId: (state: SpaceState) => state.activeChannelId,
    messages: (state: SpaceState) => state.messages,
    userId: (state: SpaceState) => state.userId,
    canSend: (state: SpaceState) => state.canSend,
    loading: (state: SpaceState) => state.loading,
    error: (state: SpaceState) => state.error,
    activeChannel: (state: SpaceState) => state.channels.find((c) => c.roomId === state.activeChannelId),
  },

  actions: {
    /**
     * Initialize the space for a given project.
     * Resolves the space alias, fetches channels, and loads the default #general channel.
     */
    async initSpace({ commit, dispatch, rootGetters }: SpaceActionContext, projectId: string): Promise<void> {
      commit('RESET');
      commit('SET_LOADING', true);
      commit('SET_PROJECT_ID', projectId);

      const accessToken: string | undefined = rootGetters['oidc/token'];
      if (!accessToken) {
        commit('SET_ERROR', 'Not authenticated. Please log in to access this space.');
        commit('SET_LOADING', false);
        return;
      }

      try {
        // Verify identity
        const identity = await whoAmI(accessToken);
        commit('SET_USER_ID', identity.userId);

        // Resolve the space room alias for this project
        const spaceAlias = `#project-${projectId}:${process.env.VUE_APP_MATRIX_DOMAIN || 'localhost'}`;
        const spaceRoomId = await resolveRoomAlias(accessToken, spaceAlias);
        if (!spaceRoomId) {
          commit('SET_ERROR', `Space not found for project: ${projectId}`);
          commit('SET_LOADING', false);
          return;
        }
        commit('SET_SPACE_ROOM_ID', spaceRoomId);

        // Check membership in the space
        const membership = await getRoomMembership(accessToken, spaceRoomId, identity.userId);
        if (membership !== 'join') {
          commit('SET_ERROR', 'You do not have access to this space. Please request an invitation.');
          commit('SET_LOADING', false);
          return;
        }

        // Get child rooms (channels)
        const children = await getSpaceChildren(accessToken, spaceRoomId);
        commit('SET_CHANNELS', children);

        // Find and select #general or first channel
        const generalChannel = children.find(
          (ch) => ch.name?.toLowerCase() === 'general' || ch.name?.toLowerCase() === '#general',
        );
        const defaultChannel = generalChannel || children[0];
        if (defaultChannel) {
          await dispatch('selectChannel', defaultChannel.roomId);
        } else {
          commit('SET_ERROR', 'No channels found in this space.');
        }
      } catch (err: any) {
        const message = err?.response?.data?.error || err?.message || 'Failed to load space.';
        commit('SET_ERROR', message);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    /**
     * Select a channel and load its messages.
     */
    async selectChannel({ commit, state, rootGetters }: SpaceActionContext, roomId: string): Promise<void> {
      const accessToken: string | undefined = rootGetters['oidc/token'];
      if (!accessToken) return;

      commit('SET_ACTIVE_CHANNEL', roomId);
      commit('SET_MESSAGES', []);
      commit('SET_PAGINATION_TOKEN', null);

      // Check membership in the channel
      const membership = await getRoomMembership(accessToken, roomId, state.userId);
      if (membership !== 'join') {
        commit('SET_CAN_SEND', false);
        commit('SET_ERROR', 'You are not a member of this channel.');
        return;
      }

      commit('SET_ERROR', null);

      // Check send permission
      const allowed = await canSendMessage(accessToken, roomId, state.userId);
      commit('SET_CAN_SEND', allowed);

      // Fetch messages
      const { messages, end } = await getMessages(accessToken, roomId, 50);
      // Messages come in reverse chronological order, reverse for display
      commit('SET_MESSAGES', messages.reverse());
      commit('SET_PAGINATION_TOKEN', end || null);
    },

    /**
     * Send a message to the active channel.
     * @TODO Wire up once sendMessage is implemented in matrixClient.
     */
    async sendMessage({ state, rootGetters }: SpaceActionContext, body: string): Promise<void> {
      const accessToken: string | undefined = rootGetters['oidc/token'];
      if (!accessToken || !state.activeChannelId || !state.canSend) return;

      // @TODO: call sendMessage() and append to messages once implemented
      console.warn('sendMessage not yet implemented', { roomId: state.activeChannelId, body });
    },

    /**
     * Load older messages (pagination).
     */
    async loadOlderMessages({ commit, state, rootGetters }: SpaceActionContext): Promise<void> {
      const accessToken: string | undefined = rootGetters['oidc/token'];
      if (!accessToken || !state.activeChannelId || !state.paginationToken) return;

      const { messages, end } = await getMessages(
        accessToken,
        state.activeChannelId,
        50,
        state.paginationToken,
      );
      commit('PREPEND_MESSAGES', messages.reverse());
      commit('SET_PAGINATION_TOKEN', end || null);
    },
  },
};

export default space;
