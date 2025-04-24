/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

import { localized } from '@/plugins/localize';
import { store } from '@/store';

const nonDefaultLocale = 'de_DE';

beforeAll(() => {
  // The tests depend on the default locale to be different than "nonDefaultLocale".
  const locale = store.getters['locale/getLocale'];
  // eslint-disable-next-line jest/no-standalone-expect
  expect(locale).not.toBe(nonDefaultLocale);
});

describe('localized', () => {

  test('falls back to any locale if current locale and English are not available', () => {
    const input: any = {
      nonDefaultLocale: 'Stub value',
    };
    const value = localized(input);
    expect(value).toBe('Stub value');
  });

});
