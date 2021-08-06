# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## <small>1.2.2 (2021-08-06)</small>

* fix(notification-service): fix socket version from loopback4-notifications ([4e7bf6f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4e7bf6f)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## <small>1.2.1 (2021-07-24)</small>

* fix(bpmn-service): fix multiple workflow worker registration issue (#268) ([a29493c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a29493c)), closes [#268](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/268) [#267](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/267)
* fix(core): update readme ([4ec31ca](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4ec31ca)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(core): upgrade loopback4-soft-delete ([f653e0c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f653e0c)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* chore(deps): bump urijs in /services/notification-service (#272) ([ac53d8f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ac53d8f)), closes [#272](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/272)





## 1.2.0 (2021-07-14)

* docs(all-services): fix readme of all services (#245) ([b8937fa](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b8937fa)), closes [#245](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/245) [#211](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/211)
* feat(authentication-service): apple-oauth2 (#243) ([98fdb0f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/98fdb0f)), closes [#243](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/243)
* feat(authentication-service): facebook oauth added (#247) ([3c3cae8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3c3cae8)), closes [#247](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/247)
* perf(all services): added security property in all the controllers an… (#232) ([e37a5a1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e37a5a1)), closes [#232](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/232)





## 1.1.0 (2021-06-14)

* fix(core): all packages updated (#214) ([8f15aaa](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8f15aaa)), closes [#214](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/214)
* fix(core): open api docs update ([9b7cb69](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9b7cb69)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(video-conferencing-service): fixed missing exports (#220) ([5baf4af](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5baf4af)), closes [#220](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/220) [#219](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/219)
* feat(user-onboarding): base code for user-onboarding lib (#203) ([8d4d19b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8d4d19b)), closes [#203](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/203)
* docs: add openapi spec docs in examples and improve the docs in services (#215) ([baec0f1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/baec0f1)), closes [#215](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/215)





## <small>1.0.1 (2021-05-19)</small>

* fix(notification-service): adds PATCH notification APIs (#213) ([2c20508](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/2c20508)), closes [#213](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/213)





## 1.0.0 (2021-05-12)

**Note:** Version bump only for package @sourceloop/notification-service





## 1.0.0-alpha.36 (2021-05-12)

* fix(authentication-service): fixed auto-migration issue in all services (#184) ([dd7bea2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/dd7bea2)), closes [#184](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/184)
* fix(authentication-service): fixed env defaults issues in migrations (#185) ([6f1ef17](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/6f1ef17)), closes [#185](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/185)
* fix(authentication-service): fixed version of loopback packages in all services (#191) ([7eb9a60](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7eb9a60)), closes [#191](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/191)
* fix(authentication-service): moved db-migrate to dev dependencies (#180) ([7b11068](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7b11068)), closes [#180](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/180)
* feat(in-mail-service): added migration in all services (#179) ([10aa077](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/10aa077)), closes [#179](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/179) [#124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/124)
* feat(sandbox): added video conferencing example (#178) ([6d77c9a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/6d77c9a)), closes [#178](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/178)


### BREAKING CHANGE

* need to add env in existing projects to skip auto-migrations




# [1.0.0-alpha.35](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.34...@sourceloop/notification-service@1.0.0-alpha.35) (2021-03-17)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.34](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.33...@sourceloop/notification-service@1.0.0-alpha.34) (2021-02-06)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.33](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.32...@sourceloop/notification-service@1.0.0-alpha.33) (2021-02-04)


### Bug Fixes

* **notification-service:** hard deleting notif users for gdpr compliance ([#117](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/117)) ([af33640](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/af33640203a8c7029b7e0b52a44361c1f630ba0a))





# [1.0.0-alpha.32](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.31...@sourceloop/notification-service@1.0.0-alpha.32) (2021-02-01)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.31](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.30...@sourceloop/notification-service@1.0.0-alpha.31) (2021-01-30)


### Features

* **notification-service:** adds delete APIs for notification and notification users ([#115](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/115)) ([2462bd6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/2462bd6f214726224257a1382f75df470db623c1))





# [1.0.0-alpha.30](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.29...@sourceloop/notification-service@1.0.0-alpha.30) (2021-01-19)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.29](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.28...@sourceloop/notification-service@1.0.0-alpha.29) (2020-12-30)

**Note:** Version bump only for package @sourceloop/notification-service





# [1.0.0-alpha.28](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/notification-service@1.0.0-alpha.27...@sourceloop/notification-service@1.0.0-alpha.28) (2020-12-30)


### Bug Fixes

* **notification-service:** update method to fetch user id for notification user ([#111](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/111)) ([26246d7](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/26246d75c51875c8e854b596f0399b078dc593d7))





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
