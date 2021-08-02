# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## <small>2.0.1 (2021-07-24)</small>

* fix(core): update readme ([4ec31ca](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4ec31ca)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(core): upgrade loopback4-soft-delete ([f653e0c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f653e0c)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* refactor(authentication-service): fix sonar issues (#266) ([3ea2082](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3ea2082)), closes [#266](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/266) [#251](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/251)





## 2.0.0 (2021-07-14)

* fix(core): fix facades bearer verifier to decouple from auth service (#253) ([cb30528](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/cb30528)), closes [#253](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/253)
* fix(core): fix rate limit key prefix issue (#250) ([980ac9a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/980ac9a)), closes [#250](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/250) [#249](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/249)
* fix(core): update loopback4-soft-delete ([8c35fef](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8c35fef)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* feat(authentication-service): apple-oauth2 (#243) ([98fdb0f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/98fdb0f)), closes [#243](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/243)
* docs(all readme): fixed lerna (#238) ([7451b12](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7451b12)), closes [#238](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/238)
* perf(all services): added security property in all the controllers an… (#232) ([e37a5a1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e37a5a1)), closes [#232](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/232)


### BREAKING CHANGE

* authService url removed from BearerVerifierConfig and now there is a need for a data source with AuthCacheSourceName




## 1.0.0 (2021-05-12)

**Note:** Version bump only for package @sourceloop/core





## 1.0.0-alpha.28 (2021-05-12)

* fix(core): Swagger stats authentication (#204) ([ed7d59f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ed7d59f)), closes [#204](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/204)
* fix(core): updated versions of all loopback packages (#190) ([a02b792](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a02b792)), closes [#190](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/190) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





# [1.0.0-alpha.27](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.26...@sourceloop/core@1.0.0-alpha.27) (2021-03-17)

**Note:** Version bump only for package @sourceloop/core





# [1.0.0-alpha.26](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.25...@sourceloop/core@1.0.0-alpha.26) (2021-02-06)


### Bug Fixes

* **core:** fixes in auth action in sequence ([#119](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/119)) ([1102072](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/110207228348bc901d6286f2cf17bafd8671baf6))





# [1.0.0-alpha.25](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.24...@sourceloop/core@1.0.0-alpha.25) (2021-02-04)


### Features

* **core:** added swagger stats ([#118](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/118)) ([4413c2a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4413c2a5e400d834964d8cee2d4a3dae87b358b6))





# [1.0.0-alpha.24](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.23...@sourceloop/core@1.0.0-alpha.24) (2021-02-01)


### Bug Fixes

* **core:** change in core to rectify publish issue ([#116](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/116)) ([194c5e8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/194c5e8f4c33f2d088e84e0df8420fefa6ecd825))





# [1.0.0-alpha.23](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.22...@sourceloop/core@1.0.0-alpha.23) (2021-01-19)


### Features

* **core:** SFO-169: added metrics functionality in core ([#114](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/114)) ([bc8ba4d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bc8ba4d1c429ee69279c3da3d854aab25484b695))





# [1.0.0-alpha.22](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.21...@sourceloop/core@1.0.0-alpha.22) (2020-12-30)


### Bug Fixes

* **authentication-service:** fix facades bearer verifier data source config not updating issue ([da1a96b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/da1a96b115ec65db2529d9f127a2637dfd82d5d9))





# [1.0.0-alpha.21](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.20...@sourceloop/core@1.0.0-alpha.21) (2020-12-30)


### Features

* **Transactional Repo:** Added base repo ([#108](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/108)) ([e98d2b8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e98d2b8e2b204e492e8a916a7b48b52993fb7690))





# [1.0.0-alpha.20](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.19...@sourceloop/core@1.0.0-alpha.20) (2020-12-22)


### Features

* **core:** added casbin secure sequence ([#107](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/107)) ([9699e92](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9699e92b82d76c0c8299207a303d6bebbec85e92))





# [1.0.0-alpha.19](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.18...@sourceloop/core@1.0.0-alpha.19) (2020-12-18)


### Features

* **core:** added helmet, rate limit in sequence when respective configs are present ([#101](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/101)) ([cbcc00c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/cbcc00ca058299c284aa8a6857ccf73ed0621536))





# [1.0.0-alpha.18](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.17...@sourceloop/core@1.0.0-alpha.18) (2020-12-08)


### Bug Fixes

* **core:** remove colorize fromlogger ([c3f8dca](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c3f8dcadb9fb9eb8bb0efcd08237430c83a6999a))





# [1.0.0-alpha.17](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.16...@sourceloop/core@1.0.0-alpha.17) (2020-12-07)


### Features

* **core:** remove colorize from logger ([95459d4](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/95459d4d8e92f0d37d9a6da274eb413ecada90b2))





# [1.0.0-alpha.16](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.15...@sourceloop/core@1.0.0-alpha.16) (2020-11-17)


### Features

* **core:** change default repos to non abstract for mixins to work ([091ec6b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/091ec6bb74d8ad1d096a3fcb12bb434ee188448f))





# [1.0.0-alpha.15](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.14...@sourceloop/core@1.0.0-alpha.15) (2020-11-15)


### Features

* **authentication-service:** LB4-Authorization dependancy upgrade ([#92](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/92)) ([6541ad1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/6541ad1c68c5d764f1ef211b0c6d77b263a1520f))


### BREAKING CHANGES

* **authentication-service:** Loopback4-authorization authorize metadata changes

RPMS-413

* fix(authentication-service): removed code smells

RPMS-413

* fix(authentication-service): code smells, and added name attribute to entity

RPMS-413

* feat(authentication-service): update lb4-authorization to 3.1.1

Updated controller authorize decorator

RPMS-413

* feat(core): updated project dependencies, resolved test script issues

Updated loopback4-authorization to 3.1.1, and added loopback/metadata in in-mail and video
conferencing services, as test cases were failing.



RPMS-413

Co-authored-by: Mudassir Lakdawala <mudassirlakdawala7@gmail.com>





# [1.0.0-alpha.14](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.13...@sourceloop/core@1.0.0-alpha.14) (2020-10-19)


### Bug Fixes

* fix for translations config binding bug ([#86](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/86)) ([aefab86](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/aefab868d116ab8fce465aa743cebada5d099d8d))





# [1.0.0-alpha.13](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.12...@sourceloop/core@1.0.0-alpha.13) (2020-10-08)


### Features

* **core:** add security spec for open api spec generation ([d803457](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d8034578131d43ec911f4dfc7db605317bf4fb58))





# [1.0.0-alpha.12](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.11...@sourceloop/core@1.0.0-alpha.12) (2020-09-25)

**Note:** Version bump only for package @sourceloop/core





# [1.0.0-alpha.11](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.9...@sourceloop/core@1.0.0-alpha.11) (2020-09-18)


### Features

* **core:** make initialisation object of i18n configurable ([#57](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/57)) ([41a3c41](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/41a3c41b8a1fb961ec03088eaad31dee94ee242b))





# [1.0.0-alpha.10](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.9...@sourceloop/core@1.0.0-alpha.10) (2020-08-31)

### New Feature

* **core:** making i18n initialisation object configurable ([1533c04](https://github.com/sourcefuse/loopback4-microservice-catalog/pull/57/commits/1533c049bd86046aea0c46a7c7be2d939a1c2aac))



# [1.0.0-alpha.9](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.8...@sourceloop/core@1.0.0-alpha.9) (2020-08-28)


### Bug Fixes

* **core:** fix token expiry issue ([ddfe938](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ddfe938b984d039a7eac528623d1feda1fa939f2))





# [1.0.0-alpha.8](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.7...@sourceloop/core@1.0.0-alpha.8) (2020-08-07)

**Note:** Version bump only for package @sourceloop/core





# [1.0.0-alpha.7](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.6...@sourceloop/core@1.0.0-alpha.7) (2020-07-20)


### Bug Fixes

* **authentication-service:** fix expiry handling ([35c8203](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/35c8203b4bc9de4ffcf0026c5d6196d0563267bb))





# [1.0.0-alpha.6](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.5...@sourceloop/core@1.0.0-alpha.6) (2020-07-20)


### Bug Fixes

* **authentication-service:** handle token expiry error message ([a17e768](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a17e76850cb08400768a1c5f9929785d6b3861e6))





# [1.0.0-alpha.5](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.4...@sourceloop/core@1.0.0-alpha.5) (2020-07-19)


### Bug Fixes

* **authentication-service:** fix password expiry time check and relay state for keycloak ([8e8a27d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8e8a27d174ff18fcc7f17e14dca5a5140137a69a))





# [1.0.0-alpha.4](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.3...@sourceloop/core@1.0.0-alpha.4) (2020-07-16)


### Features

* **authentication-service:** add auth service to source loop catalog ([909f304](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/909f304dc056a08cf0dfcfdbabe400ca6e1aa9ee))





# [1.0.0-alpha.3](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.2...@sourceloop/core@1.0.0-alpha.3) (2020-07-08)


### Bug Fixes

* **core:** fix datatype issue of createdBy and modifiedBy ([#43](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/43)) ([20d7ec4](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/20d7ec45d2739c618af8dea107639c10b358521e))





# [1.0.0-alpha.2](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.1...@sourceloop/core@1.0.0-alpha.2) (2020-06-26)


### Bug Fixes

* **core:** cors issue fix ([#37](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/37)) ([65de212](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/65de212da742a5a8e2bbc50d480195c71a7bd55b)), closes [/github.com/strongloop/loopback-next/issues/5368#issuecomment-626233755](https://github.com//github.com/strongloop/loopback-next/issues/5368/issues/issuecomment-626233755)
* **core:** update locale file ([5bda1d5](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5bda1d54392f39f9c9dfe234b46d84d8adbf171f))





# [1.0.0-alpha.1](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/core@1.0.0-alpha.0...@sourceloop/core@1.0.0-alpha.1) (2020-06-25)


### Bug Fixes

* **core:** remove en.json changes ([#29](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/29)) ([09c513e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/09c513e2cb64dd6e61bc3f07a3a854a9afe3c5f4))
* **scheduler-service:** update package lock ([9783659](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9783659cc86b396bb0492454162f4c716c874e55))





# 1.0.0-alpha.0 (2020-06-11)


### Features

* **core:** change scope ([d4bf68a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d4bf68a64da546e47519fbd479b41f7d41e3489d))
* **sandbox-testing:** add sandbox for testing ([296279c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/296279cbeeea2409d2959b48252c48b7891aea3c))
* **scheduler-service:** SFO-37 Base setup for scheduler component implemented ([#6](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/6)) ([6c16c1c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/6c16c1c9e2e8aecea84bfaf89d2123376fad7d80))


### BREAKING CHANGES

* **sandbox-testing:** Fixed binding errors in core sequence

SFO-20
* **core:** scope for all packages changed

SFO-20
