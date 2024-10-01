/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

import { AxiosError, AxiosResponse } from 'axios';
import { JSDOM } from 'jsdom';
import { createStore } from 'vuex';

import { UmcGetSessionInfoResponse, UmcSessionInfo } from '@/store/modules/umcSession/utils';
import { UmcSessionRefreshResponse } from '@/components/globals/UmcSessionRefreshIframe.utils';
import umcSession, { UmcSessionState } from '@/store/modules/umcSession';
import { RootState } from '@/store/root.models';

export function createStubStore(initialState?: UmcSessionState) {
  const store = createStore<RootState>({
    modules: {
      umcSession: {
        ...umcSession,
        state: {
          ...umcSession.state,
          ...initialState,
        },
      },
    },
  });
  return store;
}

export type StubAxiosResponse<ResponseType> = Pick<AxiosResponse<ResponseType>, 'status' | 'data'>;

export const stubUmcSessionInfo : UmcSessionInfo = {
  username: 'stub_username',
  auth_type: 'SAML',
  remaining: 300,
};

export const stubSessionInfoResponse : StubAxiosResponse<UmcGetSessionInfoResponse> = {
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

export function stubUmcSessionRefreshData(status?: number) {
  return {
    status: status || 200,
    result: {
      username: 'default.admin',
    },
  };
}

export function stubUmcSessionRefreshIframeWithResponse(responseData: UmcSessionRefreshResponse) {
  const stubResponse = `<html><body><textarea>${JSON.stringify(responseData)}</textarea></body></html>`;
  return stubIframeWithContent(stubResponse);
}

export function stubUmcSessionRefreshIframeWithInvalidResponse(response: string) {
  const stubResponse = `<html><body><textarea>${response}</textarea></body></html>`;
  return stubIframeWithContent(stubResponse);
}

export function stubIframeWithContent(content: string) {
  const stubIframeContent = new JSDOM(content);
  const stubIframeContentDocument = stubIframeContent.window.document;

  const mockIframe = {
    contentDocument: stubIframeContentDocument,
  };
  return mockIframe;
}
