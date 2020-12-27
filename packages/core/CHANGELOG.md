# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
