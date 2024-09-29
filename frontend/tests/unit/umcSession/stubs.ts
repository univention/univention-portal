import { AxiosError, AxiosResponse } from 'axios';

import { UmcGetSessionInfoResponse, UmcSessionInfo } from '@/store/modules/umcSession/utils';

export type StubAxiosResponse<ResponseType> = Pick<AxiosResponse<ResponseType>, 'status' | 'data'>;

export const stubUmcSessionInfo : UmcSessionInfo = {
  username: 'stub_username',
  auth_type: 'SAML',
  remaining: 300,
};

export const stubResponse : StubAxiosResponse<UmcGetSessionInfoResponse> = {
  status: 200,
  data: {
    status: 200,
    result: stubUmcSessionInfo,
  },
};

export const stubResponseSessionTimedOut: StubAxiosResponse<UmcGetSessionInfoResponse> = {
  status: 401,
  data: {
    status: 401,
  },
};

export const stubResponseInternalServerError: StubAxiosResponse<UmcGetSessionInfoResponse> = {
  status: 500,
  data: {
    status: 500,
  },
};

export const stubAxiosErrorSessionTimedOut = new AxiosError<UmcGetSessionInfoResponse>(
  'Stub Error Session Timed Out',
  'ESTUBERRORCODE',
  undefined,
  undefined,
  stubResponseSessionTimedOut as AxiosResponse<UmcGetSessionInfoResponse>,
);

export const stubAxiosErrorInternalServerError = new AxiosError<UmcGetSessionInfoResponse>(
  'Stub Error Internal Server Error',
  'ESTUBERRORCODE',
  undefined,
  undefined,
  stubResponseInternalServerError as AxiosResponse<UmcGetSessionInfoResponse>,
);
