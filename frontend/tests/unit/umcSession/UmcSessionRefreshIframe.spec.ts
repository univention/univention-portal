/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

import { mount, VueWrapper } from '@vue/test-utils';
import { Store } from 'vuex';

import UmcSessionRefreshIframe from '@/components/globals/UmcSessionRefreshIframe.vue';
import * as UmcSessionRefreshIframeUtils from '@/components/globals/UmcSessionRefreshIframe.utils';
import { UmcSessionRefreshResponse } from '@/components/globals/UmcSessionRefreshIframe.utils';
import { RootState } from '@/store/root.models';
import * as loginHelper from '@/jsHelper/login';

import * as stubs from './stubs';

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();

  // Mock window.location to prevent navigation errors in tests
  delete (window as any).location;
  window.location = {
    href: '',
    pathname: '/test-path',
  } as any;
});

describe('Template', () => {

  test('Renders iframe to refresh the session when refresh is needed', async () => {
    const store = stubs.createStubStore({ refreshNeeded: true });
    const wrapper = mount(UmcSessionRefreshIframe, {
      global: {
        plugins: [
          store,
        ],
      },
    });

    expect(wrapper.find('iframe').exists()).toBe(true);
  });

  test('Renders nothing when refresh is not needed', () => {
    const store = stubs.createStubStore({ refreshNeeded: false });
    const wrapper = mount(UmcSessionRefreshIframe, {
      global: {
        plugins: [
          store,
        ],
      },
    });

    expect(wrapper.find('iframe').exists()).toBe(false);
  });

});

describe('Method onLoad', () => {

  test('ignores the first load event', async () => {
    const store = stubs.createStubStore({ refreshNeeded: true });
    const wrapper = mount(UmcSessionRefreshIframe, {
      global: {
        plugins: [
          store,
        ],
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRefreshResultMock = jest.spyOn(wrapper.vm as any, 'handleRefreshResult');

    await wrapper.trigger('load');
    expect(handleRefreshResultMock).not.toHaveBeenCalled();
  });

  test('handles the second load event', async () => {
    const store = stubs.createStubStore({ refreshNeeded: true });
    const wrapper = mount(UmcSessionRefreshIframe, {
      global: {
        plugins: [
          store,
        ],
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRefreshResultMock = jest.spyOn(wrapper.vm as any, 'handleRefreshResult');
    handleRefreshResultMock.mockImplementation(jest.fn());

    await wrapper.trigger('load');
    await wrapper.trigger('load');
    expect(handleRefreshResultMock).toHaveBeenCalled();
  });

});

describe('Method handleRefreshResult', () => {

  test('integration with utility functions', async () => {
    const mockedThis = {
      $el: stubs.stubUmcSessionRefreshIframeWithResponse(stubs.stubUmcSessionRefreshData()),
      $store: {
        dispatch: jest.fn(),
      },
    };

    UmcSessionRefreshIframe.methods?.handleRefreshResult.call(mockedThis);
    expect(mockedThis.$store.dispatch).toHaveBeenCalledWith('umcSession/restartSessionRefresh');
  });

  test('dispatches "umcSession/restartSessionRefresh" on successful response', () => {
    const result: UmcSessionRefreshResponse = { status: 200 };
    jest.spyOn(UmcSessionRefreshIframeUtils, 'getResultFromIframe').mockImplementation(() => result);
    const mockedThis = {
      $store: {
        dispatch: jest.fn(),
      },
    };

    UmcSessionRefreshIframe.methods?.handleRefreshResult.call(mockedThis);
    expect(mockedThis.$store.dispatch).toHaveBeenCalledWith('umcSession/restartSessionRefresh');
  });

  test.each([
    { status: 400 },
    { status: 500 },
    undefined,
  ])('dispatches "umcSession/disableSessionRefresh" on failure response', (result) => {
    jest.spyOn(UmcSessionRefreshIframeUtils, 'getResultFromIframe').mockImplementation(() => result);
    const mockedThis = {
      $store: {
        dispatch: jest.fn(),
      },
    };

    UmcSessionRefreshIframe.methods?.handleRefreshResult.call(mockedThis);
    expect(mockedThis.$store.dispatch).toHaveBeenCalledWith('umcSession/disableSessionRefresh');
  });

  test('calls login helper on SAML NoPassive error', () => {
    const loginSpy = jest.spyOn(loginHelper, 'login').mockImplementation(jest.fn());
    const result: UmcSessionRefreshResponse = {
      status: 400,
      message: 'NoPassive error',
      isSamlNoPassiveError: true,
    };
    jest.spyOn(UmcSessionRefreshIframeUtils, 'getResultFromIframe').mockImplementation(() => result);

    const mockedUser = stubs.stubUserStateSaml.user;
    const mockedThis = {
      $store: {
        dispatch: jest.fn(),
      },
      user: mockedUser,
    };

    UmcSessionRefreshIframe.methods?.handleRefreshResult.call(mockedThis);

    expect(mockedThis.$store.dispatch).toHaveBeenCalledWith('umcSession/disableSessionRefresh');
    expect(loginSpy).toHaveBeenCalledWith(mockedUser);
  });

  test('does not call login helper on regular error without NoPassive flag', () => {
    const loginSpy = jest.spyOn(loginHelper, 'login').mockImplementation(jest.fn());
    const result: UmcSessionRefreshResponse = {
      status: 400,
      message: 'Some other error',
      isSamlNoPassiveError: false,
    };
    jest.spyOn(UmcSessionRefreshIframeUtils, 'getResultFromIframe').mockImplementation(() => result);

    const mockedThis = {
      $store: {
        dispatch: jest.fn(),
      },
      user: stubs.stubUserStateSaml.user,
    };

    UmcSessionRefreshIframe.methods?.handleRefreshResult.call(mockedThis);

    expect(mockedThis.$store.dispatch).toHaveBeenCalledWith('umcSession/disableSessionRefresh');
    expect(loginSpy).not.toHaveBeenCalled();
  });

});

describe('getResultFromIframe', () => {

  test.each([
    200,
    400,
  ])('parses result out of the Iframe\'s content', (status) => {
    const response = stubs.stubUmcSessionRefreshData(status);
    const iframe = stubs.stubUmcSessionRefreshIframeWithResponse(response) as HTMLIFrameElement;
    const result = UmcSessionRefreshIframeUtils.getResultFromIframe(iframe);
    expect(result?.status).toBe(status);
  });

  test('ignores invalid JSON data', () => {
    const invalidResponse = '{"stub_attr": "stub_value"}';
    const iframe = stubs.stubUmcSessionRefreshIframeWithInvalidResponse(invalidResponse) as HTMLIFrameElement;
    const result = UmcSessionRefreshIframeUtils.getResultFromIframe(iframe);
    expect(result).toBeUndefined();
  });

  test('logs an error on unparsable data', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(jest.fn());
    const invalidResponse = 'Invalid content';
    const iframe = stubs.stubUmcSessionRefreshIframeWithInvalidResponse(invalidResponse) as HTMLIFrameElement;
    const result = UmcSessionRefreshIframeUtils.getResultFromIframe(iframe);
    expect(result).toBeUndefined();
    expect(consoleErrorMock).toHaveBeenCalled();
  });

  test('returns undefined on invalid document', () => {
    const iframe = stubs.stubIframeWithContent('<html><div>Stub content</div></html>') as HTMLIFrameElement;
    const result = UmcSessionRefreshIframeUtils.getResultFromIframe(iframe);
    expect(result).toBeUndefined();
  });

});

describe('validateResponse', () => {

  const validResponse = stubs.stubUmcSessionRefreshData();
  const expectedResult : UmcSessionRefreshResponse = {
    status: 200,
  };

  test('returns valid response unchanged', () => {
    expect(UmcSessionRefreshIframeUtils.validateResponse(validResponse)).toStrictEqual(expectedResult);
  });

  test('removes extra attributes', () => {
    const extraAttrs = {
      ...validResponse,
      stub_attr: 'stub_value',
      result: {
        ...validResponse.result,
        stub_attr: 'stub_value',
      },
    };
    expect(UmcSessionRefreshIframeUtils.validateResponse(extraAttrs)).toStrictEqual(expectedResult);
  });

  test('detects SAML NoPassive error correctly', () => {
    const samlNoPassiveResponse = stubs.stubSamlNoPassiveErrorData();
    const result = UmcSessionRefreshIframeUtils.validateResponse(samlNoPassiveResponse);

    expect(result).toEqual({
      status: 400,
      message: expect.stringContaining('NoPassive'),
      isSamlNoPassiveError: true,
    });
  });

  test('does not flag non-NoPassive errors', () => {
    const regularErrorResponse = {
      status: 400,
      message: 'Some other error message',
    };
    const result = UmcSessionRefreshIframeUtils.validateResponse(regularErrorResponse);

    expect(result).toEqual({
      status: 400,
      message: 'Some other error message',
      isSamlNoPassiveError: false,
    });
  });

  test.each([
    { status: 'OK', result: { username: 'stub_username' } },
    { status: true, result: { username: 'stub_username' } },
    { },
    undefined,
  ])('returns undefined on wrong input', (invalidResponse) => {
    expect(UmcSessionRefreshIframeUtils.validateResponse(invalidResponse)).toBeUndefined();
  });

});

describe('UmcSessionRefreshIframe', () => {

  test('manages internal state on repeated run correctly', async () => {
    const store = stubs.createStubStore();
    const wrapper = mount(UmcSessionRefreshIframe, {
      global: {
        plugins: [
          store,
        ],
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRefreshResultMock = jest.spyOn(wrapper.vm as any, 'handleRefreshResult');
    handleRefreshResultMock.mockImplementation(jest.fn());

    await simulateRefresh(store, wrapper);
    await simulateRestartRefresh(store, wrapper);
    await simulateRefresh(store, wrapper);

    expect(handleRefreshResultMock).toHaveBeenCalledTimes(2);
  });

  test('accesses user state from store correctly', () => {
    const store = stubs.createStubStore(undefined, stubs.stubUserStateSaml);
    const wrapper = mount(UmcSessionRefreshIframe, {
      global: {
        plugins: [
          store,
        ],
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((wrapper.vm as any).user).toEqual(stubs.stubUserStateSaml.user);
  });

  test('integration test: handles SAML NoPassive error and triggers login', async () => {
    const loginSpy = jest.spyOn(loginHelper, 'login').mockImplementation(jest.fn());
    const store = stubs.createStubStore({ refreshNeeded: true }, stubs.stubUserStateSaml);
    const storeDispatchSpy = jest.spyOn(store, 'dispatch');

    const wrapper = mount(UmcSessionRefreshIframe, {
      global: {
        plugins: [
          store,
        ],
      },
    });

    // Mock the iframe result to return SAML NoPassive error
    const samlErrorResponse = stubs.stubSamlNoPassiveErrorData();
    jest.spyOn(UmcSessionRefreshIframeUtils, 'getResultFromIframe')
      .mockImplementation(() => UmcSessionRefreshIframeUtils.validateResponse(samlErrorResponse));

    // Simulate the iframe loading twice (first load is ignored, second triggers handleRefreshResult)
    await wrapper.trigger('load');
    await wrapper.trigger('load');

    // Verify login was called with the correct user
    expect(loginSpy).toHaveBeenCalledWith(stubs.stubUserStateSaml.user);
    expect(storeDispatchSpy).toHaveBeenCalledWith('umcSession/disableSessionRefresh');
  });

  async function simulateRefresh(store: Store<RootState>, wrapper: VueWrapper) {
    store.commit('umcSession/refreshNeeded', true);
    await wrapper.vm.$nextTick();
    await wrapper.trigger('load');
    await wrapper.trigger('load');
  }

  async function simulateRestartRefresh(store: Store<RootState>, wrapper: VueWrapper) {
    store.commit('umcSession/refreshNeeded', false);
    await wrapper.vm.$nextTick();
    await simulateRefresh(store, wrapper);
  }

});
