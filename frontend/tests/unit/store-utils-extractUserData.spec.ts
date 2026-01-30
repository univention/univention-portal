/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

import { extractUserData } from '@/store/utils';

describe('extractUserData', () => {
  /**
   * ExtractUserData returns:
   * user: {
   *   username
   *   mayEditPortal
   *   auth_mode
   *   firstname?
   *   lastname?
   *   displayName?
   *   jpegPhoto?
   * }
   */

  const portalData = {
    username: 'anna',
    may_edit_portal: true,
    auth_mode: 'ucs',
  };

  test('sets properties from api/v1/me when available', () => {
    // Arrange
    const apiMeData = {
      user: {
        firstname: 'Anna',
        lastname: 'Alster',
        displayName: 'Anna Alster',
        jpegPhoto: 'base64photo',
      },
    };

    // Act
    const { user } = extractUserData(portalData, apiMeData);

    // Assert
    expect(user.username).toBe('anna');
    expect(user.mayEditPortal).toBeTruthy();
    expect(user.authMode).toBe('ucs');
    expect(user.firstname).toBe('Anna');
    expect(user.lastname).toBe('Alster');
    expect(user.displayName).toBe('Anna Alster');
    expect(user.jpegPhoto).toBe('base64photo');
  });

  test('does not set properties not available from api/v1/me', () => {
    // Arrange
    const apiMeData = {
      user: {},
    };

    // Act
    const { user } = extractUserData(portalData, apiMeData);

    // Assert
    expect(user.username).toBe('anna');
    expect(user.mayEditPortal).toBeTruthy();
    expect(user.authMode).toBe('ucs');
    expect(user).not.toHaveProperty('firstname');
    expect(user).not.toHaveProperty('lastname');
    expect(user).not.toHaveProperty('displayName');
    expect(user).not.toHaveProperty('jpegPhoto');
  });

  test('set partial properties avaialble from api/v1/me', () => {
    // Arrange
    const apiMeData = {
      user: {
        firstname: 'Anna',
        lastname: 'Alster',
      },
    };

    // Act
    const { user } = extractUserData(portalData, apiMeData);

    // Assert
    expect(user.username).toBe('anna');
    expect(user.mayEditPortal).toBeTruthy();
    expect(user.authMode).toBe('ucs');
    expect(user.firstname).toBe('Anna');
    expect(user.lastname).toBe('Alster');
    expect(user).not.toHaveProperty('displayName');
    expect(user).not.toHaveProperty('jpegPhoto');
  });

  test('does not set unsupported user props from api/v1/me', () => {
    // Arrange
    const apiMeData = {
      user: {
        firstname: 'Anna',
        lastname: 'Alster',
        displayName: 'Anna Alster',
        jpegPhoto: 'base64photo',
        foo: 'baz',
      },
    };

    // Act
    const { user } = extractUserData(portalData, apiMeData);

    // Assert
    expect(user.username).toBe('anna');
    expect(user.mayEditPortal).toBeTruthy();
    expect(user.authMode).toBe('ucs');
    expect(user.firstname).toBe('Anna');
    expect(user.lastname).toBe('Alster');
    expect(user.displayName).toBe('Anna Alster');
    expect(user.jpegPhoto).toBe('base64photo');
    expect(user).not.toHaveProperty('foo');
  });
});
