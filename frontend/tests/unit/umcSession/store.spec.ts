import { actions, refreshBeforeExpiry, UmcSessionActionContext } from '@/store/modules/umcSession';
import * as utils from '@/store/modules/umcSession/utils';
import * as stubs from './stubs';

jest.mock('@/store/modules/umcSession/utils');
const mockedUtils = jest.mocked(utils, true);

jest.useFakeTimers();

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

type StubActionContext = Pick<UmcSessionActionContext, 'dispatch'>

describe('action startSessionRefresh', () => {

  test('triggers UMC session refresh due to session expiry', async () => {
    mockedUtils.umcGetSessionInfo.mockResolvedValue(undefined);
    const stubActionContext: StubActionContext = {
      dispatch: jest.fn(),
    };
    await actions.startSessionRefresh(stubActionContext as UmcSessionActionContext);
    jest.runAllTimers();
    expect(stubActionContext.dispatch).toHaveBeenCalledWith('refreshNeeded');
  });

  test('logs warning in failure case', async () => {
    const warnMock = jest.spyOn(console, 'warn');
    mockedUtils.umcGetSessionInfo.mockRejectedValue(new Error('Stub Error'));
    const stubActionContext: StubActionContext = {
      dispatch: jest.fn(),
    };
    await actions.startSessionRefresh(stubActionContext as UmcSessionActionContext);
    expect(warnMock).toHaveBeenCalled();
  });

  test('triggers passive session refresh based on umc session expiry', async () => {
    mockedUtils.umcGetSessionInfo.mockResolvedValue(stubs.stubUmcSessionInfo);
    const stubActionContext: StubActionContext = {
      dispatch: jest.fn(),
    };

    await actions.startSessionRefresh(stubActionContext as UmcSessionActionContext);

    const expectedRefresh = stubs.stubUmcSessionInfo.remaining - refreshBeforeExpiry;
    jest.advanceTimersByTime((expectedRefresh - 1) * 1000);
    expect(stubActionContext.dispatch).not.toHaveBeenCalledWith('refreshNeeded');
    jest.advanceTimersByTime(1 * 1000);
    expect(stubActionContext.dispatch).toHaveBeenCalledWith('refreshNeeded');
  });

});
