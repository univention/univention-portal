/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

import axios from 'axios';

import { umcGetSessionInfo } from '@/store/modules/umcSession/utils';
import * as stubs from './stubs';

const mockedPost = jest.spyOn(axios, 'post');

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('umcGetSessionInfo', () => {

  test('triggers POST request to ".../get/session-info"', async () => {
    mockedPost.mockResolvedValue(stubs.stubSessionInfoResponse);
    await umcGetSessionInfo();
    // TODO: Refactor once Jest >=27 is available
    // expect(mockedPost.mock.lastCall[0]).toBe('/univention/get/session-info');
    const lastCall = mockedPost.mock.calls[mockedPost.mock.calls.length - 1];
    expect(lastCall[0]).toBe('/univention/get/session-info');
  });

  test('returns umc response', async () => {
    mockedPost.mockResolvedValue(stubs.stubSessionInfoResponse);
    const result = await umcGetSessionInfo();
    expect(result).toBe(stubs.stubUmcSessionInfo);
  });

  test('returns undefined on 401 Unauthorized response', async () => {
    mockedPost.mockRejectedValue(stubs.stubAxiosErrorSessionTimedOut);
    const result = await umcGetSessionInfo();
    expect(result).toBeUndefined();
  });

  test('throws other errors', async () => {
    mockedPost.mockRejectedValue(stubs.stubAxiosErrorInternalServerError);
    await expect(umcGetSessionInfo()).rejects.toMatchObject({
      message: 'Stub Error Internal Server Error',
    });
  });

});
