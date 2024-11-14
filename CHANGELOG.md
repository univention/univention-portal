# Changelog

## [0.45.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.45.0...v0.45.1) (2024-11-14)


### Bug Fixes

* **frontend:** Add handling of focusin / focusout for the notification display ([ed31578](https://git.knut.univention.de/univention/components/univention-portal/commit/ed3157865e437574d68b51a65bef4cd6d34a1264))
* **frontend:** Use a function to provide a structured default value in NewPasswordBox ([b8a1b7c](https://git.knut.univention.de/univention/components/univention-portal/commit/b8a1b7c7dc8f415e3c5d3917ba188db9a37ca382))

## [0.45.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.44.4...v0.45.0) (2024-11-14)


### Features

* **frontend:** add optional id attribute to the self-service components ([65adbc7](https://git.knut.univention.de/univention/components/univention-portal/commit/65adbc737c155bad699a64214988ad7d3978bbcf)), closes [#57731](https://git.knut.univention.de/univention/components/univention-portal/issues/57731)
* **joinscripts:** increase all modified joinscripts by 10 ([c9cf1e8](https://git.knut.univention.de/univention/components/univention-portal/commit/c9cf1e8cb2fec619b5e017f879b83b204e8e139c)), closes [#56927](https://git.knut.univention.de/univention/components/univention-portal/issues/56927)
* **portal:** change the style of the Portal's folders, tiles and scrollbars ([e0d421f](https://git.knut.univention.de/univention/components/univention-portal/commit/e0d421ff261a15107fd8ccece6abdc2e1ecfbc18)), closes [#2058](https://git.knut.univention.de/univention/components/univention-portal/issues/2058) [#2061](https://git.knut.univention.de/univention/components/univention-portal/issues/2061) [#2062](https://git.knut.univention.de/univention/components/univention-portal/issues/2062) [#2064](https://git.knut.univention.de/univention/components/univention-portal/issues/2064) [#57083](https://git.knut.univention.de/univention/components/univention-portal/issues/57083)
* **portal:** change the style of the Portal's header tabs ([016dd13](https://git.knut.univention.de/univention/components/univention-portal/commit/016dd133d2fc100cb2d0c47b090bd563e5df17e0)), closes [#2063](https://git.knut.univention.de/univention/components/univention-portal/issues/2063) [#57083](https://git.knut.univention.de/univention/components/univention-portal/issues/57083)
* **portal:** change the style of the Portal's sidebar ([6380c40](https://git.knut.univention.de/univention/components/univention-portal/commit/6380c40f7bacf5ab24dfe850fc9718b0cb69dd31)), closes [#57083](https://git.knut.univention.de/univention/components/univention-portal/issues/57083)
* **portal:** further improvements of the portal for UCS 5.2 ([fdcc4fd](https://git.knut.univention.de/univention/components/univention-portal/commit/fdcc4fd84a70668b9b95bcfb763434f611face77)), closes [#57083](https://git.knut.univention.de/univention/components/univention-portal/issues/57083)
* **portal:** refine style of portal ([b5778d7](https://git.knut.univention.de/univention/components/univention-portal/commit/b5778d73765caee51703a48799b88c6b96d1e3d4)), closes [#57083](https://git.knut.univention.de/univention/components/univention-portal/issues/57083)
* **portal:** support oidc in portal login ([18335d1](https://git.knut.univention.de/univention/components/univention-portal/commit/18335d1c1d5015a006bcdab5640ba423e28e98e8)), closes [#57534](https://git.knut.univention.de/univention/components/univention-portal/issues/57534) [univention/ucs#2416](https://git.knut.univention.de/univention/ucs/issues/2416)
* Reload all logged in Portal browser tabs on logout ([ef090fb](https://git.knut.univention.de/univention/components/univention-portal/commit/ef090fbd680a32be8f1530308e4fb8abedaa260c)), closes [#57467](https://git.knut.univention.de/univention/components/univention-portal/issues/57467) [#2362](https://git.knut.univention.de/univention/components/univention-portal/issues/2362)
* **umc:** change the style of the UMC header ([a1f0cf4](https://git.knut.univention.de/univention/components/univention-portal/commit/a1f0cf4b49172b19cc689c2e635d36cb54b12f78)), closes [#2069](https://git.knut.univention.de/univention/components/univention-portal/issues/2069) [#57083](https://git.knut.univention.de/univention/components/univention-portal/issues/57083)
* **umc:** User can now delete their own birthday again ([099d06c](https://git.knut.univention.de/univention/components/univention-portal/commit/099d06c18c08fddc4ec1cf05d12a7a0b4e6545e7)), closes [#57023](https://git.knut.univention.de/univention/components/univention-portal/issues/57023)


### Bug Fixes

* double quote on bash variables ([ac961bc](https://git.knut.univention.de/univention/components/univention-portal/commit/ac961bccd5b6937ee4871b9db0813031c8122de0))
* **frontend:** adapt tests to new iframe tab indexing ([1e30d76](https://git.knut.univention.de/univention/components/univention-portal/commit/1e30d76b9d0db3179db56fa9cf37b3a78ad3c00e))
* **portal:** default [secure] for portal/reload-tabs-on-logout ([4ce4386](https://git.knut.univention.de/univention/components/univention-portal/commit/4ce4386a625758124fbefee13d1f52f6d090e13f))
* **portal:** further improvements of the portal for UCS 5.2 ([bdbfc01](https://git.knut.univention.de/univention/components/univention-portal/commit/bdbfc01c39e87bfe2d0751fd690038dd1c9e7efd)), closes [#57083](https://git.knut.univention.de/univention/components/univention-portal/issues/57083)
* **server:** Bump to ucs 5.2 and Python 3.11 ([67d269c](https://git.knut.univention.de/univention/components/univention-portal/commit/67d269c48aea8f8beb5c56790f48af67e526f5dc))

## [0.44.4](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.44.3...v0.44.4) (2024-11-14)


### Bug Fixes

* **frontend:** Adjust usage of "this.$refs" inside of "v-for" ([c83dbd5](https://git.knut.univention.de/univention/components/univention-portal/commit/c83dbd5228ce57d999b34788d9aa47de117d8eca))
* **frontend:** TabsBody: slot.type.name to slot.type, slot.children as any ([5335f9d](https://git.knut.univention.de/univention/components/univention-portal/commit/5335f9d9cdc95476e45ef91df9aa1f13ff350367))

## [0.44.3](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.44.2...v0.44.3) (2024-11-01)


### Bug Fixes

* Fix umc portal tile link ([be750d1](https://git.knut.univention.de/univention/components/univention-portal/commit/be750d124d7f0a6b853b6bccce45ef6ac0ca9e03))

## [0.44.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.44.1...v0.44.2) (2024-11-01)


### Bug Fixes

* fix license information of trademarked images ([7575334](https://git.knut.univention.de/univention/components/univention-portal/commit/75753341dc88df5cf3380e43e2c698c4e098dd3b))

## [0.44.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.44.0...v0.44.1) (2024-11-01)


### Bug Fixes

* add digest to wait-for-dependency image tag ([86d725b](https://git.knut.univention.de/univention/components/univention-portal/commit/86d725b591a1cf9e928cab6162363e474b5759b5))

## [0.44.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.43.0...v0.44.0) (2024-10-30)


### Features

* **consumer:** Add partial support of new secrets handling around provisioningApi.auth ([b31ba3a](https://git.knut.univention.de/univention/components/univention-portal/commit/b31ba3a04bf0d4d4c7d40a07d15e92450e79e34c))

## [0.43.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.42.3...v0.43.0) (2024-10-22)


### Features

* add Keycloak portal entry ([daf843b](https://git.knut.univention.de/univention/components/univention-portal/commit/daf843bf27220f668c2a6b60a70e1eeb6f111aa1))

## [0.42.3](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.42.2...v0.42.3) (2024-10-17)


### Bug Fixes

* **server:** missing dependencies file for Trivy ([7c58f8e](https://git.knut.univention.de/univention/components/univention-portal/commit/7c58f8e44b0b76aaaabdb6f3d512d79b018d2a09)), closes [univention/customers/dataport/team-souvap#764](https://git.knut.univention.de/univention/customers/dataport/team-souvap/issues/764)

## [0.42.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.42.1...v0.42.2) (2024-10-09)


### Bug Fixes

* remove duplicate key ([204e41c](https://git.knut.univention.de/univention/components/univention-portal/commit/204e41ca04f59a9059bf0a7158e2f199d2f30748))

## [0.42.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.42.0...v0.42.1) (2024-10-09)


### Bug Fixes

* fix ingress paths ([d872f8b](https://git.knut.univention.de/univention/components/univention-portal/commit/d872f8b11db6bc0048c3cec2c64df62b9a388efd))

## [0.42.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.41.0...v0.42.0) (2024-10-04)


### Features

* **frontend:** remove custom theming ([882a22b](https://git.knut.univention.de/univention/components/univention-portal/commit/882a22baf00cd0fb9256c74c500164ca0849f560))


### Bug Fixes

* **frontend:** use UCS nubus favicon and icon ([c09cd3b](https://git.knut.univention.de/univention/components/univention-portal/commit/c09cd3ba70af4e1ff59c0311ee2647c93602c6f9))

## [0.41.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.40.1...v0.41.0) (2024-10-02)


### Features

* **frontend:** Add "startSessionRefresh" into umcSession store module ([7777305](https://git.knut.univention.de/univention/components/univention-portal/commit/77773052e9694589551d6535078dd899781a9b81))
* **frontend:** Add feature toggle around umc session refresh ([84af0ac](https://git.knut.univention.de/univention/components/univention-portal/commit/84af0ac22ff7146940e299e0da7f07e7f68b7f21))
* **frontend:** Add handling of "load" event into UmcSessionRefreshIframe ([c53b20e](https://git.knut.univention.de/univention/components/univention-portal/commit/c53b20ef200ed51bdecb764faf5757c4770087f8))
* **frontend:** Add retartSessionRefresh and disableSessionRefresh actions ([9303588](https://git.knut.univention.de/univention/components/univention-portal/commit/9303588bc433c2c6ac0415e10b292645d2cd3120))
* **frontend:** Add umcSession module into store ([ad24a6a](https://git.knut.univention.de/univention/components/univention-portal/commit/ad24a6a731939359012633f8018452ab416ca735))
* **frontend:** Add UmcSessionRefreshIframe ([f529852](https://git.knut.univention.de/univention/components/univention-portal/commit/f529852f64954655cb7c35a39be165f728f17d0c))
* **frontend:** Add utility function umcGetSessionInfo ([8811771](https://git.knut.univention.de/univention/components/univention-portal/commit/8811771c436c7e51002d9bce5c1ee9dc21059cb2))
* **frontend:** Add utility functions to parse the session refresh data ([c928edb](https://git.knut.univention.de/univention/components/univention-portal/commit/c928edb9dc61916a8cc45abd7805a07c19c5abf0))
* **frontend:** Handle expired session and failure cases in umcGetSessionInfo ([c9628ad](https://git.knut.univention.de/univention/components/univention-portal/commit/c9628ad9ddd9aa9b8b63e23f00d0526d31a88a0a))
* **frontend:** Handle the result value in UmcSessionRefreshIframe ([3a3d968](https://git.knut.univention.de/univention/components/univention-portal/commit/3a3d9686a2f7af44cf4bf8cbaa3c86c863bc3f4b))
* **frontend:** Hide the iframe for the umc session reload ([a507980](https://git.knut.univention.de/univention/components/univention-portal/commit/a507980a56f924a817e64f84a9c9f067c362fa39))


### Bug Fixes

* **frontend:** Correct handling of internal state in UmcSessionRefreshIframe ([c8998b7](https://git.knut.univention.de/univention/components/univention-portal/commit/c8998b7cf5d2d8ebef7476f871e47ad40356c9ef))

## [0.40.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.40.0...v0.40.1) (2024-09-26)


### Bug Fixes

* bump Provisioning client version, adapt to new subscriptions format ([d4e1fc4](https://git.knut.univention.de/univention/components/univention-portal/commit/d4e1fc4a670a5350230e409cf3d2072a176f66e8))

## [0.40.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.39.0...v0.40.0) (2024-09-26)


### Features

* **ci:** enable malware scanning, disable sbom generation ([4f71e24](https://git.knut.univention.de/univention/components/univention-portal/commit/4f71e24512215d142d763a7447494e31d91bc477))

## [0.39.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.38.6...v0.39.0) (2024-09-25)


### Features

* remove cachehttp and reloaderhttp ([1867ba1](https://git.knut.univention.de/univention/components/univention-portal/commit/1867ba18e693f497682016ed0e7ebcf225a7e0e1))

## [0.38.6](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.38.5...v0.38.6) (2024-09-25)


### Bug Fixes

* **frontend:** Correct the "meta.json" for solo frontend usage ([804bcc0](https://git.knut.univention.de/univention/components/univention-portal/commit/804bcc0b96adfa420f6aba6c8852be5f06fc0bab))
* **frontend:** Correct the "portal.json" example announcements ([28b276f](https://git.knut.univention.de/univention/components/univention-portal/commit/28b276f20639a293c309570950e020449465af1d))

## [0.38.5](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.38.4...v0.38.5) (2024-09-24)


### Bug Fixes

* bump provisioning client, adapt to new endpoint names, log DN ([b0f41a0](https://git.knut.univention.de/univention/components/univention-portal/commit/b0f41a0f33b438e1c9e80a657c1101405def66a4))

## [0.38.4](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.38.3...v0.38.4) (2024-09-23)


### Bug Fixes

* **portal-consumer:** Don't leak secrets in bash scripts ([4e0dfe0](https://git.knut.univention.de/univention/components/univention-portal/commit/4e0dfe0befd2ecbd062e065a40e20ba9776a22c3))

## [0.38.3](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.38.2...v0.38.3) (2024-09-13)


### Bug Fixes

* **frontend:** Correctly fill aria-label in NewPasswordBox ([1a866d7](https://git.knut.univention.de/univention/components/univention-portal/commit/1a866d7303961c6cfac18dfdd16dd71f4af288f7))
* **frontend:** Remove call which installs packages from Dockerfile ([34e41a3](https://git.knut.univention.de/univention/components/univention-portal/commit/34e41a3dd539ff96d899a0e24ec8b2c3b96a1f13))
* **frontend:** Update caniuse-lite to version 1.0.3.0001660 ([78f090a](https://git.knut.univention.de/univention/components/univention-portal/commit/78f090a21fb3ef2e927b725ad038187667620145))

## [0.38.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.38.1...v0.38.2) (2024-09-12)


### Bug Fixes

* **portal-consumer:** improve wait-for-provisioning-api to wait until the user/subscription is created ([b98e404](https://git.knut.univention.de/univention/components/univention-portal/commit/b98e40401efc4f140c18af5d574cdc1958f11085))

## [0.38.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.38.0...v0.38.1) (2024-09-11)


### Bug Fixes

* **portal-consumer:** Move initial-values loading into the main container to only do it after recieving the first message ([dc1779a](https://git.knut.univention.de/univention/components/univention-portal/commit/dc1779a22ddd3fec26f6e793c81b6fbfd83a4772))
* **portal-server:** Remove apt update from Dockerfile to make builds reproducible ([eed88a9](https://git.knut.univention.de/univention/components/univention-portal/commit/eed88a954ff65c9b9d2ad859474376e9676606f9))

## [0.38.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.37.0...v0.38.0) (2024-09-10)


### Features

* **portal-extension:** Activate or deactivate UMC login tile on job rerun ([5488acf](https://git.knut.univention.de/univention/components/univention-portal/commit/5488acfc7ca8e5fb53b5d24769b926694d82c778))

## [0.37.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.36.0...v0.37.0) (2024-09-04)


### Features

* **portal-consumer:** avoid leak secrets ([af4c3e1](https://git.knut.univention.de/univention/components/univention-portal/commit/af4c3e1a7c9bbac9a56c1751dcb96890039b0796))

## [0.36.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.35.1...v0.36.0) (2024-09-03)


### Features

* added enable flag to default portal login ([65629ba](https://git.knut.univention.de/univention/components/univention-portal/commit/65629baf2608c00c7dbebb6e037a03a1088b2930))

## [0.35.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.35.0...v0.35.1) (2024-08-29)


### Bug Fixes

* **portal-consumer:** update nubus-provisioning-consumer to use ProvisioningMessage model ([b18ec4e](https://git.knut.univention.de/univention/components/univention-portal/commit/b18ec4e9b9e917b3d590f3d1bcb3b9e3c071012f))

## [0.35.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.34.0...v0.35.0) (2024-08-28)


### Features

* unify UCR configuration ([dd40870](https://git.knut.univention.de/univention/components/univention-portal/commit/dd408702bfb3bb6d4a50e4b1d73299857cc51804))

## [0.34.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.33.1...v0.34.0) (2024-08-27)


### Features

* **portal-consumer:** Add extraVolumes option ([f9b2d07](https://git.knut.univention.de/univention/components/univention-portal/commit/f9b2d07d81f6b332e231350f03d1b4a0c13b1e2f))

## [0.33.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.33.0...v0.33.1) (2024-08-21)


### Bug Fixes

* **portal-server:** Correct the ingress annotation handling ([2f9ca4d](https://git.knut.univention.de/univention/components/univention-portal/commit/2f9ca4db23cc01ea6bead7c01c84b95651e7a629))

## [0.33.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.32.0...v0.33.0) (2024-08-21)


### Features

* **notifications-api:** Add certManager template for ingress ([a344819](https://git.knut.univention.de/univention/components/univention-portal/commit/a344819b553e69628f0733dec2555a210ba26264))

## [0.32.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.31.2...v0.32.0) (2024-08-19)


### Features

* call Python function instead of subprocess ([9bfa508](https://git.knut.univention.de/univention/components/univention-portal/commit/9bfa508ec595c027d73e1fc59b1f41bc83698a1a))
* log processing time ([bb6a4e8](https://git.knut.univention.de/univention/components/univention-portal/commit/bb6a4e85506855b0b5f01c298ca879b016f17308))

## [0.31.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.31.1...v0.31.2) (2024-08-19)


### Bug Fixes

* **frontend:** Connect label with the input "password retype" ([4ad1dfb](https://git.knut.univention.de/univention/components/univention-portal/commit/4ad1dfbfd86baa07922683bf074e0aa768336458))

## [0.31.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.31.0...v0.31.1) (2024-08-09)


### Bug Fixes

* set correct nubus-provisioning-consumer lib version ([bcfbb65](https://git.knut.univention.de/univention/components/univention-portal/commit/bcfbb657743c26ad2eacd475c7ee55834bb3577e))

## [0.31.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.30.1...v0.31.0) (2024-08-08)


### Features

* update nubus-provisioning-consumer lib to use Body model ([e57da7d](https://git.knut.univention.de/univention/components/univention-portal/commit/e57da7dcece4dcfb40443f1f56f2443d236fb4cc))


### Bug Fixes

* **portal-consumer:** change to falsy if condition to also catch new empty dict syntax ([34d10e6](https://git.knut.univention.de/univention/components/univention-portal/commit/34d10e670ce20869749702025e0d919ed8fb1aa1))

## [0.30.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.30.0...v0.30.1) (2024-08-02)


### Bug Fixes

* set log level in subprocess aswell ([0255a0f](https://git.knut.univention.de/univention/components/univention-portal/commit/0255a0f0e09f7a117357fb9793f4c137bc010476))

## [0.30.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.29.1...v0.30.0) (2024-07-31)


### Features

* update provisioning lib ([5c9ed3d](https://git.knut.univention.de/univention/components/univention-portal/commit/5c9ed3dad8d1f18d353e75d61c55748d8cef239e))


### Bug Fixes

* rename env values and provisioning client classes ([27817ad](https://git.knut.univention.de/univention/components/univention-portal/commit/27817ad0ae1dac00a3f11efb0d8beeabe6cca74c))
* update nubus-provisioning-consumer lib to version 0.31.0, fix unittests ([41c61bf](https://git.knut.univention.de/univention/components/univention-portal/commit/41c61bf0c4c63a5cd911ad34d20ef04c3c2af47e))

## [0.29.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.29.0...v0.29.1) (2024-07-26)


### Bug Fixes

* **portal-consumer:** fix portal update by correctly parsing the update reason ([d309bfc](https://git.knut.univention.de/univention/components/univention-portal/commit/d309bfc0795a8e62f3b8f2492913efae39215454))
* **portal-consumer:** handle the messages with the wrong topic, fix unittest, remove deprecated e2e tests ([0563d8b](https://git.knut.univention.de/univention/components/univention-portal/commit/0563d8b5d94fde461aec2208f0f00ac683802b3e))

## [0.29.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.28.0...v0.29.0) (2024-07-24)


### Features

* **frontend:** allow portal customizations and ship default nubus ([eecbfde](https://git.knut.univention.de/univention/components/univention-portal/commit/eecbfdeb933ac6303892073652bd482500c04b3c))


### Bug Fixes

* change pinned version ([e456e8b](https://git.knut.univention.de/univention/components/univention-portal/commit/e456e8b4f52f7801975d4b96bafdab8c449a064e))

## [0.28.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.27.3...v0.28.0) (2024-07-19)


### Features

* **portal-extension:** Add new files for "udm-data-loader" ([565a20f](https://git.knut.univention.de/univention/components/univention-portal/commit/565a20f10fef803689e900d0d986450eb9496e38))
* **portal-extension:** Adjust data files to Jinja2 template engine ([f8ccd2e](https://git.knut.univention.de/univention/components/univention-portal/commit/f8ccd2e78db201b3ef692476e4906b7bdc50ea99))

## [0.27.3](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.27.2...v0.27.3) (2024-07-19)


### Bug Fixes

* **portal-consumer:** change portal-consumer base image from listener to ucs-base-520 ([e9b8ed2](https://git.knut.univention.de/univention/components/univention-portal/commit/e9b8ed23b30c00f811f7dab2619d94ff77da74d7))
* remove unused listener/notifier-related configuration options ([283e13d](https://git.knut.univention.de/univention/components/univention-portal/commit/283e13dcb31e9ec8ccb8dd4694bfb20df95abeec))

## [0.27.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.27.1...v0.27.2) (2024-07-17)


### Bug Fixes

* support shared portal secret without extra volumes and mounts ([5b5a61b](https://git.knut.univention.de/univention/components/univention-portal/commit/5b5a61b534d513a1d6b7bf68a00ffdcdb73db08d))

## [0.27.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.27.0...v0.27.1) (2024-07-17)


### Bug Fixes

* ingress configuration for logo ([067d8f1](https://git.knut.univention.de/univention/components/univention-portal/commit/067d8f1fea49fd301893d1da749000f85e4c7827))

## [0.27.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.26.3...v0.27.0) (2024-07-09)


### Features

* adjust ingress configuration to support Nubus deployment without stack-gateway or centralized ingress configuration ([719efba](https://git.knut.univention.de/univention/components/univention-portal/commit/719efba3581fb49752796a6256532c04f4d23625))


### Bug Fixes

* permanent redirect instead of temporal to allow for path only ([53f53d8](https://git.knut.univention.de/univention/components/univention-portal/commit/53f53d8d25b611a9b71eae8785b3b756ee8bc950))

## [0.26.3](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.26.2...v0.26.3) (2024-06-27)


### Bug Fixes

* **portal-extension:** Fix typo in loader script ([59d0c88](https://git.knut.univention.de/univention/components/univention-portal/commit/59d0c88a848f0a5d6feb72507a24476433bd2aa1))

## [0.26.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.26.1...v0.26.2) (2024-06-25)


### Bug Fixes

* **helm notifications-api:** add option to use third party supplied postgresql instance ([c55c4dc](https://git.knut.univention.de/univention/components/univention-portal/commit/c55c4dca58cca55d45a7da9cc5268fafb5ce758c))

## [0.26.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.26.0...v0.26.1) (2024-06-25)


### Bug Fixes

* use the same container and queue for the cache-consumer and portals-consumer ([0a62729](https://git.knut.univention.de/univention/components/univention-portal/commit/0a62729c010e62c6ed9c6ce1dc8595c0fbadf834))

## [0.26.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.25.2...v0.26.0) (2024-06-18)


### Features

* **portal-extension:** Add simple plugin loader ([63017ac](https://git.knut.univention.de/univention/components/univention-portal/commit/63017ac12b1ecfc5da4013d6f51548dfdbdb63f7))
* **portal-extension:** Place plugins into the suggested structure ([c5305d9](https://git.knut.univention.de/univention/components/univention-portal/commit/c5305d9af7e66182a301da6613380efc05ece60e))
* **portal-extension:** Prepare a universal plugin loader ([be8ed0f](https://git.knut.univention.de/univention/components/univention-portal/commit/be8ed0f65e400f5f690baea0ea6ac39e97e4e23c))
* **portal-extension:** Use a minimal base image ([72ef7d0](https://git.knut.univention.de/univention/components/univention-portal/commit/72ef7d071433f5d55ff1ce63ea3d06b781d62f08))
* **portal-extension:** Use ucs-base-image ([23a5bc6](https://git.knut.univention.de/univention/components/univention-portal/commit/23a5bc6e8ce45783c6961c5107d7b8b9a321a9c8))

## [0.25.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.25.1...v0.25.2) (2024-06-17)


### Bug Fixes

* **portal-consumer:** respect global imageRegistry for all container image templates ([0796834](https://git.knut.univention.de/univention/components/univention-portal/commit/0796834e16005fe9f1d5e435492d4a507a7fe664))

## [0.25.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.25.0...v0.25.1) (2024-06-17)


### Bug Fixes

* **portal-server:** Correct typo in dockerfile which breaks the container ([bfd7356](https://git.knut.univention.de/univention/components/univention-portal/commit/bfd7356a798c0115809491028b7ae7f88693230f))

## [0.25.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.24.2...v0.25.0) (2024-06-11)


### Features

* add container for portal-consumer, fix portal-consumer ([e0ac7b9](https://git.knut.univention.de/univention/components/univention-portal/commit/e0ac7b91ec10d2e9e23d549afad404369bc8dd09))
* update helm chart and other parts of the project to use portal-consumer instead of portal-listener ([b709b9d](https://git.knut.univention.de/univention/components/univention-portal/commit/b709b9d852e227a74b69f37defeb4fa6686ebc8b))
* use provisioning-consumer-lib to listen for changes in the groups and portal ([36ce864](https://git.knut.univention.de/univention/components/univention-portal/commit/36ce8641dbacd9cfb1fa60725bc4f8db778c3087))
* wait for provisioning api, add log for updating portal ([46e1a7a](https://git.knut.univention.de/univention/components/univention-portal/commit/46e1a7ab2bac43542063b79c0e0c6ec7951c663a))


### Bug Fixes

* do not register consumer, let pydantic_settings read the env values and AsyncClient instantiate the Settings class ([0fe91dd](https://git.knut.univention.de/univention/components/univention-portal/commit/0fe91dd0daef8d03be985e7e7b55f59680f43e5a))
* grant execute permissions to the initialize.sh and portal-consumer-entrypoint.sh ([e32dd18](https://git.knut.univention.de/univention/components/univention-portal/commit/e32dd1872f4b221e4ce459543bb4a3f850c52746))
* remove listener from the univention-portal.install ([d2a1fda](https://git.knut.univention.de/univention/components/univention-portal/commit/d2a1fdae0955dd2efe27b0a512b927e24f6e2ca4))
* return back values-portal-consumer.example.yaml, add credentials to the configmap ([193d127](https://git.knut.univention.de/univention/components/univention-portal/commit/193d127e975531e5068e34c1bbf0ca134a866f25))
* update README for the portal-consumer helm chart, delete portal-listener Dockerfile, fix pre-commit errors ([b6363be](https://git.knut.univention.de/univention/components/univention-portal/commit/b6363be60b621badaecf44943f10360ff4b463b6))
* use bitnamicharts repository instead of common-helm ([31c7384](https://git.knut.univention.de/univention/components/univention-portal/commit/31c7384cdbdf5bd900b6cda1ccb8b3339e004ccd))
* use pip instead of pipx, clean up redundant installations, set versions for packages ([e873376](https://git.knut.univention.de/univention/components/univention-portal/commit/e87337603121a6386f76b66d63efb69a3002a364))
* use provisioning consumer for cache instead of listener ([687d0d9](https://git.knut.univention.de/univention/components/univention-portal/commit/687d0d9c8dd4c85eba6127dbcc91ebd0deb6cb89))

## [0.24.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.24.1...v0.24.2) (2024-06-10)


### Bug Fixes

* **frontend:** missing paths for background and logo ([d2d9ef4](https://git.knut.univention.de/univention/components/univention-portal/commit/d2d9ef49fec6d1a20bce740b0851b27caff41fb0))

## [0.24.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.24.0...v0.24.1) (2024-05-27)


### Bug Fixes

* Do not add "http" into extra Ingresses if no paths specified ([2f98cee](https://git.knut.univention.de/univention/components/univention-portal/commit/2f98cee0ac05b93825460f656e210617751b46c2))

## [0.24.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.23.1...v0.24.0) (2024-05-24)


### Features

* push to harbor ([c0622d6](https://git.knut.univention.de/univention/components/univention-portal/commit/c0622d6296bc470c6d56f1373a658e9734b840b0))


### Bug Fixes

* **ci:** use global registry and package helm charts downstream ([cf74db4](https://git.knut.univention.de/univention/components/univention-portal/commit/cf74db466c37e6d83d19d6aeee2810677f35df01))
* update docs ([cbfbcba](https://git.knut.univention.de/univention/components/univention-portal/commit/cbfbcbaf14da4c691d5896175406f2123ecf1eba))

## [0.23.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.23.0...v0.23.1) (2024-05-20)


### Bug Fixes

* **helm:** add additional templating support ([e8be126](https://git.knut.univention.de/univention/components/univention-portal/commit/e8be126eb3882a4d99aa4cac7551d844c1f53412))

## [0.23.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.22.0...v0.23.0) (2024-05-07)


### Features

* Update base image to 5.0-7 ([8ce18ca](https://git.knut.univention.de/univention/components/univention-portal/commit/8ce18cabf23f4e175127ed2a5768f339dbc468c6))
* Update the listener base image to version 0.7.0 ([ad21a5a](https://git.knut.univention.de/univention/components/univention-portal/commit/ad21a5af973ee3df0fb933c4792dac9e0cd8ea10))

## [0.22.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.21.0...v0.22.0) (2024-04-29)


### Features

* drop session cookie patch ([1172fd8](https://git.knut.univention.de/univention/components/univention-portal/commit/1172fd8995dfc56332b6051a5965c4f28231191d))

## [0.21.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.20.7...v0.21.0) (2024-04-25)


### Features

* changes to support the refactored umbrella values in a nubus deployment (notifications-api) ([86b81ab](https://git.knut.univention.de/univention/components/univention-portal/commit/86b81abc131684b8ac967f2b0fe5ec807657476b))
* changes to support the refactored umbrella values in a nubus deployment (portal-listener) ([c80373f](https://git.knut.univention.de/univention/components/univention-portal/commit/c80373f8ba0c855e1bd475a93832c32f2d9905db))
* changes to support the refactored umbrella values in a nubus deployment (portal-server) ([fe6dbf7](https://git.knut.univention.de/univention/components/univention-portal/commit/fe6dbf7855e8b4b343f139a16b638cef117af11a))


### Bug Fixes

* base portal-listener.ldapAdminDn on nubusTemplates.ldapServer.ldap.adminDn rename portal-listener.ldapHost to portal-listener.ldap.connection.host ([1c8ca02](https://git.knut.univention.de/univention/components/univention-portal/commit/1c8ca02af09efcde21419664d569c3770841915e))
* code deduplication ([c1c411e](https://git.knut.univention.de/univention/components/univention-portal/commit/c1c411ec82707293731b6f8b598c807952b7ad9f))
* remove unneeded configmap entries ([5f78e49](https://git.knut.univention.de/univention/components/univention-portal/commit/5f78e49d1849386ac102d7393e965bb433ecdc1f))
* remove unneeded template defintion ([7452a4e](https://git.knut.univention.de/univention/components/univention-portal/commit/7452a4e1bf60cd227ba05cb04f2c7cf1d62a6818))

## [0.20.7](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.20.6...v0.20.7) (2024-04-25)


### Bug Fixes

* Revert "fix(listener): Skip rebuild of group membership cache in init container" ([57a494b](https://git.knut.univention.de/univention/components/univention-portal/commit/57a494b1e9142aa0384cd778a3f71eca3a0aeea3))

## [0.20.6](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.20.5...v0.20.6) (2024-04-25)


### Bug Fixes

* **listener:** Add volume "group-membership-cache" ([ebbd30f](https://git.knut.univention.de/univention/components/univention-portal/commit/ebbd30fe30918c1362f8cd2836b20129aa13e249))
* **listener:** Skip rebuild of group membership cache in init container ([758e424](https://git.knut.univention.de/univention/components/univention-portal/commit/758e424067a417b18e4547cc7cf52e60e19938c4))

## [0.20.5](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.20.4...v0.20.5) (2024-04-15)


### Bug Fixes

* user birthday can be deleted ([8628c70](https://git.knut.univention.de/univention/components/univention-portal/commit/8628c70d8c31c97a64c317147dc0900db17a2ec2))

## [0.20.4](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.20.3...v0.20.4) (2024-04-02)


### Bug Fixes

* pinning container name to portal-listener ([8aa1277](https://git.knut.univention.de/univention/components/univention-portal/commit/8aa1277bf9ae079471128523e2bb8f17a4ce20bd))

## [0.20.3](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.20.2...v0.20.3) (2024-03-26)


### Bug Fixes

* use configurable minio url in configmap ([b7a8970](https://git.knut.univention.de/univention/components/univention-portal/commit/b7a8970b83703a710654a9a994c650cea3ae631c))

## [0.20.2](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.20.1...v0.20.2) (2024-03-25)


### Bug Fixes

* **ci:** update common-ci from v1.24.4 to v1.24.5 ([89ddf64](https://git.knut.univention.de/univention/components/univention-portal/commit/89ddf647483ae6f487d8d0747777e852086a6048))

## [0.20.1](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.20.0...v0.20.1) (2024-03-12)


### Bug Fixes

* **notifications-api:** fix indentation in bundled postgresql ([cf0a81c](https://git.knut.univention.de/univention/components/univention-portal/commit/cf0a81c206b482222016b19ab6da8bb0cbab8262))

## [0.20.0](https://git.knut.univention.de/univention/components/univention-portal/compare/v0.19.1...v0.20.0) (2024-03-05)


### Features

* **helm:** BSI-compliant deployment ([9a8bc4b](https://git.knut.univention.de/univention/components/univention-portal/commit/9a8bc4b298107034ca7586cad7d7dae4267b4f5d))


### Bug Fixes

* **portal-listener:** remove store-dav ref ([5dabfae](https://git.knut.univention.de/univention/components/univention-portal/commit/5dabfaeb02ad9a47bdaff8070d46cf510fcb0339))

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
