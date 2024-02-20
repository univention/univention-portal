# Changelog

## [0.19.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.19.0...v0.19.1) (2024-02-20)


### Bug Fixes

* **listener:** wait for object-storage to be provisioned ([a2e2508](https://git.knut.univention.de/univention/components/univention-portal/commit/a2e25083a41e2b1303350db3b68fa0b523888231))

## [0.19.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.18.0...v0.19.0) (2024-02-16)


### Features

* **portal:** make use of UDM backend client configurable ([c755551](https://git.knut.univention.de/univention/components/univention-portal/commit/c7555514c336d50c3ef6232f196e9adef1d728ee))

## [0.18.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.17.0...v0.18.0) (2024-02-16)


### Features

* **announcements:** Remove needsConfirmation from layout ([db47d1c](https://git.knut.univention.de/univention/components/univention-portal/commit/db47d1cf79e4e5584be936d3d35b35e73f292baf)), closes [#55175](https://git.knut.univention.de/univention/components/univention-portal/issues/55175)

## [0.17.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.16.1...v0.17.0) (2024-02-16)


### Features

* **announcements:** Adjust style for Announcement.vue ([16f8f2f](https://git.knut.univention.de/univention/components/univention-portal/commit/16f8f2ff3f23bf48b13f47fbc396b7f3b00c293b)), closes [#55175](https://git.knut.univention.de/univention/components/univention-portal/issues/55175)

## [0.16.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.16.0...v0.16.1) (2024-02-16)


### Bug Fixes

* **server:** missing default value ([7b68802](https://git.knut.univention.de/univention/components/univention-portal/commit/7b688026b4160ad7cda2acfa634442700f086a00))

## [0.16.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.15.1...v0.16.0) (2024-02-16)


### Features

* remove phoenix references ([736d5f5](https://git.knut.univention.de/univention/components/univention-portal/commit/736d5f583efd853201451ab0b1eaf60560f65604))

## [0.15.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.15.0...v0.15.1) (2024-02-16)


### Bug Fixes

* **self-service:** fix label translation for self-service fields ([07ded1f](https://git.knut.univention.de/univention/components/univention-portal/commit/07ded1fc405a531f7dc0d2f91ad9c398513eea93)), closes [#56660](https://git.knut.univention.de/univention/components/univention-portal/issues/56660)

## [0.15.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.14.1...v0.15.0) (2024-02-15)


### Features

* **udm:** set superordinate of UDM portal modules ([9c78924](https://git.knut.univention.de/univention/components/univention-portal/commit/9c789248e4b35750c50a3db65a411ba4c9542c41))

## [0.14.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.14.0...v0.14.1) (2024-02-15)


### Bug Fixes

* **self-service:** The deletion of a user's profile picture via self-service has been repaired ([0e361ab](https://git.knut.univention.de/univention/components/univention-portal/commit/0e361ab5f96dc5cf4f3b9cc7f8e113dde4a1515f)), closes [#56349](https://git.knut.univention.de/univention/components/univention-portal/issues/56349)

## [0.14.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.13.1...v0.14.0) (2024-02-15)


### Features

* drop kubernetes deployment, config and service files ([3d9e3a3](https://git.knut.univention.de/univention/components/univention-portal/commit/3d9e3a30a69ec64ce38fe58e8e561dee2db007b6))
* **listener:** Support object storage reloader ([e21664a](https://git.knut.univention.de/univention/components/univention-portal/commit/e21664a4cec0be8a7a3a4c0525737ec4e887c82b))
* **listener:** Wait for object-storage ([487ea0b](https://git.knut.univention.de/univention/components/univention-portal/commit/487ea0b50b3c3fb4e47f33cc93b52821e69dd605))
* **server:** Support object storage cache ([4923141](https://git.knut.univention.de/univention/components/univention-portal/commit/492314119ab0ec7d42d1236206934312e2b5110e))


### Bug Fixes

* **server:** object storage cache test coverage ([a2af8ba](https://git.knut.univention.de/univention/components/univention-portal/commit/a2af8bac737de07e469c550ab1f00ba876ee158e))
* **server:** object storage reloader test coverage ([52098f6](https://git.knut.univention.de/univention/components/univention-portal/commit/52098f6c98353d390d7f651de81bf17f0b4022ab))

## [0.13.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.13.0...v0.13.1) (2024-02-13)


### Bug Fixes

* **portal:** HTTPS detection when acessing navigation.json endpoint behind UCS apache reverse proxy ([f15703e](https://git.knut.univention.de/univention/components/univention-portal/commit/f15703eb18a2c7350a698f18bb57fe2a36c001a7)), closes [#55785](https://git.knut.univention.de/univention/components/univention-portal/issues/55785)

## [0.13.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.12.0...v0.13.0) (2024-02-09)


### Features

* **portal:** make HTML title and favicon configurable ([5a4eb0f](https://git.knut.univention.de/univention/components/univention-portal/commit/5a4eb0f40b15aad32d84d1d82397746122ed5a04)), closes [#56917](https://git.knut.univention.de/univention/components/univention-portal/issues/56917)

## [0.12.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.11.1...v0.12.0) (2024-02-09)


### Features

* **portal:** Show cookie banner only if configured for current domain ([226334b](https://git.knut.univention.de/univention/components/univention-portal/commit/226334b7bf7b1c60447165599ae0971e136024d7)), closes [#55164](https://git.knut.univention.de/univention/components/univention-portal/issues/55164)

## [0.11.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.11.0...v0.11.1) (2024-02-09)


### Bug Fixes

* **portal:** Update file portals.json atomically ([4f96aa0](https://git.knut.univention.de/univention/components/univention-portal/commit/4f96aa0114d7d703672992b1bc226fa53f4ca15f)), closes [#53860](https://git.knut.univention.de/univention/components/univention-portal/issues/53860)

## [0.11.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.10.0...v0.11.0) (2024-02-09)


### Features

* **ci:** add debian update check jobs for scheduled pipeline ([7e7c798](https://git.knut.univention.de/univention/components/univention-portal/commit/7e7c79815faaf718a6cca033a844ef42fd1a711b))

## [0.10.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.9.5...v0.10.0) (2024-01-22)


### Features

* **notifications-api:** Keep the bundled Postgresql on 12.7.* ([bb64774](https://git.knut.univention.de/univention/components/univention-portal/commit/bb6477491bb75acc7e2d0e070d2e8ce605620276))
* **portal-frontend:** Do not define resources by default ([59e729e](https://git.knut.univention.de/univention/components/univention-portal/commit/59e729e88323128a70dc533cc025af74598b6294))
* **portal-frontend:** Reduce the default probe delays in the portal-frontend ([fcbfe16](https://git.knut.univention.de/univention/components/univention-portal/commit/fcbfe16abdc2b29dadbf008f6eeaf8ce50e398cb))
* **portal-listener:** Use "cn=admin" as default for "udmApiUsername" ([6fc7a69](https://git.knut.univention.de/univention/components/univention-portal/commit/6fc7a694454401945f0d735615cd13e672e0ce14))
* **portal-listener:** Use "portal-listener" as the default user name for store-dav ([3711b79](https://git.knut.univention.de/univention/components/univention-portal/commit/3711b79905d9bc46110dc963b6fffdeefdd83fec))


### Bug Fixes

* **notifications-api:** Avoid setting default values for passwords ([8572cb7](https://git.knut.univention.de/univention/components/univention-portal/commit/8572cb70c0b7d3ca09c130935f155a5baf652965))
* **notifications-api:** Use the knut registry by default ([6509c49](https://git.knut.univention.de/univention/components/univention-portal/commit/6509c49ddc4aefe3ec0e97bb1424fb91f12e6869))
* **portal-frontend:** Use the image out of the knut registry ([899daf1](https://git.knut.univention.de/univention/components/univention-portal/commit/899daf126a7314689719235bc5b83c491d9cd583))
* **portal-listener:** Bring linter_values closer to typical values of the dev-env ([fb47d92](https://git.knut.univention.de/univention/components/univention-portal/commit/fb47d92afccb8392237fe972959f50670d1516c1))
* **portal-listener:** Do not bundle store-dav in linter_values ([ab89c81](https://git.knut.univention.de/univention/components/univention-portal/commit/ab89c817eb48482b32e697c5560ce70eba652dc9))
* **portal-listener:** Flag parameter ldapSecret as required ([acd6e7d](https://git.knut.univention.de/univention/components/univention-portal/commit/acd6e7d77ec3ddef70040ca46815cddb12022346))
* **portal-server:** Do not define resources be default ([5371336](https://git.knut.univention.de/univention/components/univention-portal/commit/5371336746e5eb969bde32da61a3c3eb8838fe19))
* **portal-server:** Use knut registry by default as image source. ([ba36660](https://git.knut.univention.de/univention/components/univention-portal/commit/ba36660b90cb7cd33d6a18e08973523813c4676d))

## [0.9.5](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.9.4...v0.9.5) (2024-01-15)


### Bug Fixes

* **deps:** add renovate.json ([45d94ca](https://git.knut.univention.de/univention/components/univention-portal/commit/45d94ca5a1a5e7df6bbf95e11737c25799e80a5f))

## [0.9.4](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.9.3...v0.9.4) (2023-12-28)


### Bug Fixes

* **licensing/ci:** add spdx license headers, add license header checking pre-commit ([857dcaf](https://git.knut.univention.de/univention/components/univention-portal/commit/857dcaf36bdccd58776cb9690e43f519952b8e3e))

## [0.9.3](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.9.2...v0.9.3) (2023-12-21)


### Bug Fixes

* **docker:** update ucs-base from 5.0-5 to 5.0-6 ([f42efc8](https://git.knut.univention.de/univention/components/univention-portal/commit/f42efc8d38c0c6f499cb50e08b137cedfdb2f998))

## [0.9.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.9.1...v0.9.2) (2023-12-18)


### Bug Fixes

* **ci:** add Helm chart signing and publishing to souvap via OCI, common-ci 1.12.x ([a746874](https://git.knut.univention.de/univention/components/univention-portal/commit/a74687465f709acb0402208fa03cae32342f835c))

## [0.9.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.9.0...v0.9.1) (2023-12-07)


### Bug Fixes

* **frontend:** Upgrade Nginx base image to 0.1.1 ([d580543](https://git.knut.univention.de/univention/components/univention-portal/commit/d580543027de6d3aa46b62dcec299203f2f14b02))

## [0.9.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.8.0...v0.9.0) (2023-12-06)


### Features

* **frontend:** serve from ums-nginx ([b0a1792](https://git.knut.univention.de/univention/components/univention-portal/commit/b0a17923a9f35f57f067787e0439f17207ccde85))

## [0.8.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.7.0...v0.8.0) (2023-12-05)


### Features

* Add support for "enable_xheaders" ([ce64258](https://git.knut.univention.de/univention/components/univention-portal/commit/ce64258491e8b0e2bf38e8455056358ed16b2ba0))

## [0.7.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.6.1...v0.7.0) (2023-12-05)


### Features

* **wait-for-dependency:** migrate to ucs-base ([4e31194](https://git.knut.univention.de/univention/components/univention-portal/commit/4e31194aeca292ec40d4a62c07b3019934f63ba9))

## [0.6.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.6.0...v0.6.1) (2023-12-04)


### Bug Fixes

* trigger re-release ([dfe50b6](https://git.knut.univention.de/univention/components/univention-portal/commit/dfe50b6007690853920c12e47ab61e21c2342575))

## [0.6.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.5.2...v0.6.0) (2023-11-30)


### Features

* **listener:** add selfservice portal ([13f3dc2](https://git.knut.univention.de/univention/components/univention-portal/commit/13f3dc2dd36763eefeea754bc25e5a150373374b))


### Bug Fixes

* **helm:** handle `/univention/selfservice` portal ([6d130a3](https://git.knut.univention.de/univention/components/univention-portal/commit/6d130a3e55ba0b1d7d367c8606b17e001d4cb802))

## [0.5.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.5.1...v0.5.2) (2023-11-28)


### Bug Fixes

* **portal-server:** filter urls for passwords before logging them ([6be8298](https://git.knut.univention.de/univention/components/univention-portal/commit/6be8298da0f9bf5cf32b929a0c93d0f00f8ae32f))

## [0.5.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.5.0...v0.5.1) (2023-11-23)


### Bug Fixes

* **frondent:** Ignore Dockerfile ([dd3e4e0](https://git.knut.univention.de/univention/components/univention-portal/commit/dd3e4e0ffb3f918d4e6d82e25d17f0a20dd80ccc))
* **frontend:** Logging to stdout / stderr enabled again ([0cf8c41](https://git.knut.univention.de/univention/components/univention-portal/commit/0cf8c41cef68ecd74060a6bef9fbbd734dca761a))

## [0.5.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.4.4...v0.5.0) (2023-11-22)


### Features

* **frontend:** Add extraVolumes support into Helm chart ([bb076c1](https://git.knut.univention.de/univention/components/univention-portal/commit/bb076c18037731288be2a67d3dc7bbea3643af6d))

## [0.4.4](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.4.3...v0.4.4) (2023-11-14)


### Bug Fixes

* **frontend:** Add announcements styles ([3a1ffee](https://git.knut.univention.de/univention/components/univention-portal/commit/3a1ffee1eeaf05a5c2afd0ad3d11a566959d3760))

## [0.4.3](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.4.2...v0.4.3) (2023-11-10)


### Bug Fixes

* **portal-server:** Always create secret ([ec0691b](https://git.knut.univention.de/univention/components/univention-portal/commit/ec0691bef9c9260231094c19771b1d7212cc2ebc))

## [0.4.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.4.1...v0.4.2) (2023-11-09)


### Bug Fixes

* **portal-listener:** Don't fail if central navigation is undefined ([9b386f3](https://git.knut.univention.de/univention/components/univention-portal/commit/9b386f38824cc34014d7144b7528a09cc14db24a))

## [0.4.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.4.0...v0.4.1) (2023-11-09)


### Bug Fixes

* **portal-server:** make central navigation secret optional ([5ea3003](https://git.knut.univention.de/univention/components/univention-portal/commit/5ea3003001a90f0525413c6161b198564035234e))

## [0.4.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.3.5...v0.4.0) (2023-11-09)


### Features

* **portal-server:** make central navigation configurable in the containerized stack ([336350c](https://git.knut.univention.de/univention/components/univention-portal/commit/336350ce8f24a8e68c562057327cda3c5b10183f))

## [0.3.5](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.3.4...v0.3.5) (2023-11-06)


### Bug Fixes

* **docker:** bump common-ci to build latest image ([9ab3585](https://git.knut.univention.de/univention/components/univention-portal/commit/9ab35850de4c89f4901b400d510dc4419e7b2c9f))

## [0.3.4](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.3.3...v0.3.4) (2023-11-03)


### Bug Fixes

* **portal-listener:** checking for UDM availability uses correct HTTP headers ([659c35c](https://git.knut.univention.de/univention/components/univention-portal/commit/659c35cc4baeb292a8af3ead52d76d4c8fc8a134))
* **wait-for-dependency:** include ca-certificates to allow waiting for HTTPS dependencies ([6ceaae6](https://git.knut.univention.de/univention/components/univention-portal/commit/6ceaae68993c9b86887d9c597833555c1cb80b34))

## [0.3.3](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.3.2...v0.3.3) (2023-11-03)


### Bug Fixes

* **ci:** always run the full build pipeline on the main branch ([225efef](https://git.knut.univention.de/univention/components/univention-portal/commit/225efef1a8e4f2af88ecc97f1540571f815f0e9d))

## [0.3.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.3.1...v0.3.2) (2023-11-03)


### Bug Fixes

* **semantic-release:** bump version for release-version bugfix ([403e4c6](https://git.knut.univention.de/univention/components/univention-portal/commit/403e4c66dfbfe08f537ffe247e96b1c7671a163c))
* **semantic-release:** set correct default branch ([67865e1](https://git.knut.univention.de/univention/components/univention-portal/commit/67865e11aefa70c89a4af7ac8fa7f566e71aa749))

## [0.3.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.3.0...v0.3.1) (2023-11-03)


### Bug Fixes

* bump the version to trigger a clean build ([96f0fd5](https://git.knut.univention.de/univention/components/univention-portal/commit/96f0fd5f0a2b72b0805898e9903ef8fbe939bcbe))

## [0.3.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.2.0...v0.3.0) (2023-11-03)


### Features

* **frontend:** switch to ucs-base ([e38e32a](https://git.knut.univention.de/univention/components/univention-portal/commit/e38e32a0a7452fafb26867266d9eed58f77fb563))


### Bug Fixes

* **frontend:** added nginx stage, split tests into Dockerfile.test, adjusted docker-compose to run tests from seperate Dockerfile.test ([bda13f3](https://git.knut.univention.de/univention/components/univention-portal/commit/bda13f3f0010d8b54f6a520fadd7a3da08ab3518))
* **semantic-release-env:** bump version of common-ci, to correct release-bot's email ([8c55a20](https://git.knut.univention.de/univention/components/univention-portal/commit/8c55a20d3e6d0cb460f75b726b474e27ddfe0fa8))
* **versions:** produce version-tagged Docker images ([e52a1d5](https://git.knut.univention.de/univention/components/univention-portal/commit/e52a1d5beb171b5bb4c8022fce658102f8c22752))
