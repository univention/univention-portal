import { mount } from '@vue/test-utils';

import UmcSessionRefreshIframe from '@/components/globals/UmcSessionRefreshIframe.vue';
import * as UmcSessionRefreshIframeUtils from '@/components/globals/UmcSessionRefreshIframe.utils';
import { UmcSessionRefreshResponse } from '@/components/globals/UmcSessionRefreshIframe.utils';

import { stubIframeWithContent, stubUmcSessionRefreshIframeWithInvalidResponse, stubUmcSessionRefreshIframeWithResponse } from './stubs';

import * as stubs from './stubs';

beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
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
      $el: stubUmcSessionRefreshIframeWithResponse(stubs.stubUmcSessionRefreshData()),
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

});

describe('getResultFromIframe', () => {

  test.each([
    200,
    400,
  ])('parses result out of the Iframe\'s content', (status) => {
    const response = stubs.stubUmcSessionRefreshData(status);
    const iframe = stubUmcSessionRefreshIframeWithResponse(response) as HTMLIFrameElement;
    const result = UmcSessionRefreshIframeUtils.getResultFromIframe(iframe);
    expect(result?.status).toBe(status);
  });

  test('ignores invalid JSON data', () => {
    const invalidResponse = '{"stub_attr": "stub_value"}';
    const iframe = stubUmcSessionRefreshIframeWithInvalidResponse(invalidResponse) as HTMLIFrameElement;
    const result = UmcSessionRefreshIframeUtils.getResultFromIframe(iframe);
    expect(result).toBeUndefined();
  });

  test('logs an error on unparsable data', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(jest.fn());
    const invalidResponse = 'Invalid content';
    const iframe = stubUmcSessionRefreshIframeWithInvalidResponse(invalidResponse) as HTMLIFrameElement;
    const result = UmcSessionRefreshIframeUtils.getResultFromIframe(iframe);
    expect(result).toBeUndefined();
    expect(consoleErrorMock).toHaveBeenCalled();
  });

  test('returns undefined on invalid document', () => {
    const iframe = stubIframeWithContent('<html><div>Stub content</div></html>') as HTMLIFrameElement;
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

  async function simulateRefresh(store, wrapper) {
    store.commit('umcSession/refreshNeeded', true);
    await wrapper.vm.$nextTick();
    await wrapper.trigger('load');
    await wrapper.trigger('load');
  }

  async function simulateRestartRefresh(store, wrapper) {
    store.commit('umcSession/refreshNeeded', false);
    await wrapper.vm.$nextTick();
    await simulateRefresh(store, wrapper);
  }

});
