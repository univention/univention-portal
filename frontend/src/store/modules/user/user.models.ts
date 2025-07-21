/*
 * Like what you see? Join us!
 * https://www.univention.com/about-us/careers/vacancies/
 *
 * SPDX-FileCopyrightText: 2021-2025 Univention GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface User {
    username: string;
    displayName: string;
    mayEditPortal: boolean;
    authMode: string;
    firstname?: string;
    lastname?: string;
    jpegPhoto?: string;
}

export interface UserWrapper {
    user: User
}
