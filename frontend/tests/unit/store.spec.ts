/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2023-2024 Univention GmbH
 */

import axios, { AxiosResponse } from 'axios';

import { actions } from '@/store';
import { initialRootState, PortalActionContext, RootState } from '@/store/root.models';
import { FeatureToggles } from '@/store/modules/featureToggles/models';
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

describe('Action userIsLoggedIn', () => {

  test('triggers oidc/tryLogin if keycloak url is defined', () => {
    // TODO: Use "jest.replaceProperty" once we have jest >= 27 available
    // jest.replaceProperty(process, 'env', {'VUE_APP_KEYCLOAK_URL': 'http://stub_keycloak_url.example'});
    const origVueAppKeycloakUrl = process.env.VUE_APP_KEYCLOAK_URL;
    process.env.VUE_APP_KEYCLOAK_URL = 'http://stub_keycloak_url.example';

    const actionContext = {
      dispatch: jest.fn(),
      rootGetters: {
        'user/userState': {
          authMode: 'saml',
        },
      },
      state: {
        featureToggles: {
          umc_session_refresh: true,
        },
      },
    };
    actions.userIsLoggedIn(actionContext);
    expect(actionContext.dispatch).toHaveBeenCalledWith('oidc/tryLogin');

    process.env.VUE_APP_KEYCLOAK_URL = origVueAppKeycloakUrl;
  });

  test('does not trigger oidc/tryLogin without keycloak url', () => {
    // TODO: Use "jest.replaceProperty" once we have jest >= 27 available
    // jest.replaceProperty(process, 'env', {'VUE_APP_KEYCLOAK_URL': 'http://stub_keycloak_url.example'});
    const origVueAppKeycloakUrl = process.env.VUE_APP_KEYCLOAK_URL;
    process.env.VUE_APP_KEYCLOAK_URL = '';

    const actionContext = {
      dispatch: jest.fn(),
      rootGetters: {
        'user/userState': {
          authMode: 'saml',
        },
      },
      state: {
        featureToggles: {
          umc_session_refresh: true,
        },
      },
    };
    actions.userIsLoggedIn(actionContext);
    expect(actionContext.dispatch).not.toHaveBeenCalledWith('oidc/tryLogin');

    process.env.VUE_APP_KEYCLOAK_URL = origVueAppKeycloakUrl;
  });

  test('triggers UMC session refresh for SAML authentication', () => {
    const actionContext = {
      dispatch: jest.fn(),
      rootGetters: {
        'user/userState': {
          authMode: 'saml',
        },
      },
      state: {
        featureToggles: {
          umc_session_refresh: true,
        },
      },
    };
    actions.userIsLoggedIn(actionContext);
    expect(actionContext.dispatch).toHaveBeenCalledWith('umcSession/startSessionRefresh');
  });

  test('skips UMC session refresh for ucs authentication', () => {
    const actionContext = {
      dispatch: jest.fn(),
      rootGetters: {
        'user/userState': {
          authMode: 'ucs',
        },
      },
      state: {
        featureToggles: {
          umc_session_refresh: true,
        },
      },
    };
    actions.userIsLoggedIn(actionContext);
    expect(actionContext.dispatch).not.toHaveBeenCalledWith('umcSession/startSessionRefresh');
  });

  test('skips UMC session refresh if feature is disabled', () => {
    const actionContext = {
      dispatch: jest.fn(),
      rootGetters: {
        'user/userState': {
          authMode: 'saml',
        },
      },
      state: {
        featureToggles: {
          umc_session_refresh: false,
        },
      },
    };

    actions.userIsLoggedIn(actionContext);
    expect(actionContext.dispatch).not.toHaveBeenCalledWith('umcSession/startSessionRefresh');
  });

});

describe('Action loadPortal', () => {

  type PortalResponseData = {
    // eslint-disable-next-line camelcase
    feature_toggles?: FeatureToggles,
    username: string,
  }

  const stubPortalData : PortalResponseData = {
    feature_toggles: {},
    username: 'stub_username',
  };

  const stubPortalResponse : Pick<AxiosResponse, 'data'> = {
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

  test('sets feature toggles based on portal data', async () => {
    mockedUtils.portalJsonRequest.mockResolvedValue(stubPortalResponse as AxiosResponse);
    const stubFeatureToggles = { feature_a: true };
    stubPortalData.feature_toggles = stubFeatureToggles;
    mockedGet.mockResolvedValue('stub_response');
    await actions.loadPortal(stubActionContext, stubPayload);
    expect(stubActionContext.commit).toHaveBeenCalledWith(
      'featureToggles/setFeatureToggles',
      stubFeatureToggles,
    );
  });

  test('handles missing feature toggles gracefully', async () => {
    delete stubPortalData.feature_toggles;
    mockedUtils.portalJsonRequest.mockResolvedValue(stubPortalResponse as AxiosResponse);
    mockedGet.mockResolvedValue('stub_response');
    await actions.loadPortal(stubActionContext, stubPayload);
    expect(stubActionContext.commit).not.toHaveBeenCalledWith(
      'featureToggles/setFeatureToggles',
      undefined,
    );
    expect(stubActionContext.commit).not.toHaveBeenCalledWith(
      'featureToggles/setFeatureToggles',
      expect.anything(),
    );
  });

});
