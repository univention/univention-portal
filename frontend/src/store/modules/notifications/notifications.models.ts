/*
 * Copyright 2021-2022 Univention GmbH
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

type JSONValue =
    | string
    | number
    | boolean
    | JSONObject
    | JSONArray
    | Date
    | null;

interface JSONObject {
  [x: string]: JSONValue;
}
  
interface JSONArray extends Array<JSONValue> { }

export interface Notification {
  title: string;
  description?: string;
  onClick: () => void | null;
}

export interface WeightedNotification extends Notification {
  hidingAfter: number;
  importance: string;
}

export interface FullNotification extends WeightedNotification {
  visible: boolean;
  token: number;
}

export interface ExternalNotification {
  // sourceUid: string; FIXME: may be needed for something like app that sent the notification?
  title: string;
  details: string;
  severity: string;
  sticky: boolean | null;
  needsConfirmation: boolean | null;  // FIXME: are we storing if it has been confirmed?
  notificationType: string;
  [data: string]: JSONValue;  // FIXME: may be source for errors, since Python dictionaries are not JSON objects
  // receiveTime: datetime;  FIXME: IMHO not needed
  // readTime: Optional[datetime];  FIXME: needed?
  expireTime: Date | null;

}