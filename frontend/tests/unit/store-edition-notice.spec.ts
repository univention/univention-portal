/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

import { store } from '@/store';

jest.mock('@/router', () => ({
  router: { currentRoute: { value: { name: 'portal' } } },
}));

function portalJson(extra: Record<string, unknown> = {}) {
  return {
    cache_id: '1',
    portal: { content: [], categories: [] },
    entries: [],
    folders: [],
    categories: [],
    announcements: [],
    corner_links: [],
    menu_links: [],
    quick_links: [],
    user_links: [],
    ...extra,
  };
}

function editionNoticeAfterLoading(extra: Record<string, unknown>): boolean {
  store.commit('portalData/PORTALDATA', { portal: portalJson(extra), adminMode: false });
  return store.getters['portalData/editionNotice'];
}

describe('portalData editionNotice', () => {
  test('is hidden only if the server confirms an enterprise subscription', () => {
    expect(editionNoticeAfterLoading({ edition_notice: false })).toBe(false);
  });

  test('is shown without enterprise subscription', () => {
    expect(editionNoticeAfterLoading({ edition_notice: true })).toBe(true);
  });

  test('is shown if the server does not send the flag', () => {
    expect(editionNoticeAfterLoading({})).toBe(true);
  });
});
