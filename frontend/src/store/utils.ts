/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

import axios from 'axios';

import { getCookie } from '@/jsHelper/tools';
import { getAdminState } from '@/jsHelper/admin';

export const portalUrl = process.env.VUE_APP_PORTAL_URL || '';
export const languageJsonPath = process.env.VUE_APP_LANGUAGE_DATA || '/univention/languages.json';
export const portalJsonPath = process.env.VUE_APP_PORTAL_DATA || './portal.json';
export const portalMetaPath = process.env.VUE_APP_META_DATA || '/univention/meta.json';
export const portalApiMePath = process.env.VUE_APP_PORTAL_API_ME || './api/v1/me';

export async function portalJsonRequest(adminMode: boolean) {
  const umcLang = getCookie('UMCLang');
  const headers = {
    'X-Requested-With': 'XMLHTTPRequest',
    'Accept-Language': umcLang || 'en-US',
  };
  if (adminMode || getAdminState()) {
    headers['X-Univention-Portal-Admin-Mode'] = 'yes';

    if (process.env.VUE_APP_LOCAL) {
      return axios.get(`${portalUrl}dev-${portalJsonPath}`, { headers });
    }
  }
  return axios.get(`${portalUrl}${portalJsonPath}`, { headers });
}
