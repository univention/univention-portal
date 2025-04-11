/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2025 Univention GmbH
 */

export interface NewsfeedItem {
  category: string;
  date: string;
  excerpt: string;
  title: string;
  imageSrc?: string;
  isPinned?: boolean;
  link?: string;
}

export type NewsfeedType = 'xwiki' | 'wordpress';
