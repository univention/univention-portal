/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

import { getSessionId } from '@/jsHelper/umc';

describe('getSessionId', () => {
  it('should find session cookies with a port', async () => {
    expect(getSessionId('1234', (name) => {
      if (name === 'UMCSessionId-1234') {
        return 'somevalue';
      }
      return undefined;
    })).toBe('somevalue');
  });
  it('should find session cookies without a port', async () => {
    expect(getSessionId('', (name) => {
      if (name === 'UMCSessionId') {
        return 'somevalue';
      }
      return undefined;
    })).toBe('somevalue');
  });
});
