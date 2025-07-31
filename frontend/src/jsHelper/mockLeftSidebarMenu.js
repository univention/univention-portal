/*
 * Copyright 2021-2024 Univention GmbH
 * Mock data for left sidebar application launcher
 */

// Simple ID generator for mock data
const generateId = () => `menu-item-${Math.random().toString(36)
  .substr(2, 9)}`;

export const mockLeftSidebarMenu = [
  {
    icon_url: './data/icons/owncloud-admindoc.svg',
    keywords: {},
    linkTarget: 'useportaldefault',
    links: [
      {
        locale: 'en_US',
        value: 'https://doc.owncloud.com/server/10.0/admin_manual/',
      },
      {
        locale: 'de_DE',
        value: 'https://doc.owncloud.com/server/10.0/admin_manual/',
      },
    ],
    name: {
      de_DE: 'Admin Handbuch',
      en_US: 'Admin Handbook',
    },
    target: 'docs',
  },
  {
    icon_url: './data/icons/owncloud-admindoc.svg',
    keywords: {},
    linkTarget: 'useportaldefault',
    links: [
      {
        locale: 'en_US',
        value: 'https://doc.owncloud.com/server/10.0/admin_manual/',
      },
      {
        locale: 'de_DE',
        value: 'https://doc.owncloud.com/server/10.0/admin_manual/',
      },
    ],
    name: {
      de_DE: 'Admin Handbuch',
      en_US: 'Admin Handbook',
    },
    target: 'docs',
  },
  {
    icon_url: './data/icons/owncloud-admindoc.svg',
    keywords: {},
    linkTarget: 'useportaldefault',
    links: [
      {
        locale: 'en_US',
        value: 'https://doc.owncloud.com/server/10.0/admin_manual/',
      },
      {
        locale: 'de_DE',
        value: 'https://doc.owncloud.com/server/10.0/admin_manual/',
      },
    ],
    name: {
      de_DE: 'Kalender',
      en_US: 'Calendar',
    },
    target: 'docs',
  },
];

export default mockLeftSidebarMenu;
