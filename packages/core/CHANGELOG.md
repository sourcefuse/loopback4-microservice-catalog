# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 17.0.0 (2025-07-23)

* fix(authentication-service):  added cache layer to the jwks implementation (#2241) ([b90e01d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b90e01d)), closes [#2241](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2241)


### BREAKING CHANGE

* issue-2034




## 16.2.0 (2025-07-14)

* feat(core): update model schema booters (#2291) ([de73478](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/de73478)), closes [#2291](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2291) [#86](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/86) [#86](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/86) [#86](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/86) [#86](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/86) [#86](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/86) [#86](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/86) [#86](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/86)





## 16.1.0 (2025-07-04)

* feat(core): add helper function for override schema of models (#2284) ([4424278](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4424278)), closes [#2284](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2284) [#86](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/86)





## <small>16.0.1 (2025-07-03)</small>

* refactor(chore): fix sonarqube issues (#2288) ([3dc9655](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3dc9655)), closes [#2288](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2288) [#2287](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2287)





## 16.0.0 (2025-06-11)

* refactor(chore): standardize node version to >=20 (#2263) ([0c9e42e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/0c9e42e)), closes [#2263](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2263) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260)
* fix(all-services): sonar issues (#2253) ([f2102cb](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f2102cb)), closes [#2253](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2253) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252)


### BREAKING CHANGE

* node version 18 is no longer supported
* node version 18 is no longer supported
* node version 18 is no longer supported
* node version 18 is no longer supported
* node vesion 18 is no longer supported




## <small>15.0.2 (2025-01-07)</small>

* chore(deps): version update (#2227) ([6d6b00e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/6d6b00e)), closes [#2227](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2227)
* fix(all-services): refactor test case of auth service core and notification service (#2230) ([9e30892](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9e30892)), closes [#2230](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2230)





## <small>15.0.1 (2024-12-20)</small>

* fix(deps): add node-jose dependecy in core , task-service and user-tenant service (#2228) ([5a37a10](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5a37a10)), closes [#2228](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2228) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* chore(cli): update template dependencies of cli (#2222) ([597f05d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/597f05d)), closes [#2222](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2222)





## 15.0.0 (2024-12-05)

* fix(authentication-service):  added idp server controller for login and discovery endpoint (#2131) ([e1bba2c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e1bba2c)), closes [#2131](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2131)


### BREAKING CHANGE

* * feat(authentication-service): added the logic for rotation of keys with database

2034

* feat(authentication-service):  added final changes for idp server

MIGRATION CHANGE:
migration-20241105074844-
* JWT Asymmetric Signer and Verifier will be served from Database only. File support has been removed.

2034




## <small>14.2.3 (2024-10-22)</small>

* fix(core): revert the changes of 2158 (#2181) ([1307aa0](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/1307aa0)), closes [#2181](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2181) [#2158](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2158)





## <small>14.2.2 (2024-10-16)</small>

* chore(ci-cd): resolve sonar issues (#2179) ([12ec556](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/12ec556)), closes [#2179](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2179) [#2177](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2177) [#2177](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2177)





## <small>14.2.1 (2024-09-30)</small>

* fix(core): add condition to set locale for error message (#2169) ([8c532db](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8c532db)), closes [#2169](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2169) [#2168](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2168)





## 14.2.0 (2024-09-30)

* feat(authentication-service): add the implementation of auth0 strategy (#2164) ([ba0752d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ba0752d)), closes [#2164](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2164) [#2163](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2163) [#2163](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2163)





## <small>14.1.2 (2024-09-26)</small>

* fix(core): createdon modifiedon can not be changed via input (#2159) ([411dd76](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/411dd76)), closes [#2159](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2159) [#2158](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2158) [#2158](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2158) [#2158](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2158)
* fix(core): updated condition to set i18n localization (#2166) ([0aeb985](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/0aeb985)), closes [#2166](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2166) [#2165](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2165)





## <small>14.1.1 (2024-08-05)</small>

* chore(all-services): ping api in sandbox examples (#2134) ([b69cda1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b69cda1)), closes [#2134](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2134) [#2133](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2133) [#2133](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2133)
* fix(deps): fix sonar issues (#2127) ([f226bc7](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f226bc7)), closes [#2127](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2127)





## 14.1.0 (2024-06-11)

* chore(deps): loopback and sourceloop version update (#2108) ([9cd8962](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9cd8962)), closes [#2108](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2108) [#2104](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2104) [#2104](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2104)
* chore(deps): version bump commit (#2111) ([c87bc75](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c87bc75)), closes [#2111](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2111) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)
* feat(user-tenant-service): add user webhook to seed data in db (#2093) ([2c6277c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/2c6277c)), closes [#2093](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2093) [#5](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/5)





## 14.0.0 (2024-05-06)

* feat(ci-cd): changes to release only core (#2086) ([639e07e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/639e07e)), closes [#2086](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2086) [#2030](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2030) [#2030](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2030) [#2030](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2030)
* feat(core): added dynamic tenant connector (#1953) ([ef32c05](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ef32c05)), closes [#1953](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1953) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#9122](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/9122) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922) [#1922](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1922)
* feat(core): update core package to use asymmetric token verification by default (#2078) ([756d956](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/756d956)), closes [#2078](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2078) [#2077](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2077)
* feat(core): update package version to manually release only core ([94a5f28](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/94a5f28))
* feat(task-service): Added patch api in task service to update any task. (#2033) ([12707b9](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/12707b9)), closes [#2033](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2033) [#2032](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2032)


### BREAKING CHANGE

* Rather than symmetric ,asymmetric provider will be implemented by default
* since breaking change
* since breaking change
* since this is a breaking chnage




## 13.1.0 (2024-04-05)

* feat(authentication-service): enable tenant aware metrics (#2044) ([e67280d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e67280d)), closes [#2044](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2044) [#1980](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1980) [#1980](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1980)
* feat(core): add tenant utilities config related to issue gh 1942 (#2063) ([e68c34e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e68c34e)), closes [#2063](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2063) [#1942](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1942)





## 13.0.0 (2024-03-26)

* feat(deps): update template dependencies (#2047) ([75fc35e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/75fc35e)), closes [#2047](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2047) [#2045](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2045) [#2045](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2045)


### BREAKING CHANGE

* loopback and sourceloop versions update
* major version updates




## 12.1.0 (2024-03-20)

* feat(core): add provision in logs to save tenant information (#1967) ([e079034](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e079034)), closes [#1967](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1967) [#1918](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1918) [#1918](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1918) [#1918](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1918) [#1918](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1918)





## 12.0.0 (2024-03-12)

* feat(core): generate application logs in proper format (#2015) ([8b784be](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8b784be)), closes [#2015](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2015) [#1918](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1918) [#1918](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1918) [#1918](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1918) [#1918](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1918) [#1918](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1918)
* feat(sandbox): added example for user tenant service (#2024) ([9356678](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9356678)), closes [#2024](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2024) [#1954](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1954) [#1954](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1954) [#1954](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1954) [#1954](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1954)
* fix(all-services): fix sonar issues in all services (#2018) ([33dfa77](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/33dfa77)), closes [#2018](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2018) [#2013](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2013)
* chore(all-services): sonar fix (#2014) ([55c5b02](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/55c5b02)), closes [#2014](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2014) [#2013](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2013) [#2013](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2013)





## <small>11.0.3 (2024-02-02)</small>

* chore(deps): update authentication component version in all services (#1962) ([eeac7f6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/eeac7f6)), closes [#1962](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1962) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)





## <small>11.0.2 (2024-01-19)</small>

* chore(deps): update sourceloop and loopback packages version (#1928) ([d9d1b20](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d9d1b20)), closes [#1928](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1928) [#1903](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1903)
* docs(core): update the docs to write about hiding apis (#1911) ([a243dd0](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a243dd0)), closes [#1911](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1911) [#1910](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1910)
* fix(video-conferencing-service): fixed archiving issue while creating session (#1892) ([03624a8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/03624a8)), closes [#1892](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1892) [#1822](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1822) [#1822](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1822) [#1822](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1822)





## <small>11.0.1 (2024-01-09)</small>

* revert(all-services): revert the extra checks added for createall method (#1890) ([93f41dd](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/93f41dd)), closes [#1890](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1890) [#1124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1124)





## 11.0.0 (2024-01-01)

* feat(all-services): add additional check for createAll method (#1881) ([9b51bc3](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9b51bc3)), closes [#1881](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1881) [#1124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1124)


### BREAKING CHANGE

* if the array is not passed for createall error will be thrown




## 10.1.0 (2023-12-22)

* feat(core): add sequelize tenant guard in sourceloop core (#1854) ([71ff143](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/71ff143)), closes [#1854](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1854) [#1838](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1838)





## 10.0.0 (2023-12-07)

* feat(deps): update to latest loopback 4 authentication version (#1826) ([5b827fc](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5b827fc)), closes [#1826](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1826) [#1825](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1825) [#1825](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1825)


### BREAKING CHANGE

* breaking version update
* optional dependencies need to bind required providers




## 9.0.0 (2023-12-07)

* feat(chat-service): add sequelize support in chat service (#1823) ([ecb9b65](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ecb9b65)), closes [#1823](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1823) [#1350](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1350)
* feat(chore): migrate to use npm workspaces (#1684) ([72d8f6e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/72d8f6e)), closes [#1684](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1684) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673)


### BREAKING CHANGE

* lerna bootstrap command will not be supported
* lerna bootstrap command will not be supported
* lerna bootstrap command will not be supported
* lerna bootstrap will not be supported
* lerna bootstrap will not be supported




## 8.2.0 (2023-10-05)

* refactor(all-services): remove redundant `posttest` script (#1677) ([4b252cf](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4b252cf)), closes [#1677](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1677) [#1657](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1657)
* feat(core): add ProxyBuilder component in core (#1680) ([24dd9c6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/24dd9c6)), closes [#1680](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1680) [#1679](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1679) [#1679](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1679)





## 8.1.0 (2023-09-01)

* [Snyk] Upgrade tslib from 2.6.0 to 2.6.1 (#1606) ([f65b2d3](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f65b2d3)), closes [#1606](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1606)
* refactor(deps): remove explicit dependency of casbin in core (#1661) ([8d0b078](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8d0b078)), closes [#1661](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1661) [#1658](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1658)
* feat(core): add ability alter the paths definition received by swagger stats (#1655) ([d5c841e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d5c841e)), closes [#1655](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1655) [#1613](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1613)





## <small>8.0.5 (2023-08-10)</small>

* fix(core): move `findRoute` to the top in SecureSequence (#1601) ([a751e65](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a751e65)), closes [#1601](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1601) [#1600](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1600)





## <small>8.0.4 (2023-07-28)</small>

* refactor(chore): remove useless constructors in all services (#1577) ([8df9f0d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8df9f0d)), closes [#1577](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1577)





## <small>8.0.3 (2023-07-18)</small>

* fix(core): add ratelimit action on OBF path (#1548) ([9c42a9b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9c42a9b)), closes [#1548](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1548) [#1546](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1546)
* chore(deps): sourceloop and loopback version updates (#1552) ([7010428](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7010428)), closes [#1552](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1552) [#1436](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1436) [#1436](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1436)





## <small>8.0.2 (2023-07-11)</small>

* chore(deps): combine snyk updates (#1529) ([098799b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/098799b)), closes [#1529](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1529)
* chore(deps): package lock upgrade (#1519) ([5aaddbf](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5aaddbf)), closes [#1519](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1519)





## <small>8.0.1 (2023-06-10)</small>

* fix(core): use swagger-stats@0.99.5 statically ([49374ba](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/49374ba)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## 8.0.0 (2023-06-08)

* chore(deps): update loopback and sourceloop versions (#1437) ([fafdfd8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/fafdfd8)), closes [#1437](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1437) [#1436](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1436) [#1436](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1436)
* feat(chore): remove support for node v14,v12 (#1411) ([eda2051](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/eda2051)), closes [#1411](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1411) [#1382](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1382)
* refactor(all-services): remove empty and unnecessary folder (#1423) ([15c8235](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/15c8235)), closes [#1423](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1423)


### BREAKING CHANGE

* End of life of node v14 and node v12




## 7.5.0 (2023-05-11)

* docs(core): remove repetitive loopback logo and title names ([7cc6247](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7cc6247))
* feat(core): prevent cross tenant operation across a… (#1374) ([98eeead](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/98eeead)), closes [#1374](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1374) [#1373](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1373) [#1373](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1373)





## <small>7.4.3 (2023-05-03)</small>

* refactor(all-services): add support for node 18 (#1380) ([c195255](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c195255)), closes [#1380](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1380) [#1359](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1359)
* refactor(chore): fix sonar code smells (#1402) ([9244178](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9244178)), closes [#1402](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1402)
* chore(all-services): update license and copyright headers (#1405) ([7493640](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7493640)), closes [#1405](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1405)





## <small>7.4.2 (2023-04-27)</small>

* chore(deps): Loopback and sourceloop version update (#1393) ([ef40a1d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ef40a1d)), closes [#1393](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1393) [#1392](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1392)





## <small>7.4.1 (2023-03-15)</small>

* chore(deps): loopback and sourceloop packages version update (#1348) ([d823ea4](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d823ea4)), closes [#1348](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1348) [#1346](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1346) [#1346](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1346)





## 7.4.0 (2023-03-06)

* feat(core): add user modify crud repository for sequelize (#1330) ([f22d81e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f22d81e)), closes [#1330](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1330) [#1329](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1329)
* chore(deps): loopback and sourceloop version update (#1332) ([39e1f7a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/39e1f7a)), closes [#1332](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1332) [#1331](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1331)





## <small>7.3.6 (2023-02-01)</small>

* chore(cli): update the cli template dependencies to the latest (#1262) ([b44c542](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b44c542)), closes [#1262](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1262) [#1261](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1261)





## <small>7.3.5 (2023-01-31)</small>

* chore(deps): updating the loopback4-authentication package (#1260) ([99887d6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/99887d6)), closes [#1260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1260) [#1259](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1259) [#1259](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1259)





## <small>7.3.4 (2023-01-20)</small>

* fix(core): add facade bearer asymmetric token verifier provider (#1216) ([90c67d8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/90c67d8)), closes [#1216](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1216) [#1212](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1212)





## <small>7.3.3 (2023-01-17)</small>

* chore(deps): loopback and sourceloop version update (#1211) ([3086a5b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3086a5b)), closes [#1211](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1211) [#1206](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1206)
* docs(core): add mkdocs and typedoc configuration (#1193) ([4b348b1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4b348b1)), closes [#1193](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1193) [#1192](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1192)





## <small>7.3.2 (2023-01-12)</small>

* chore(deps): loopback and sourceloop version update (#1195) ([ea9bb21](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ea9bb21)), closes [#1195](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1195) [#1194](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1194) [#1194](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1194)





## <small>7.3.1 (2022-12-07)</small>

* chore(deps): update loopback and sourceloop packages (#1101) ([fc6b432](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/fc6b432)), closes [#1101](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1101) [#1100](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1100)





## 7.3.0 (2022-11-25)

* chore(deps): loopback version update in services and packages (#1086) ([478668a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/478668a)), closes [#1086](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1086)
* feat(authentication-service): add asymmetric login in authentication service (#1011) ([92c21fb](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/92c21fb)), closes [#1011](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1011) [#1007](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1007)
* feat(core): add base-entity and user-modifiable-entity mixins (#815) ([ba57053](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ba57053)), closes [#815](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/815) [#814](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/814) [#814](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/814)
* docs(ReadMe): update readme file for sourceloop core (#970) ([3779351](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3779351)), closes [#970](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/970) [#254](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/254)
* fix(services): sync user-tenant-service properties with auth-service (#1010) ([5c7fce8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5c7fce8)), closes [#1010](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1010)





## <small>7.2.6 (2022-10-10)</small>

* fix(core): IP address issue in RateLimitKeyGen (#1040) ([2c9c8d8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/2c9c8d8)), closes [#1040](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1040) [#1039](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1039)





## <small>7.2.5 (2022-09-26)</small>

* fix(core): change parent class of DefaultTransactionalUserModifyRepository (#1034) ([55794ab](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/55794ab)), closes [#1034](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1034) [#1031](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1031)





## <small>7.2.4 (2022-09-21)</small>

* chore(deps): update loopback4-soft-delete version in core (#1029) ([99b119c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/99b119c)), closes [#1029](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1029) [#1026](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1026)





## <small>7.2.3 (2022-09-20)</small>

* chore(deps): update loopback4-soft-delete version in core (#1027) ([ccaa55a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ccaa55a)), closes [#1027](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1027) [#1026](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1026)





## <small>7.2.2 (2022-09-12)</small>

* chore(deps): loopback version update (#1014) ([b74f9f6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b74f9f6)), closes [#1014](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1014) [#1013](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1013)





## <small>7.2.1 (2022-09-02)</small>

* chore(deps): fixing typescript version for cli (#1005) ([9e561f2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9e561f2)), closes [#1005](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1005) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)





## 7.2.0 (2022-09-02)

* feat(deps): updated for minor update in loopback4 (#1003) ([b04ebad](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b04ebad)), closes [#1003](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1003) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## <small>7.1.3 (2022-08-30)</small>

* chore(deps): ignore angular libraries for release (#998) ([f2a8e8c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f2a8e8c)), closes [#998](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/998) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)





## <small>7.1.2 (2022-08-26)</small>

* build(packages): versions update in packages (#979) ([149edf7](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/149edf7)), closes [#979](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/979) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## <small>7.1.1 (2022-07-27)</small>

* chore(core): update license, add copywrite to all ts files (#794) ([8753452](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8753452)), closes [#794](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/794) [#754](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/754)





## 7.1.0 (2022-07-11)

* chore(deps): fix vulnerability (#895) ([53004c0](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/53004c0)), closes [#895](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/895) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)
* feat(feature-toggle-service): remove everything except controllers (#858) ([f7802fb](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f7802fb)), closes [#858](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/858) [#843](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/843) [#843](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/843) [#843](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/843)





## <small>7.0.4 (2022-06-30)</small>

* chore(deps): update lb4 dependencies (#844) ([535ba19](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/535ba19)), closes [#844](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/844)
* perf(chore): sonar issues fix (#859) ([9adb36d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9adb36d)), closes [#859](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/859) [#856](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/856) [#856](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/856) [#856](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/856)





## <small>7.0.3 (2022-06-24)</small>

* perf(chore): sonar fixes (#847) ([910cf95](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/910cf95)), closes [#847](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/847) [#845](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/845)





## <small>7.0.2 (2022-05-30)</small>

* chore(deps): update loopback4-authorization in all services (#813) ([44d8e67](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/44d8e67)), closes [#813](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/813) [#754](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/754)





## <small>7.0.1 (2022-05-27)</small>

* chore(deps): changes for release (#809) ([e1a3490](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e1a3490)), closes [#809](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/809) [#808](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/808)





## 7.0.0 (2022-05-27)

* chore(deps): update all lb4 dependencies (#805) ([572f7ae](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/572f7ae)), closes [#805](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/805) [#754](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/754) [#754](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/754)


### BREAKING CHANGE

* 




## <small>6.1.6 (2022-05-26)</small>

* fix(core): fix swagger auth verifier key (#803) ([60a2559](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/60a2559)), closes [#803](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/803)





## <small>6.1.5 (2022-05-09)</small>

* chore(deps): bump ejs from 3.1.6 to 3.1.7 in /packages/core (#760) ([0c80a67](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/0c80a67)), closes [#760](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/760)
* chore(deps): package lock update after sourceloop core release ([897af0a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/897af0a)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* style(authentication-service): remove eslint disable naming convention and repalce with constants (# ([a87b5b2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a87b5b2)), closes [#730](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/730) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(authentication-service): fix error messages in providers (#732) ([96cb609](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/96cb609)), closes [#732](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/732) [#688](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/688)





## <small>6.1.4 (2022-04-20)</small>

* chore(deps): bump moment from 2.29.1 to 2.29.2 in /packages/core (#648) ([8fb5e34](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8fb5e34)), closes [#648](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/648)
* chore(deps): update all deps to latest version and solve security vulnerabilities (#689) ([30ee331](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/30ee331)), closes [#689](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/689)





## <small>6.1.3 (2022-03-30)</small>

* chore(core): locale file ([e0ceab9](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e0ceab9)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(core): allow all swagger stats config ([56038ea](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/56038ea)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## <small>6.1.2 (2022-03-06)</small>

* fix(chore): update package dependencies to latest version (#577) ([bb04c18](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bb04c18)), closes [#577](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/577)





## <small>6.1.1 (2022-02-13)</small>

* fix(cli): make cli publishable ([a4568d2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a4568d2)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## 6.1.0 (2022-01-28)

* fix(core): deps incorrect ([fc7665a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/fc7665a)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* feat(core): add component to authenticate swagger ui access (#467) ([40f669f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/40f669f)), closes [#467](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/467)





## 6.0.0 (2022-01-16)

* docs(core): locale file update and add to ignore ([4bbdae2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4bbdae2)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(authentication-service): change response of signup and forget password (#459) ([9ab48c1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9ab48c1)), closes [#459](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/459) [#457](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/457)


### BREAKING CHANGE

* removed response body and changed response code of signup-token and forget-password apis




## <small>5.0.1 (2021-12-26)</small>

* fix(core): fix versions in package locks and update references in tsconfig ([36b563e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/36b563e)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## 5.0.0 (2021-12-26)

* feat(core): add support for node.js v17 and upgrade to @loopback/cli v3 ([4115b6c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4115b6c)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(docs): add badge for node and npm version ([caaa1bd](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/caaa1bd))


### BREAKING CHANGE

* drop support for node.js v10




## 4.0.0 (2021-12-17)

* fix(core): upgrade all deps (#438) ([c52b7f1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c52b7f1)), closes [#438](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/438)
* fix(docs): added badges ([a66ed14](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a66ed14))


### BREAKING CHANGE

* bump major versions




## 3.2.0 (2021-11-11)

* feat(hidden-api): adds hidden-api feature (#143) (#364) ([bdd8fc8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bdd8fc8)), closes [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#364](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/364) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143) [#143](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/143)





## <small>3.1.2 (2021-11-09)</small>

* chore(deps): bump validator from 13.6.0 to 13.7.0 in /packages/core (#405) ([f0d3963](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f0d3963)), closes [#405](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/405)





## <small>3.1.1 (2021-10-24)</small>

* fix(bpmn-service): fix description missing in model but present in migrations (#343) ([bde58f7](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bde58f7)), closes [#343](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/343) [#340](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/340) [#340](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/340)
* fix(core): add new HTTP status codes (#342) ([736ee28](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/736ee28)), closes [#342](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/342)
* fix(core): changed userId to userTenantId (#335) ([07c7e04](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/07c7e04)), closes [#335](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/335) [#329](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/329)
* fix(core): fix all version problems ([7847008](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7847008)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(core): fix linting issue in core (#348) ([6912bc2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/6912bc2)), closes [#348](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/348) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* docs(core): correcting the typing mistake (#385) ([b1d4255](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b1d4255)), closes [#385](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/385)
* chore(deps): bump passport-oauth2 from 1.6.0 to 1.6.1 in /packages/core (#368) ([814fb37](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/814fb37)), closes [#368](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/368)





## 3.0.0 (2021-09-12)

* fix(core): add prom client installation step in core readme (#284) ([f7f93e2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f7f93e2)), closes [#284](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/284) [#282](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/282)
* fix(core): missing open api and package lock files ([3bd9686](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3bd9686)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* feat(sandbox): example of pubnub as a provider in notification service (#279) ([e30a0ed](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e30a0ed)), closes [#279](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/279) [#208](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/208) [#208](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/208) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0) [#278](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/278) [#211](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/211) [#263](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/263) [#280](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/280) [#208](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/208) [#208](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/208) [#298](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/298) [#208](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/208) [#263](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/263) [#280](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/280) [#208](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/208) [#208](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/208)





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
