import axios, { AxiosError, AxiosResponse } from 'axios';

import { umcGetSessionInfo, UmcGetSessionInfoResponse, UmcSessionInfo } from '@/store/modules/umcSession/utils';

// jest.mock('axios');
// const mockedPost = jest.mocked(axios.post);

const mockedPost = jest.spyOn(axios, 'post');

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

type StubAxiosResponse<ResponseType> = Pick<AxiosResponse<ResponseType>, 'status' | 'data'>;

const stubUmcSessionInfo : UmcSessionInfo = {
  username: 'stub_username',
  auth_type: 'SAML',
  remaining: 300,
};

const stubResponse : StubAxiosResponse<UmcGetSessionInfoResponse> = {
  status: 200,
  data: {
    status: 200,
    result: stubUmcSessionInfo,
  },
};

const stubResponseSessionTimedOut: StubAxiosResponse<UmcGetSessionInfoResponse> = {
  status: 401,
  data: {
    status: 401,
  },
};

const stubResponseInternalServerError: StubAxiosResponse<UmcGetSessionInfoResponse> = {
  status: 500,
  data: {
    status: 500,
  },
};

const stubAxiosErrorSessionTimedOut = new AxiosError<UmcGetSessionInfoResponse>(
  'Stub Error Session Timed Out',
  'ESTUBERRORCODE',
  undefined,
  undefined,
  stubResponseSessionTimedOut as AxiosResponse<UmcGetSessionInfoResponse>,
);

const stubAxiosErrorInternalServerError = new AxiosError<UmcGetSessionInfoResponse>(
  'Stub Error Internal Server Error',
  'ESTUBERRORCODE',
  undefined,
  undefined,
  stubResponseInternalServerError as AxiosResponse<UmcGetSessionInfoResponse>,
);

describe('umcGetSessionInfo', () => {

  test('triggers POST request to ".../get/session-info"', async () => {
    mockedPost.mockResolvedValue(stubResponse);
    await umcGetSessionInfo();
    expect(mockedPost.mock.lastCall[0]).toBe('/univention/get/session-info');
  });

  test('returns umc response', async () => {
    mockedPost.mockResolvedValue(stubResponse);
    const result = await umcGetSessionInfo();
    expect(result).toBe(stubUmcSessionInfo);
  });

  test('returns undefined on 401 Unauthorized response', async () => {
    mockedPost.mockRejectedValue(stubAxiosErrorSessionTimedOut);
    const result = await umcGetSessionInfo();
    expect(result).toBeUndefined();
  });

  test('throws other errors', async () => {
    mockedPost.mockRejectedValue(stubAxiosErrorInternalServerError);
    await expect(umcGetSessionInfo()).rejects.toMatchObject({
      message: 'Stub Error Internal Server Error',
    });
  });

});
