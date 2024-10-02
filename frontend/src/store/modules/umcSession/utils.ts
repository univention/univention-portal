/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

import axios, { AxiosError } from 'axios';

import { umc } from '@/jsHelper/umc';

const getSessionInfoPath = 'get/session-info';

export interface UmcSessionInfo {
  username: string;
  // eslint-disable-next-line camelcase
  auth_type: string;
  remaining: number;
}

export interface UmcGetSessionInfoResponse {
  status: number;
  message?: string;
  result?: UmcSessionInfo;
}

export async function umcGetSessionInfo() : Promise<UmcSessionInfo | undefined> {
  try {
    const result = await umc<UmcGetSessionInfoResponse>(getSessionInfoPath);
    return result.data.result;
  } catch (error) {
    if (axios.isAxiosError<UmcGetSessionInfoResponse>(error) && isSessionExpired(error)) {
      return undefined;
    }
    throw error;
  }
}

function isSessionExpired(error: AxiosError<UmcGetSessionInfoResponse>): boolean {
  if (error.response) {
    return error.response.status === 401;
  }
  return false;
}
