import axios, { AxiosResponse } from 'axios';

import { umcGetSessionInfo, UmcGetSessionInfoResponse, UmcSessionInfo } from '@/store/modules/umcSession/utils';

jest.mock('axios');

afterEach(() => {
  jest.resetAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

const mockedPost = jest.mocked(axios.post);

type StubAxiosResponse<ResponseType> = Pick<AxiosResponse<ResponseType>, "status" | "data">;

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

describe('umcGetSessionInfo', () => {

  test('triggers POST request to ".../get/session-info"', async () => {
    mockedPost.mockResolvedValue(stubResponse);
    const result = await umcGetSessionInfo();
    expect(mockedPost.mock.lastCall[0]).toBe('/univention/get/session-info');
  });

  test('returns umc response', async () => {
    mockedPost.mockResolvedValue(stubResponse);
    const result = await umcGetSessionInfo();
    expect(result).toBe(stubUmcSessionInfo);
  });

});
