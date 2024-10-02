/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

import { actions, mutations, refreshBeforeExpiry, UmcSessionActionContext } from '@/store/modules/umcSession';
import * as utils from '@/store/modules/umcSession/utils';
import * as stubs from './stubs';

jest.mock('@/store/modules/umcSession/utils');

// TODO: Add solid typing back once the dependency upgrade has been merged
// const mockedUtils = jest.mocked(utils, true);
const mockedUtils = utils as any;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

type StubActionContext = Pick<UmcSessionActionContext, 'commit' | 'dispatch' | 'state'>

describe('action startSessionRefresh', () => {

  const stubActionContext: StubActionContext = {
    state: { refreshNeeded: false },
    commit: jest.fn(),
    dispatch: jest.fn(),
  };

  test('triggers UMC session refresh due to session expiry', async () => {
    mockedUtils.umcGetSessionInfo.mockResolvedValue(undefined);
    await actions.startSessionRefresh(stubActionContext as UmcSessionActionContext);
    jest.runAllTimers();
    expect(stubActionContext.commit).toHaveBeenCalledWith('refreshNeeded', true);
  });

  test('logs warning in failure case', async () => {
    const warnMock = jest.spyOn(console, 'warn');
    mockedUtils.umcGetSessionInfo.mockRejectedValue(new Error('Stub Error'));
    await actions.startSessionRefresh(stubActionContext as UmcSessionActionContext);
    expect(warnMock).toHaveBeenCalled();
  });

  test('triggers passive session refresh based on umc session expiry', async () => {
    mockedUtils.umcGetSessionInfo.mockResolvedValue(stubs.stubUmcSessionInfo);

    await actions.startSessionRefresh(stubActionContext as UmcSessionActionContext);

    const expectedRefresh = stubs.stubUmcSessionInfo.remaining - refreshBeforeExpiry;
    jest.advanceTimersByTime((expectedRefresh - 1) * 1000);
    expect(stubActionContext.commit).not.toHaveBeenCalledWith('refreshNeeded', true);
    jest.advanceTimersByTime(1 * 1000);
    expect(stubActionContext.commit).toHaveBeenCalledWith('refreshNeeded', true);
  });

  test('resets pending timer', async () => {
    mockedUtils.umcGetSessionInfo.mockResolvedValue(stubs.stubUmcSessionInfo);
    const refreshNeededMock = jest.spyOn(mutations, 'refreshNeeded');
    const stubStore = stubs.createStubStore();

    await stubStore.dispatch('umcSession/startSessionRefresh');
    jest.advanceTimersByTime(5 * 1000);
    await stubStore.dispatch('umcSession/startSessionRefresh');
    jest.advanceTimersByTime((stubs.stubUmcSessionInfo.remaining + 1) * 1000);

    expect(refreshNeededMock).toHaveBeenCalledTimes(1);
  });

});

describe('action restartSessionRefresh', () => {

  test('disables refreshNeeded', async () => {
    const refreshNeededMock = jest.spyOn(mutations, 'refreshNeeded');
    const stubStore = stubs.createStubStore({ refreshNeeded: true });
    await stubStore.dispatch('umcSession/restartSessionRefresh');

    expect(refreshNeededMock).toHaveBeenCalledWith(expect.anything(), false);
  });

  test('starts a new session refresh', async () => {
    const startSessionRefreshMock = jest.spyOn(actions, 'startSessionRefresh');
    const stubStore = stubs.createStubStore({ refreshNeeded: true });
    await stubStore.dispatch('umcSession/restartSessionRefresh');

    expect(startSessionRefreshMock).toHaveBeenCalled();
  });

});

describe('action disableSessionRefresh', () => {

  test('disables refreshNeeded', async () => {
    const refreshNeededMock = jest.spyOn(mutations, 'refreshNeeded');
    const stubStore = stubs.createStubStore({ refreshNeeded: true });
    await stubStore.dispatch('umcSession/disableSessionRefresh');

    expect(refreshNeededMock).toHaveBeenCalledWith(expect.anything(), false);
  });

  test('starts a new session refresh', async () => {
    const startSessionRefreshMock = jest.spyOn(actions, 'startSessionRefresh');
    const stubStore = stubs.createStubStore({ refreshNeeded: true });
    await stubStore.dispatch('umcSession/disableSessionRefresh');

    expect(startSessionRefreshMock).not.toHaveBeenCalled();
  });

  test('resets pending timer', async () => {
    mockedUtils.umcGetSessionInfo.mockResolvedValue(stubs.stubUmcSessionInfo);
    const refreshNeededMock = jest.spyOn(mutations, 'refreshNeeded');
    const stubStore = stubs.createStubStore();

    await stubStore.dispatch('umcSession/startSessionRefresh');
    jest.advanceTimersByTime(5 * 1000);
    await stubStore.dispatch('umcSession/disableSessionRefresh');
    jest.advanceTimersByTime((stubs.stubUmcSessionInfo.remaining + 1) * 1000);

    expect(refreshNeededMock).toHaveBeenCalledTimes(1);
    expect(refreshNeededMock).toHaveBeenCalledWith(expect.anything(), false);
  });

});
