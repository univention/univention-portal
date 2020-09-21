# -*- coding: utf-8 -*-
#
# Copyright 2020 Univention GmbH
#
# https://www.univention.de/
#
# All rights reserved.
#
# The source code of this program is made available
# under the terms of the GNU Affero General Public License version 3
# (GNU AGPL V3) as published by the Free Software Foundation.
#
# Binary versions of this program provided by Univention to you as
# well as other copyrighted, protected or trademarked materials like
# Logos, graphics, fonts, specific documentations and configurations,
# cryptographic keys etc. are subject to a license agreement between
# you and Univention and not subject to the GNU AGPL V3.
#
# In the case you use this program under the terms of the GNU AGPL V3,
# the program is provided in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public
# License with the Debian GNU/Linux or Univention distribution in file
# /usr/share/common-licenses/AGPL-3; if not, see
# <https://www.gnu.org/licenses/>.

import re

from univention.admin.layout import Tab, Group
import univention.admin.localization
import univention.admin.handlers

translation = univention.admin.localization.translation('univention.admin.handlers.portals')
_ = translation.translate

module = 'portals/category'
default_containers = ['cn=categories,cn=portals,cn=univention']
childs = False
operations = ['add', 'edit', 'remove', 'search']
short_description = _('Portal: Category')
object_name = _('Portal category')
object_name_plural = _('Portal categories')
long_description = _('Object under which portals/entry objects can be displayed. Belongs to (one or more) portals/portal')
options = {
	'default': univention.admin.option(
		default=True,
		objectClasses=['top', 'univentionNewPortalCategory'],
	),
}
property_descriptions = {
	'name': univention.admin.property(
		short_description=_('Internal name'),
		long_description='',
		syntax=univention.admin.syntax.string_numbers_letters_dots,
		include_in_default_search=True,
		required=True,
		may_change=False,
		identifies=True
	),
	'displayName': univention.admin.property(
		short_description=_('Display Name'),
		long_description=_('Display name of the category. At least one entry; strongly encouraged to have one for en_US'),
		syntax=univention.admin.syntax.LocalizedDisplayName,
		multivalue=True,
		required=True,
	),
	'entries': univention.admin.property(
		short_description=_('Entry'),
		long_description=_('List of Portal Entries shown in this category'),
		syntax=univention.admin.syntax.NewPortalEntries,
		multivalue=True,
		required=False,
	),
}

layout = [
	Tab(_('General'), _('Category options'), layout=[
		Group(_('Name'), layout=[
			["name"],
		]),
		Group(_('Display name'), layout=[
			["displayName"],
		]),
	]),
]


def mapTranslationValue(vals):
	return [' '.join(val) for val in vals]


def unmapTranslationValue(vals):
	return [val.split(' ', 1) for val in vals]


def mapOrdered(ldap_values):
	# ldap stores multi value fields unordered by default
	# you can change this by putting X-ORDERED 'VALUES' in your schema file
	# but then you literally get ['{0}foo', '{1}bar']
	return ['{{{}}}{}'.format(i, value) for i, value in enumerate(ldap_values)]


def unmapOrdered(udm_values):
	return [re.sub('^{\d+}', '', value) for value in udm_values]


mapping = univention.admin.mapping.mapping()
mapping.register('name', 'cn', None, univention.admin.mapping.ListToString)
mapping.register('displayName', 'univentionNewPortalCategoryDisplayName', mapTranslationValue, unmapTranslationValue)
mapping.register('entries', 'univentionNewPortalCategoryEntries', mapOrdered, unmapOrdered)


class object(univention.admin.handlers.simpleLdap):
	module = module

	def _ldap_post_remove(self):
		for portal_obj in univention.admin.modules.lookup('portals/portal', None, self.lo, filter='categories=%s' % self.dn, scope='sub'):
			portal_obj.open()
			portal_obj.categories.remove(self.dn)
			portal_obj.modify()


lookup = object.lookup
identify = object.identify
