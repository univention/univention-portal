# Changelog

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
