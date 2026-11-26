/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

import addLanguageTile from '@/jsHelper/addLanguageTile';
import createUserMenu from '@/jsHelper/createUserMenu';

test('user menu parent has no link target, its entries keep theirs', () => {
  const menu = createUserMenu({
    user_links: ['cn=entry'],
    entries: [{ dn: 'cn=entry', name: { en_US: 'Entry' }, links: [], linkTarget: 'newwindow' }],
    portal: { defaultLinkTarget: 'samewindow' },
  });
  expect(menu.linkTarget).toBeUndefined();
  expect(menu.subMenu[0].linkTarget).toBe('newwindow');
});

test('language menu parent has no link target', () => {
  const menu = addLanguageTile([
    { id: 'en-US', label: 'English' },
    { id: 'de-DE', label: 'Deutsch' },
  ]);
  expect(menu.linkTarget).toBeUndefined();
  expect(menu.subMenu).toHaveLength(2);
});
