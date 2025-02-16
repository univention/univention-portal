/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2023-2024 Univention GmbH
 */

import axios from 'axios';

import {
  actions,
  featureTogglesOld,
} from '@/store';
import { initialRootState, PortalActionContext, RootState } from '@/store/root.models';
import { FeatureToggles } from '@/store/modules/featureToggles/models';

const mockedGet = jest.spyOn(axios, 'get');

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

type StubActionContext = PortalActionContext<RootState>;

describe('userIsLoggedIn', () => {

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
    };
    // TODO: Use "jest.replaceProperty" once we have jest >= 27 available
    const originalFeatureToggles = { ...featureTogglesOld };
    featureTogglesOld.umcSessionRefresh = false;

    actions.userIsLoggedIn(actionContext);
    expect(actionContext.dispatch).not.toHaveBeenCalledWith('umcSession/startSessionRefresh');

    Object.assign(featureTogglesOld, originalFeatureToggles);
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

  const stubPortalResponse = {
    data: stubPortalData,
  };

  async function stubDispatch(actionName: string) {
    if (actionName === 'portalJsonRequest') {
      return stubPortalResponse;
    }
    return 'default';
  }

  const stubActionContext: StubActionContext = {
    state: initialRootState,
    commit: jest.fn(),
    dispatch: jest.fn(stubDispatch),
    getters: jest.fn(),
    rootState: initialRootState,
    rootGetters: jest.fn(),
  };

  test('sets feature toggles based on portal data', async () => {
    const stubFeatureToggles = { feature_a: true };
    stubPortalData.feature_toggles = stubFeatureToggles;
    const stubPayload = {};
    mockedGet.mockResolvedValue('stub_response');
    await actions.loadPortal(stubActionContext, stubPayload);
    expect(stubActionContext.commit).toHaveBeenCalledWith(
      'featureToggles/setFeatureToggles',
      stubFeatureToggles,
    );
  });

  test('handles missing feature toggles gracefully', async () => {
    delete stubPortalData.feature_toggles;
    const stubPayload = {};
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
