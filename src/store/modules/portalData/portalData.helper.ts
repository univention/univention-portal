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
import vm from '@/main';
import _ from '@/jsHelper/translate';
import { Position } from '@/store/modules/portalData/portalData.models';

export default function setScreenReaderAccouncement(fromPosition: Position, toPosition: Position, getPortalLayout, setMessage): void {
  const categoryPositionBefore = fromPosition.categoryIdx;
  const categoryPositionAfter = toPosition.categoryIdx;
  const tilePositionBefore = fromPosition.entryIdx;
  const tilePositionAfter = toPosition.entryIdx;
  if (categoryPositionBefore && (tilePositionBefore !== null) && (tilePositionAfter !== null) && (categoryPositionAfter !== null)) {
    const titleOfMovedElement = getPortalLayout[categoryPositionBefore].tiles[tilePositionBefore]?.title;
    const numberOfTiles = getPortalLayout[categoryPositionAfter].tiles.length;
    const positionInNewArray = tilePositionAfter + 1;
    const titleOfCategory = getPortalLayout[categoryPositionAfter].title;

    if (fromPosition.categoryIdx !== toPosition.categoryIdx) {
      setMessage(_(`Moving ${vm.$localized(titleOfMovedElement)} into category ${vm.$localized(titleOfCategory)}`));
    } else if (fromPosition.contextType === 'category') {
      setMessage(_(`Moving ${vm.$localized(titleOfMovedElement)} into position ${positionInNewArray} of ${numberOfTiles}`));
    } else if (fromPosition.contextType === 'folder') {
      const folderIndex = fromPosition.folderIdx ? fromPosition.folderIdx : -1;
      const tileTitle = vm.$localized(getPortalLayout[categoryPositionBefore].tiles[folderIndex].tiles[tilePositionBefore].title);
      const folderTitle = vm.$localized(getPortalLayout[categoryPositionBefore].tiles[folderIndex].title);
      const numberOfTilesInFolder = getPortalLayout[categoryPositionBefore].tiles[folderIndex].tiles.length;
      setMessage(_(`Moving ${tileTitle} in Folder ${folderTitle} into position ${positionInNewArray} of ${numberOfTilesInFolder}`));
    }
  }
  if (fromPosition.contextType === 'root') {
    if (fromPosition.entryIdx && toPosition.entryIdx) {
      const movedCategory = fromPosition.entryIdx;
      const movedCategoryTitle = vm.$localized(getPortalLayout[movedCategory].title);
      const newCategoryPosition = toPosition.entryIdx - 2;
      const numberOfCategories = getPortalLayout.filter((category) => (!category.dn.includes('$$menu$$') && !category.dn.includes('$$user$$') && !category.dn.includes('cn=new'))).length;
      setMessage(_(`Moving ${movedCategoryTitle} to position ${newCategoryPosition} of ${numberOfCategories}`));
    }
  }
}
