/*
 * Like what you see? Join us!
 * https://www.univention.com/about-us/careers/vacancies/
 *
 * SPDX-FileCopyrightText: 2021-2025 Univention GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface NotificationLink {
  url: URL
  text: string
  target: string
}

export interface Notification {
  title: string;
  description?: string;
  onClick: () => void | null;
  link?: NotificationLink;
  expireAt: Date | undefined,
}

export interface WeightedNotification extends Notification {
  hidingAfter: number;
  importance: string;
}

export interface FullNotification extends WeightedNotification {
  visible: boolean;
  token: string;
  isBackendNotification?: boolean;
}
