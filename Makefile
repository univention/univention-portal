#!/usr/bin/make -f
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2017-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only

.PRECIOUS: build build-dev

.PHONY: build
build:
	./frontend/process_vue_files.sh
	npm set prefix=$$HOME/.node
	npm install -g npm@8.1.3
	$$HOME/.node/bin/npm install -g yarn
	cd frontend && $$HOME/.node/bin/yarn install
	cd frontend && $$HOME/.node/bin/yarn build

.PHONY: helm-docs
helm-docs:
	helm-docs -c helm

.PHONY: helm-dependencies
helm-dependencies:
	find ./helm -depth 2 -name Chart.yaml -execdir helm dependency update ";"

.PHONY: l10n-extract
l10n-extract:
	./frontend/process_vue_files.sh
	univention-l10n-build de

.PHONY: l10n-build
l10n-build:
	univention-l10n-install de
	mkdir -p ./frontend/public/i18n
	echo "{}" > ./frontend/public/i18n/en.json
	cp ./debian/univention-portal/usr/share/univention-portal/i18n/de.json ./frontend/public/i18n/de.json
