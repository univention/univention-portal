/*
 * Like what you see? Join us!
 * https://www.univention.com/about-us/careers/vacancies/
 *
 * SPDX-FileCopyrightText: 2021-2025 Univention GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import axios, { AxiosResponse } from 'axios';

import { getCookie } from '@/jsHelper/tools';

interface Choice {
  id: string,
  label: string,
}

function getSessionId(port: string, getCookieFunction: (name: string) => string | undefined): string | undefined {
  return getCookieFunction(`UMCSessionId-${port}`) || getCookieFunction('UMCSessionId');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function umc<UmcResponseType = any>(
  path: string,
  options?: any,
  flavor?: string,
): Promise<AxiosResponse<UmcResponseType>> {
  const umcSessionId = getSessionId(document.location.port, getCookie);
  const umcLang = getCookie('UMCLang');
  const headers = { 'X-Requested-With': 'XMLHttpRequest' };
  if (umcLang) {
    headers['Accept-Language'] = umcLang;
  }
  if (umcSessionId) {
    headers['X-XSRF-Protection'] = umcSessionId;
  }
  const params: any = { options: options || {} };
  if (flavor) {
    params.flavor = flavor;
  }
  return axios.post<UmcResponseType>(`/univention/${path}`, params, { headers });
}

function umcCommand(path: string, options?: any, flavor?: string): Promise<any> {
  return umc(`command/${path}`, options, flavor)
    .then((answer) => answer.data.result)
    .catch((error) => {
      if ('response' in error && 'data' in error.response) {
        throw error.response.data;
      }
      console.error(error);
      throw new Error('Unknown error');
    });
}

function umcCommandWithStandby(store, path: string, options?: any, flavor?: string): Promise<any> {
  store.dispatch('activateLoadingState');
  return umcCommand(path, options, flavor)
    .finally(() => {
      store.dispatch('deactivateLoadingState');
    });
}

function changePassword(oldPassword: string, newPassword: string): Promise<any> {
  return umc('set/password', {
    password: {
      password: oldPassword,
      new_password: newPassword,
    },
  }).then((answer) => answer.data)
    .catch((error) => {
      if ('response' in error && 'data' in error.response) {
        throw error.response.data;
      }
      console.error(error);
      throw new Error('Unknown error');
    });
}

function udmRemove(dn: string): Promise<AxiosResponse<any>> {
  return umc('command/udm/remove', [{
    object: dn,
    options: {
      cleanup: true,
      recursive: true,
    },
  }], 'portals/all');
}

function udmPut(dn: string, attrs: any): Promise<AxiosResponse<any>> {
  return umc('command/udm/put', [{
    object: { ...attrs, $dn$: dn },
    options: null,
  }], 'portals/all');
}

function udmAdd(objectType: string, attrs: any): Promise<AxiosResponse<any>> {
  return umc('command/udm/add', [{
    object: { ...attrs },
    options: { objectType },
  }], 'portals/all');
}

function udmChoices(objectType: string, syntax: string, searchString: string): Promise<AxiosResponse<any>> {
  return umc('command/udm/syntax/choices', {
    container: 'all',
    hidden: false,
    objectProperty: 'None',
    objectPropertyValue: searchString,
    objectType,
    syntax,
  }, 'portals/all');
}

export { changePassword, getSessionId, umc, umcCommand, umcCommandWithStandby, udmPut, udmAdd, udmRemove, udmChoices, Choice };
