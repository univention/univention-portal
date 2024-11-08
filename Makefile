#!/usr/bin/make -f
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# Copyright 2017-2022 Univention GmbH
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

.PRECIOUS: build build-dev

build:
	./frontend/process_vue_files.sh
	npm set prefix=$$HOME/.node
	npm install -g npm@8.1.3
	$$HOME/.node/bin/npm install -g yarn
	cd frontend && $$HOME/.node/bin/yarn install
	cd frontend && $$HOME/.node/bin/yarn build

helm-docs:
	helm-docs -c helm

l10n-extract:
	./frontend/process_vue_files.sh
	univention-l10n-build de

l10n-build:
	univention-l10n-install de
	mkdir -p ./frontend/public/i18n
	echo "{}" > ./frontend/public/i18n/en.json
	cp ./debian/univention-portal/usr/share/univention-portal/i18n/de.json ./frontend/public/i18n/de.json
