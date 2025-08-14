/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

import axios, { AxiosResponse } from 'axios';

import { actions } from '@/store';
import { FeatureToggles } from '@/store/modules/featureToggles/models';
import { initialRootState, PortalActionContext, RootState } from '@/store/root.models';
import * as utils from '@/store/utils';

const mockedGet = jest.spyOn(axios, 'get');
jest.mock('@/store/utils');
const mockedUtils = jest.mocked(utils, true);

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

type StubActionContext = PortalActionContext<RootState>;

describe('Action loadPortal', () => {
  type PortalResponseData = {
    // eslint-disable-next-line camelcase
    feature_toggles?: FeatureToggles,
    username: string,
  }

  const stubPortalData: PortalResponseData = {
    feature_toggles: {},
    username: 'stub_username',
  };

  const stubPortalResponse: Pick<AxiosResponse, 'data'> = {
    data: stubPortalData,
  };

  const stubActionContext: StubActionContext = {
    state: initialRootState,
    commit: jest.fn(),
    dispatch: jest.fn(),
    getters: jest.fn(),
    rootState: initialRootState,
    rootGetters: jest.fn(),
  };

  const stubPayload = {
    adminMode: false,
  };

  test('enriches user data when api_me feature toggle is enabled', async () => {
    mockedUtils.portalJsonRequest.mockResolvedValue(stubPortalResponse as AxiosResponse);
    const stubFeatureToggles = { api_me: true };
    stubPortalData.feature_toggles = stubFeatureToggles;
    const apiMeData = { user: { firstname: 'Test', lastname: 'User' } };
    mockedGet.mockResolvedValue(Promise.resolve({ data: apiMeData }));
    await actions.loadPortal(stubActionContext, stubPayload);
    expect(utils.extractUserData).toHaveBeenCalledWith(stubPortalData, apiMeData);
  });

  test('does not enrich user data when api_me feature toggle is disabled', async () => {
    mockedUtils.portalJsonRequest.mockResolvedValue(stubPortalResponse as AxiosResponse);
    const stubFeatureToggles = { api_me: false };
    stubPortalData.feature_toggles = stubFeatureToggles;
    mockedGet.mockResolvedValue({ data: { user: { firstname: 'Test', lastname: 'User' } } });
    await actions.loadPortal(stubActionContext, stubPayload);
    expect(utils.extractUserData).toHaveBeenCalledWith(stubPortalData, undefined);
  });
});
