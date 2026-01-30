/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

import axios from 'axios';

import UmcSessionRefreshIframe from '@/components/globals/UmcSessionRefreshIframe.vue';

import { getAdminState } from '@/jsHelper/admin';
import { getCookie } from '@/jsHelper/tools';
import { UserWrapper } from './modules/user/user.models';

export const portalUrl = process.env.VUE_APP_PORTAL_URL || '';
export const languageJsonPath = process.env.VUE_APP_LANGUAGE_DATA || '/univention/languages.json';
export const portalJsonPath = process.env.VUE_APP_PORTAL_DATA || './portal.json';
export const portalMetaPath = process.env.VUE_APP_META_DATA || '/univention/meta.json';
export const portalApiMePath = process.env.VUE_APP_PORTAL_API_ME || './api/v1/me';
export const portalLeftSidebarPath = process.env.VUE_APP_PORTAL_LEFT_SIDEBAR || './navigation.json';

export function buildLeftSidebarUrl(language?: string): string {
  if (language) {
    const url = new URL(portalLeftSidebarPath, window.location.origin);
    url.searchParams.set('language', language);
    return url.pathname + url.search;
  }
  return portalLeftSidebarPath;
}

export function getInitialNavigationUrl(): string {
  // Try to get language from cookie for initial load
  const umcLang = getCookie('UMCLang');
  if (umcLang) {
    const language = umcLang.replace('-', '_');
    return buildLeftSidebarUrl(language);
  }
  return portalLeftSidebarPath;
}

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

export function extractUserData(portal, apiMe): UserWrapper {
  return {
    user: {
      username: portal.username,
      mayEditPortal: portal.may_edit_portal,
      authMode: portal.auth_mode,
      ...(apiMe?.user?.firstname && { firstname: apiMe.user.firstname }),
      ...(apiMe?.user?.lastname && { lastname: apiMe.user.lastname }),
      ...(apiMe?.user?.jpegPhoto && { jpegPhoto: apiMe.user.jpegPhoto }),
      ...(apiMe?.user?.displayName && { displayName: apiMe.user.displayName }),
    },
  };
}
