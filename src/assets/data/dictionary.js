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
import { ref } from 'vue';

function _(msg) {
  return {
    original: msg,
    translated: ref(msg),
  };
}

const catalog = {
  PORTAL_MENU: _('Portal Menu'),
  USER_MENU: _('User Menu'),
  NOTIFICATIONS: _('Notifications'),
  LOGIN: _('Login'),
  LOGOUT: _('Logout'),
  EDIT_PORTAL: _('Edit portal'),
  OPEN_EDIT_SIDEBAR: _('Open edit sidebar'),
  STOP_EDIT_PORTAL: _('Stop edit portal'),
  SWITCH_LOCALE: _('Switch locale'),
  COOKIE_SETTINGS: _('Cookie Settings'),
  ACCEPT: _('Accept'),
  SUBMIT: _('Submit'),
  DISMISS_NOTIFICATION: _('Dismiss notification'),
  CONFIRM_REMOVE: _('Do you really want to remove this object? You can completely delete it, or just remove the link to the object here, so that you can still use it somewhere else.'),
  ADD_CATEGORY: _('Add category'),
  EDIT_CATEGORY: _('Edit category'),
  ADD_EXISTING_CATEGORY: _('Add existing category'),
  ADD_ENTRY: _('Add entry'),
  EDIT_ENTRY: _('Edit entry'),
  CREATE_ENTRY: _('Create new entry'),
  ADD_EXISTING_ENTRY: _('Add existing entry'),
  ADD_EXISTING_FOLDER: _('Add existing folder'),
  ADD_NEW_ENTRY: _('Add new entry'),
  ADD_NEW_CATEGORY: _('Add new category'),
  ADD_FOLDER: _('Add folder'),
  ADD: _('Add'),
  EDIT_FOLDER: _('Edit folder'),
  CREATE_FOLDER: _('Create new folder'),
  CANCEL: _('Cancel'),
  SAVE: _('Save'),
  REMOVE_HERE: _('Remove here'),
  INTERNAL_NAME: _('Internal name'),
  DISPLAY_NAME: _('Display name'),
  NAME: _('Name'),
  LANGUAGE_CODE: _('Language code (e.g. en_US)'),
  MODAL_HINT_CATEGORIES: _('Display name of the category. At least one entry; strongly encouraged to have one for en_US'),
  COOKIE_TITLE: _('Cookie Settings'),
  COOKIE_TEXT: _('We use cookies in order to provide you with certain functions and to be able to guarantee an unrestricted service. By clicking on "Accept", you consent to the collection of information on this portal.'),
  OLD_PASSWORD: _('Old password'),
  NEW_PASSWORD: _('New password'),
  RETYPE: _('retype'),
  ENTRY_ORDER_SUCCESS: _('Entries successfully re-sorted'),
  ENTRY_ORDER_FAILURE: _('Entries could not be re-sorted'),
  ENTRY_CREATED_SUCCESS: _('Entry successfully created'),
  ENTRY_CREATED_FAILURE: _('Entry could not be created'),
  ENTRY_MODIFIED_SUCCESS: _('Entry successfully modified'),
  ENTRY_MODIFIED_FAILURE: _('Entry could not be modified'),
  ENTRY_ADDED_SUCCESS: _('Entry successfully added'),
  ENTRY_ADDED_FAILURE: _('Entry could not be added'),
  ENTRY_REMOVED_SUCCESS: _('Entry successfully removed'),
  ENTRY_REMOVED_FAILURE: _('Entry could not be removed'),
  FOLDER_CREATED_SUCCESS: _('Folder successfully created'),
  FOLDER_CREATED_FAILURE: _('Folder could not be created'),
  FOLDER_MODIFIED_SUCCESS: _('Folder successfully modified'),
  FOLDER_MODIFIED_FAILURE: _('Folder could not be modified'),
  FOLDER_ADDED_SUCCESS: _('Folder successfully added'),
  FOLDER_ADDED_FAILURE: _('Folder could not be added'),
  FOLDER_REMOVED_SUCCESS: _('Folder successfully removed'),
  FOLDER_REMOVED_FAILURE: _('Folder could not be removed'),
  CATEGORY_ORDER_SUCCESS: _('Categories successfully re-sorted'),
  CATEGORY_ORDER_FAILURE: _('Categories could not be re-sorted'),
  CATEGORY_CREATED_SUCCESS: _('Category successfully created'),
  CATEGORY_CREATED_FAILURE: _('Category could not be created'),
  CATEGORY_MODIFIED_SUCCESS: _('Category successfully modified'),
  CATEGORY_MODIFIED_FAILURE: _('Category could not be modified'),
  CATEGORY_ADDED_SUCCESS: _('Category successfully added'),
  CATEGORY_ADDED_FAILURE: _('Category could not be added'),
  CATEGORY_REMOVED_SUCCESS: _('Category successfully removed'),
  CATEGORY_REMOVED_FAILURE: _('Category could not be removed'),
  CHANGE_PASSWORD: _('Change password'),
  CHANGE_PASSWORD_SUCCESS: _('You have successfully updated your password'),
  BACK: _('Back'),
  NEXT: _('Next'),
  DELETE: _('Delete'),
  REMOVE: _('Remove'),
  ACTIVATED: _('Activated'),
  ADD: _('Add'),
  ADD_OBJECTS: _('Add objects'),
  UPLOAD: _('Upload'),
  RESTRICT_VISIBILITY_TO_GROUPS: _('Restrict visibility to groups'),
  MODAL_HINT_RESTRICT_VISIBILITY: _('If one or more groups are selected then the portal entry will only be visible to logged in users that are in any of the selected groups. If no groups are selected then the portal entry is always visible.'),
  SELECT_ALL: _('Select all'),
  SELECT_FILE: _('Select file'),
  PORTAL_LOGO: _('Portal logo'),
  BACKGROUND: _('Background'),
  BACKGROUND_COLOR: _('Background color'),
  ANONYMOUS: _('Only visible if not logged in'),
  MODAL_HINT_HEADLINE: _('Headline of the entry. At least one entry; strongly encouraged to have one for en_US'),
  LINK: _('Link'),
  LINKS: _('Links'),
  NEW_ENTRY: _('Create a new Entry'),
  NEW_FOLDER: _('Create a new folder'),
  MODAL_HINT_DESCRIPTION: _('Description of the entry. At least one entry; strongly encouraged to have one for en_US'),
  DESCRIPTION: _('Description'),
  SHOW_PORTAL: _('Show portal'),
  EDIT_MODE: _('Edit mode'),
  SEARCH: _('search'),
  NOTIFCATIONS: _('Notifications'),
  MENU: _('Menu'),
  TABS: _('Tabs'),
  CHOOSE_TAB: _('Choose a tab'),
  SELECT_TAB: _('Select'),
  CLOSE_TAB: _('Close'),
  PRESS_ENTER_TO_FOCUS: _('To focus press Enter'),
  SHOW_UMC: _('Show local UMC modules'),
  ENSURE_LOGIN: _('Users are required to login'),
  LINK_TARGET: _('Way of opening links'),
  DEFAULT_LINK_TARGET: _('Default link behaviour for portal entries'),
  PORTAL_DEFAULT: _('Use default of portal'),
  EMBEDDED: _('Embedded'),
  SAME_WINDOW: _('Same tab'),
  NEW_WINDOW: _('New tab'),
  NO_RESULTS: _('No search results'),
  ERROR_ON_VALIDATION: _('The form data is not valid'),
  ERROR_WRONG_NAME: _('Internal name must not contain anything other than digits, letters or dots, must be at least 2 characters long, and start and end with a digit or letter!'),
  ERROR_ENTER_NAME: _('Please enter an internal name'),
  ERROR_ENTER_TITLE: _('Please enter a display name'),
  ERROR_ENTER_DESCRIPTION: _('Please enter a description'),
  ERROR_ENTER_LINK: _('Please enter at least one English link'),
  FOLDER: _('Folder'),
  SHOW_TOOLTIP_BY_TOUCH: _('Show tooltip'),
  EDIT_TILE: _('Edit tile'),
  ADD_NEW_TILE: _('Add new Tile'),
  DEFAULT_NOTIFICATION: _('Info'),
  WARNING: _('Warning'),
  SUCCESS: _('Success'),
  ERROR: _('Error'),
  ITEM: _('Item'),
  ITEMS: _('Items'),
  NO_ITEMS: _('No items'),
  GO_BACK: _('Go Back'),
  REMOVE_ALL_NOTIFICATIONS: _('Remove all notifications'),
};

export { catalog };
