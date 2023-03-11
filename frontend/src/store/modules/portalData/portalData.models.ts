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
import { ActionContext } from 'vuex';
import { RootState } from '../../root.models';
import { Locale } from '../locale/locale.models';

export type LocalizedString = Record<Locale, string>;

export type LinkTarget = 'newwindow' | 'samewindow' | 'embedded' | 'function';

export type LinkTargetOrDefault = 'newwindow' | 'samewindow' | 'embedded' | 'function' | 'useportaldefault';

export interface PortalImageDataBlob {
  data: string,
}

export interface Link {
  locale: string,
  link: string,
}

export interface Tile {
  id: string,
  layoutId: string,
  dn: string,
  title: LocalizedString,
  isFolder: boolean,
}

export interface BaseTile extends Tile {
  allowedGroups: string[],
  activated: boolean,
  anonymous: boolean,
  selectedGroups: string[],
  backgroundColor: string | null,
  description: LocalizedString,
  keywords: LocalizedString,
  linkTarget: LinkTarget,
  target: string | null,
  originalLinkTarget: LinkTargetOrDefault,
  links: Link[],
  pathToLogo: string,
  key: any, // TODO: no idea how to type this object :(
}

export interface FolderTile extends Tile {
  tiles: BaseTile[]
}

export type TileOrFolder = BaseTile | FolderTile;

export interface Category {
  id: string,
  layoutId: string,
  title: LocalizedString,
  dn: string,
  virtual: boolean,
  tiles: TileOrFolder[],
}

export type PortalContent = [string, string[]][];

export interface PortalEntry {
  id: string,
  dn: string,
  activated: boolean,
  allowedGroups: string[],
  anonymous: boolean,
  backgroundColor: string | null,
  description: LocalizedString,
  keywords: LocalizedString,
  linkTarget: LinkTargetOrDefault,
  target: string | null,
  links: Link[],
  // eslint-disable-next-line camelcase
  logo_name: string | null,
  name: LocalizedString,
}

export interface PortalFolder {
  id: string,
  dn: string,
  entries: string[],
  name: LocalizedString,
}

export interface PortalCategory {
  id: string,
  dn: string,
  entries: string[],
  virtual: boolean,
  // eslint-disable-next-line camelcase
  display_name: LocalizedString,
}

export type PortalAnnouncementSeverity = null | 'info' | 'warn' | 'success' | 'danger'

export type PortalAnnouncement = {
  id: string;
  dn: string;
  needsConfirmation: boolean;
  isSticky: boolean;
  severity: PortalAnnouncementSeverity;
  title: string;
  message: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface Portal {
  name: LocalizedString;
  background: PortalImageDataBlob | null;
  defaultLinkTarget: LinkTarget,
  dn: string,
  categories: string[],
  logo: PortalImageDataBlob | null,
  showUmc: boolean,
  ensureLogin: boolean,
  content: PortalContent,
}

export interface PortalBaseLayout {
  layout: string[],
  categories: { [index: string]: string[] },
  folders: { [index: string]: string[] },
}

export interface PortalLayoutEntry {
  id: string,
  dn: string,
  tiles?: PortalLayoutEntry[],
}
export interface PortalLayoutCategory extends PortalLayoutEntry {
  tiles: PortalLayoutEntry[],
}
export type PortalLayout = PortalLayoutCategory[];

export interface PortalData {
  entries: PortalEntry[],
  folders: PortalFolder[],
  categories: PortalCategory[],
  userLinks: string[],
  menuLinks: string[],
  announcements: PortalAnnouncement[],
  portal: Portal,
  baseLayout: PortalBaseLayout,
  layout: PortalLayout,
}
export interface PortalDataState {
  portal: PortalData;
  editMode: boolean;
  cacheId: string;
  errorContentType: number | null;
}

export type Position = {
  categoryIdx: null | number;
  folderIdx: null | number;
  entryIdx: null | number;
  entryType: null | 'category' | 'tile';
  contextType: null | 'root' | 'category' | 'folder';
}

export type PortalDataActionContext = ActionContext<PortalDataState, RootState>;
