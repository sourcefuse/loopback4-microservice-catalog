# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-alpha.27](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.26...@sourceloop/notification-service@1.0.0-alpha.27) (2020-12-22)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.26](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.25...@sourceloop/notification-service@1.0.0-alpha.26) (2020-12-18)


### Features

* **core:** added helmet, rate limit in sequence when respective configs are present ([#101](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/101)) ([cbcc00c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/cbcc00ca058299c284aa8a6857ccf73ed0621536))





# [1.0.0-alpha.25](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.24...@sourceloop/notification-service@1.0.0-alpha.25) (2020-12-08)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.24](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.23...@sourceloop/notification-service@1.0.0-alpha.24) (2020-12-07)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.23](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.22...@sourceloop/notification-service@1.0.0-alpha.23) (2020-12-07)


### Features

* **notification-service:** adds actionMeta property to NotificationUser model ([#99](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/99)) ([bbc1075](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bbc1075836de1f9a6047bc1d3ca14a5d19ebba97))





# [1.0.0-alpha.22](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.21...@sourceloop/notification-service@1.0.0-alpha.22) (2020-12-07)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.21](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.20...@sourceloop/notification-service@1.0.0-alpha.21) (2020-11-17)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.20](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.19...@sourceloop/notification-service@1.0.0-alpha.20) (2020-11-15)


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





# [1.0.0-alpha.19](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.18...@sourceloop/notification-service@1.0.0-alpha.19) (2020-11-04)


### Bug Fixes

* **notification-service:** notification is read set to false as default ([#91](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/91)) ([17f1060](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/17f1060ba3ba08ec2ab4c9065bc0b31bdfb86ed5))





# [1.0.0-alpha.18](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.17...@sourceloop/notification-service@1.0.0-alpha.18) (2020-11-03)


### Bug Fixes

* **notification-service:** fix for notification user entry ([#90](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/90)) ([9dd8d79](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9dd8d79dc2db2fbc408f99771e38f7671c1f5acd))





# [1.0.0-alpha.17](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.16...@sourceloop/notification-service@1.0.0-alpha.17) (2020-11-03)


### Features

* **notification-service:** add relation for notification user ([aa1b07d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/aa1b07d2383d6467d6bd4db4b512da29b1a258ac))





# [1.0.0-alpha.16](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.15...@sourceloop/notification-service@1.0.0-alpha.16) (2020-10-30)


### Bug Fixes

* **notification-service:** bulk notification fix for accepting array and showing the same in swagger ([#88](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/88)) ([5d8ab0c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5d8ab0cad710ef7f452ebdf291f97b36f2a9a046))





# [1.0.0-alpha.15](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.14...@sourceloop/notification-service@1.0.0-alpha.15) (2020-10-27)


### Bug Fixes

* **notification-service:** notification user creation along with notification fix ([#87](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/87)) ([cc16e9c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/cc16e9ca24c0e941097b89fc92583a4e7137c846))





# [1.0.0-alpha.14](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.13...@sourceloop/notification-service@1.0.0-alpha.14) (2020-10-19)


### Bug Fixes

* **notification-service:** fix model name ([d1ee983](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d1ee98341fb5205828ab768485844e1b674dec71))





# [1.0.0-alpha.13](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.12...@sourceloop/notification-service@1.0.0-alpha.13) (2020-10-08)


### Features

* **core:** add security spec for open api spec generation ([d803457](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d8034578131d43ec911f4dfc7db605317bf4fb58))





# [1.0.0-alpha.12](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.11...@sourceloop/notification-service@1.0.0-alpha.12) (2020-09-25)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.11](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.10...@sourceloop/notification-service@1.0.0-alpha.11) (2020-09-18)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.10](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.9...@sourceloop/notification-service@1.0.0-alpha.10) (2020-08-28)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.9](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.8...@sourceloop/notification-service@1.0.0-alpha.9) (2020-08-12)


### Reverts

* Revert "chore: publish release" ([643209b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/643209b46d2611a696fed91bdc4a153bf8d24f96))





# [1.0.0-alpha.8](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.7...@sourceloop/notification-service@1.0.0-alpha.8) (2020-08-07)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.7](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.6...@sourceloop/notification-service@1.0.0-alpha.7) (2020-07-20)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.6](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.5...@sourceloop/notification-service@1.0.0-alpha.6) (2020-07-20)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.5](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.4...@sourceloop/notification-service@1.0.0-alpha.5) (2020-07-19)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.4](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.3...@sourceloop/notification-service@1.0.0-alpha.4) (2020-07-16)


### Features

* **authentication-service:** add auth service to source loop catalog ([909f304](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/909f304dc056a08cf0dfcfdbabe400ca6e1aa9ee))





# [1.0.0-alpha.3](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.2...@sourceloop/notification-service@1.0.0-alpha.3) (2020-07-08)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.2](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.1...@sourceloop/notification-service@1.0.0-alpha.2) (2020-06-26)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.1](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.0...@sourceloop/notification-service@1.0.0-alpha.1) (2020-06-25)

**Note:** Version bump only for package @sourceloop/notification-service





# 1.0.0-alpha.0 (2020-06-11)


### Features

* **core:** change scope ([d4bf68a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d4bf68a64da546e47519fbd479b41f7d41e3489d))
* **sandbox-testing:** add sandbox for testing ([296279c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/296279cbeeea2409d2959b48252c48b7891aea3c))


### BREAKING CHANGES

* **sandbox-testing:** Fixed binding errors in core sequence

SFO-20
* **core:** scope for all packages changed

SFO-20
