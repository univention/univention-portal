# Changelog

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
