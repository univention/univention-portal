/*
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

// copy pasted from https://git.knut.univention.de/univention/ucs/-/blob/5.0-0/management/univention-web/js/tools.js

export function isFalse(input: any) {
  if (typeof input === 'string') {
    switch (input.toLowerCase()) {
      case 'no':
      case 'not':
      case 'false':
      case '0':
      case 'disable':
      case 'disabled':
      case 'off':
        return true;
      default:
        break;
    }
  }
  return input === false || input === 0 || input === null || input === undefined || input === '';
}

export function isTrue(input: any) {
  // ('yes', 'true', '1', 'enable', 'enabled', 'on')
  return !isFalse(input);
}
