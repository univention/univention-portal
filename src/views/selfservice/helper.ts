/*
 * Copyright 2022 Univention GmbH
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

// eslint-disable-next-line import/prefer-default-export
export function sanitizeBackendWidget(widget) {
  const w: any = {
    // TODO unhandled fields that come from command/passwordreset/get_user_attributes_descriptions
    // description: ""
    // multivalue: false
    // size: "TwoThirds"
    // syntax: "TwoThirdsString"
    type: widget.type,
    name: widget.id ?? '',
    label: widget.label ?? '',
    required: widget.required ?? false,
    readonly: !(widget.editable ?? true) || (widget.readonly ?? false),
  };
  if (widget.type === 'ImageUploader') {
    w.extraLabel = w.label;
  }
  if (widget.type === 'ComboBox') {
    w.options = widget.staticValues;
  }
  if (widget.type === 'MultiInput') {
    w.extraLabel = w.label;
    w.subtypes = widget.subtypes.map((subtype) => sanitizeBackendWidget(subtype));
  }
  return w;
}
