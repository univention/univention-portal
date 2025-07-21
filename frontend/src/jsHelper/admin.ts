/*
 * Like what you see? Join us!
 * https://www.univention.com/about-us/careers/vacancies/
 *
 * SPDX-FileCopyrightText: 2021-2025 Univention GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
