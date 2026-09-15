/*
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import axios, { AxiosInstance } from 'axios';

/**
 * Matrix Client API helper for interacting with a Matrix homeserver.
 * Handles authentication, room membership checks, and messaging.
 */

export interface MatrixMessage {
  eventId: string;
  sender: string;
  body: string;
  timestamp: number;
  type: string;
}

export interface MatrixRoom {
  roomId: string;
  name: string;
  topic?: string;
  membership?: string;
}

export interface MatrixWhoAmI {
  userId: string;
  deviceId?: string;
}

let matrixBaseUrl = process.env.VUE_APP_MATRIX_BASE_URL || '';

export function setMatrixBaseUrl(url: string): void {
  matrixBaseUrl = url;
}

function createMatrixAxios(accessToken: string): AxiosInstance {
  return axios.create({
    baseURL: `${matrixBaseUrl}/_matrix/client/v3`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Verify the access token is valid by calling /whoami.
 */
export async function whoAmI(accessToken: string): Promise<MatrixWhoAmI> {
  const client = createMatrixAxios(accessToken);
  const response = await client.get('/account/whoami');
  return {
    userId: response.data.user_id,
    deviceId: response.data.device_id,
  };
}

/**
 * Get the list of joined rooms for the authenticated user.
 */
export async function getJoinedRooms(accessToken: string): Promise<string[]> {
  const client = createMatrixAxios(accessToken);
  const response = await client.get('/joined_rooms');
  return response.data.joined_rooms;
}

/**
 * Get room state to extract name and other metadata.
 */
export async function getRoomName(accessToken: string, roomId: string): Promise<string> {
  const client = createMatrixAxios(accessToken);
  try {
    const response = await client.get(`/rooms/${encodeURIComponent(roomId)}/state/m.room.name`);
    return response.data.name || roomId;
  } catch {
    return roomId;
  }
}

/**
 * Check if the user has permission to send messages in a room.
 * @TODO Implement power level check via GET /rooms/{roomId}/state/m.room.power_levels
 */
export async function canSendMessage(
  _accessToken: string,
  _roomId: string,
  _userId: string,
): Promise<boolean> {
  // @TODO: Implement permission check against room power levels
  return true;
}

/**
 * Check membership of the current user in a room.
 */
export async function getRoomMembership(
  accessToken: string,
  roomId: string,
  userId: string,
): Promise<string | null> {
  const client = createMatrixAxios(accessToken);
  try {
    const response = await client.get(
      `/rooms/${encodeURIComponent(roomId)}/state/m.room.member/${encodeURIComponent(userId)}`,
    );
    return response.data.membership || null;
  } catch {
    return null;
  }
}

/**
 * Fetch messages from a room (most recent first).
 */
export async function getMessages(
  accessToken: string,
  roomId: string,
  limit = 50,
  from?: string,
): Promise<{ messages: MatrixMessage[]; end?: string }> {
  const client = createMatrixAxios(accessToken);
  const params: Record<string, string | number> = {
    dir: 'b',
    limit,
  };
  if (from) {
    params.from = from;
  }
  const response = await client.get(`/rooms/${encodeURIComponent(roomId)}/messages`, { params });
  const messages: MatrixMessage[] = (response.data.chunk || [])
    .filter((event: any) => event.type === 'm.room.message')
    .map((event: any) => ({
      eventId: event.event_id,
      sender: event.sender,
      body: event.content?.body || '',
      timestamp: event.origin_server_ts,
      type: event.content?.msgtype || 'm.text',
    }));
  return { messages, end: response.data.end };
}

/**
 * Send a text message to a room.
 * @TODO Implement actual Matrix PUT /rooms/{roomId}/send/m.room.message/{txnId}
 */
export async function sendMessage(
  _accessToken: string,
  _roomId: string,
  _body: string,
): Promise<string> {
  // @TODO: Implement sending messages via Matrix Client API
  throw new Error('sendMessage not yet implemented');
}

/**
 * Resolve a room alias to a room ID.
 */
export async function resolveRoomAlias(
  accessToken: string,
  alias: string,
): Promise<string | null> {
  const client = createMatrixAxios(accessToken);
  try {
    const response = await client.get(`/directory/room/${encodeURIComponent(alias)}`);
    return response.data.room_id || null;
  } catch {
    return null;
  }
}

/**
 * Get the children rooms of a Matrix space.
 */
export async function getSpaceChildren(
  accessToken: string,
  spaceRoomId: string,
): Promise<MatrixRoom[]> {
  const client = createMatrixAxios(accessToken);
  try {
    const response = await client.get(
      `${matrixBaseUrl}/_matrix/client/v1/rooms/${encodeURIComponent(spaceRoomId)}/hierarchy`,
      {
        baseURL: '',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: { limit: 100 },
      },
    );
    const rooms: MatrixRoom[] = (response.data.rooms || [])
      .filter((room: any) => room.room_id !== spaceRoomId)
      .map((room: any) => ({
        roomId: room.room_id,
        name: room.name || room.canonical_alias || room.room_id,
        topic: room.topic,
      }));
    return rooms;
  } catch {
    return [];
  }
}
