/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2026 Univention GmbH
 */

import axios, { AxiosResponse } from 'axios';

import { actions } from '@/store';
import { initialRootState, PortalActionContext, RootState } from '@/store/root.models';
import * as utils from '@/store/utils';
import { login } from '@/jsHelper/login';
import { router } from '@/router';

jest.mock('@/store/utils');
jest.mock('@/jsHelper/login');
jest.mock('@/router', () => ({
  router: { currentRoute: { value: { name: 'portal' } } },
}));

const mockedGet = jest.spyOn(axios, 'get');
const mockedUtils = jest.mocked(utils, true);
const mockedLogin = jest.mocked(login);

const flushPromises = () => new Promise((resolve) => { setTimeout(resolve, 0); });

const setRouteName = (name: string | undefined) => {
  (router.currentRoute.value as { name: string | undefined }).name = name;
};

type StubActionContext = PortalActionContext<RootState>;

describe('Action loadPortal ensureLogin redirect', () => {
  const stubActionContext: StubActionContext = {
    state: initialRootState,
    commit: jest.fn(),
    dispatch: jest.fn(),
    getters: jest.fn(),
    rootState: initialRootState,
    rootGetters: jest.fn(),
  };

  const stubPayload = { adminMode: false };

  const mockPortalResponse = (data) => {
    mockedUtils.portalJsonRequest.mockResolvedValue({ data } as AxiosResponse);
  };

  beforeEach(() => {
    mockedGet.mockResolvedValue('stub_response' as unknown as AxiosResponse);
    mockedUtils.extractUserData.mockReturnValue({ user: { authMode: 'saml' } } as never);
    setRouteName('portal');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('redirects anonymous visitor to login when ensureLogin is set', async () => {
    mockPortalResponse({ feature_toggles: {}, username: '', portal: { ensureLogin: true } });

    await Promise.race([
      actions.loadPortal(stubActionContext, stubPayload),
      flushPromises(),
    ]);

    expect(mockedLogin).toHaveBeenCalledWith({ authMode: 'saml' });
    expect(stubActionContext.dispatch).not.toHaveBeenCalledWith('portalData/setPortal', expect.anything());
  });

  test('does not redirect on selfservice routes', async () => {
    setRouteName('selfservicePasswordForgotten');
    mockPortalResponse({ feature_toggles: {}, username: '', portal: { ensureLogin: true } });

    await actions.loadPortal(stubActionContext, stubPayload);

    expect(mockedLogin).not.toHaveBeenCalled();
    expect(stubActionContext.dispatch).toHaveBeenCalledWith('portalData/setPortal', expect.anything());
  });

  test('does not redirect authenticated users', async () => {
    mockPortalResponse({ feature_toggles: {}, username: 'admin', portal: { ensureLogin: true } });

    await actions.loadPortal(stubActionContext, stubPayload);

    expect(mockedLogin).not.toHaveBeenCalled();
    expect(stubActionContext.dispatch).toHaveBeenCalledWith('portalData/setPortal', expect.anything());
  });

  test('does not redirect when ensureLogin is disabled', async () => {
    mockPortalResponse({ feature_toggles: {}, username: '', portal: { ensureLogin: false } });

    await actions.loadPortal(stubActionContext, stubPayload);

    expect(mockedLogin).not.toHaveBeenCalled();
    expect(stubActionContext.dispatch).toHaveBeenCalledWith('portalData/setPortal', expect.anything());
  });
});
