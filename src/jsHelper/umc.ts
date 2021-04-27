/*
 * Copyright 2021 Univention GmbH
 *
 * https://www.univention.de/
 *
 * All rights reserved.
 *
 * The source code of this program is made available
 * under the terms of the GNU Affero General Public License version 3
 * (GNU AGPL V3) as published by the Free Software Foundation.
 *
 * Binary versions of this program provided by Univention to you as
 * well as other copyrighted, protected or trademarked materials like
 * Logos, graphics, fonts, specific documentations and configurations,
 * cryptographic keys etc. are subject to a license agreement between
 * you and Univention and not subject to the GNU AGPL V3.
 *
 * In the case you use this program under the terms of the GNU AGPL V3,
 * the program is provided in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License with the Debian GNU/Linux or Univention distribution in file
 * /usr/share/common-licenses/AGPL-3; if not, see
 * <https://www.gnu.org/licenses/>.
 */
import axios, { AxiosResponse } from 'axios';

import { getCookie } from '@/jsHelper/tools';

function umc(path: string, options: any, flavor?: string): Promise<AxiosResponse<any>> {
  const umcSessionId = getCookie('UMCSessionId');
  const umcLang = getCookie('UMCLang');
  const headers = { 'X-Requested-With': 'XMLHttpRequest' };
  if (umcLang) {
    headers['Accept-Language'] = umcLang;
  }
  if (umcSessionId) {
    headers['X-XSRF-Protection'] = umcSessionId;
  }
  const params: any = { options };
  if (flavor) {
    params.flavor = flavor;
  }
  return axios.post(`/univention/${path}`, params, { headers });
}

function changePassword(oldPassword: string, newPassword: string): Promise<AxiosResponse<any>> {
  return umc('set', {
    password: {
      password: oldPassword,
      new_password: newPassword,
    },
  });
}

function udmPut(dn: string, attrs: any): Promise<AxiosResponse<any>> {
  return umc('command/udm/put', [{
    object: { ...attrs, $dn$: dn },
    options: null,
  }],
  'portals/all');
}

export { changePassword, umc, udmPut };
