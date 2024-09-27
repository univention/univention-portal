/*
 * Like what you see? Join us!
 * https://www.univention.com/about-us/careers/vacancies/
 *
 * Copyright 2021-2024 Univention GmbH
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
import { udmRemove, udmPut, udmAdd } from '@/jsHelper/umc';

async function add(objectType, attrs, store, errorMessage): Promise<string> {
  const response = await udmAdd(objectType, attrs);
  const result = response.data.result[0];
  if (!result.success) {
    store.dispatch('notifications/addErrorNotification', {
      title: errorMessage,
      description: result.details,
    });
    return '';
  }
  return result.$dn$;
}

async function put(dn, attrs, { dispatch }, errorMessage, successMessage?): Promise<boolean> {
  const response = await udmPut(dn, attrs);
  const result = response.data.result[0];
  if (!result.success) {
    dispatch('notifications/addErrorNotification', {
      title: errorMessage,
      description: result.details,
    }, { root: true });
    return false;
  }
  if (successMessage) {
    dispatch('notifications/addSuccessNotification', {
      title: successMessage,
    }, { root: true });
  }
  await dispatch('portalData/waitForChange', {
    retries: 10,
    adminMode: true,
  }, { root: true });
  await dispatch('loadPortal', { adminMode: true }, { root: true });
  return true;
}

async function remove(dn, { dispatch }, successMessage, errorMessage) {
  const response = await udmRemove(dn);
  const result = response.data.result[0];
  if (!result.success) {
    dispatch('notifications/addErrorNotification', {
      title: errorMessage,
      description: result.details,
    }, { root: true });
    return false;
  }
  dispatch('notifications/addSuccessNotification', {
    title: successMessage,
  }, { root: true });
  await dispatch('portalData/waitForChange', {
    retries: 10,
    adminMode: true,
  }, { root: true });
  await dispatch('loadPortal', { adminMode: true }, { root: true });
  return true;
}

// edit mode default settings
function getAdminState() {
  return process.env.VUE_APP_LOCAL ? (!!localStorage.getItem('UCSAdmin') || false) : false;
}

async function addEntryToSuperObj(superDn, superObjs, dn, { dispatch, getters }, successMessage, errorMessage) {
  const portalDn = getters['portalData/getPortalDn'];
  let actualSuperDn = superDn;
  let attrName = 'entries';
  let links: string[] = [];
  if (superDn === '$$user$$') {
    actualSuperDn = portalDn;
    attrName = 'userLinks';
    links = getters['portalData/userLinks'];
  } else if (superDn === '$$menu$$') {
    actualSuperDn = portalDn;
    attrName = 'menuLinks';
    links = getters['portalData/menuLinks'];
  } else {
    const superObj = superObjs.find((obj) => obj.dn === superDn);
    links = superObj.entries;
  }
  const attrs = {
    [attrName]: links.concat([dn]),
  };
  return put(actualSuperDn, attrs, { dispatch }, errorMessage, successMessage);
}

async function removeEntryFromSuperObj(superDn, superObjs, dn, { dispatch, getters }, successMessage, errorMessage) {
  const portalDn = getters['portalData/getPortalDn'];
  let actualSuperDn = superDn;
  let attrName = 'entries';
  let links = [];
  if (superDn === '$$user$$') {
    actualSuperDn = portalDn;
    attrName = 'userLinks';
    links = getters['portalData/userLinks'];
  } else if (superDn === '$$menu$$') {
    actualSuperDn = portalDn;
    attrName = 'menuLinks';
    links = getters['portalData/menuLinks'];
  } else {
    const superObj = superObjs.find((obj) => obj.dn === superDn);
    links = superObj.entries;
  }
  const attrs = {
    [attrName]: links.filter((entryDn) => entryDn !== dn),
  };
  return put(actualSuperDn, attrs, { dispatch }, errorMessage, successMessage);
}

export { put, add, remove, getAdminState, removeEntryFromSuperObj, addEntryToSuperObj };
