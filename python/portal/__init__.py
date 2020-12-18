#!/usr/bin/python2.7
#
# Univention Portal
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
#

import importlib
import os.path
from glob import glob


class Plugin(type):
	"""
	Meta class for plugins.
	"""
	def __new__(mcs, name, bases, attrs):
		new_cls = super(Plugin, mcs).__new__(mcs, name, bases, attrs)
		Plugins.add_plugin(new_cls)
		return new_cls


class Plugins(object):
	"""
	Register `Plugin` subclasses and iterate over them.
	"""

	_plugins = []
	_imported = {}

	def __init__(self, python_path):
		"""
		:param str python_path: fully dotted Python path that the plugins will
			be found below
		"""
		self.python_path = python_path
		self._imported.setdefault(python_path, False)

	@classmethod
	def add_plugin(cls, plugin):
		"""
		Called by `Plugin` meta class to register a new `Plugin` subclass.

		:param type plugin: a `Plugin` subclass
		"""
		cls._plugins.append(plugin)

	def __iter__(self):
		"""
		Iterator for registered `Plugin` subclasses.

		:return: `Plugin` subclass
		:rtype: type
		"""
		self.load()
		for plugin in self._plugins:
			if plugin.__module__.startswith(self.python_path):
				yield plugin

	def load(self):
		"""Load plugins."""
		if self._imported.get(self.python_path):
			return
		base_module = importlib.import_module(self.python_path)
		base_module_dir = os.path.dirname(base_module.__file__)
		path = os.path.join(base_module_dir, '*.py')
		for pymodule in glob(path):
			pymodule_name = os.path.basename(pymodule)[:-3]  # without .py
			importlib.import_module('{}.{}'.format(self.python_path, pymodule_name))
		self._imported[self.python_path] = True


def get_dynamic_classes(klass_name):
	for extension in Plugins('univention.portal.extensions'):
		if klass_name == extension.__name__:
			return extension
	raise KeyError(klass_name)


def make_arg(arg_definition):
	arg_type = arg_definition['type']
	if arg_type == 'static':
		return arg_definition['value']
	if arg_type == 'class':
		Klass = get_dynamic_classes(arg_definition['class'])
		args = []
		kwargs = {}
		for _arg_definition in arg_definition.get('args', []):
			args.append(make_arg(_arg_definition))
		for name, _arg_definition in arg_definition.get('kwargs', {}).items():
			kwargs[name] = make_arg(_arg_definition)
		return Klass(*args, **kwargs)
	raise TypeError('Unknown arg_definition: {!r}'.format(arg_definition))


def make_portal(portal_definition):
	return make_arg(portal_definition)
