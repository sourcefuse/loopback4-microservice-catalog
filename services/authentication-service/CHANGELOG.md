# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## <small>21.0.1 (2025-07-03)</small>

* refactor(chore): fix sonarqube issues (#2288) ([3dc9655](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3dc9655)), closes [#2288](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2288) [#2287](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2287)





## 21.0.0 (2025-06-11)

* refactor(chore): standardize node version to >=20 (#2263) ([0c9e42e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/0c9e42e)), closes [#2263](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2263) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260) [#2260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2260)
* fix(all-services): sonar issues (#2253) ([f2102cb](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f2102cb)), closes [#2253](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2253) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252) [#2252](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2252)


### BREAKING CHANGE

* node version 18 is no longer supported
* node version 18 is no longer supported
* node version 18 is no longer supported
* node version 18 is no longer supported
* node vesion 18 is no longer supported




## <small>20.0.3 (2025-03-21)</small>

* fix(authentication-service): update the logout keycloak url (#2248) ([1016fcb](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/1016fcb)), closes [#2248](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2248)





## <small>20.0.2 (2025-01-07)</small>

* chore(deps): version update (#2227) ([6d6b00e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/6d6b00e)), closes [#2227](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2227)
* fix(all-services): refactor test case of auth service core and notification service (#2230) ([9e30892](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9e30892)), closes [#2230](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2230)





## <small>20.0.1 (2024-12-20)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## 20.0.0 (2024-12-05)

* refactor(authentication-service): update urls and add scope for keycloak idp (#2176) ([5f83920](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5f83920)), closes [#2176](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2176) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(authentication-service):  added idp server controller for login and discovery endpoint (#2131) ([e1bba2c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e1bba2c)), closes [#2131](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2131)


### BREAKING CHANGE

* * feat(authentication-service): added the logic for rotation of keys with database

2034

* feat(authentication-service):  added final changes for idp server

MIGRATION CHANGE:
migration-20241105074844-
* JWT Asymmetric Signer and Verifier will be served from Database only. File support has been removed.

2034
* yes

0

* docs(authentication-service): update readme for keycloak url changes

update readme for keycloak url changes
* yes

47

* refactor(authentication-service): add realm to kecloak host env

add realm to kecloak host env




## 19.3.0 (2024-11-22)

* docs(all-services): add arc branding and improve documentation (#2210) ([34feaf9](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/34feaf9)), closes [#2210](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2210) [#1440](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1440) [#1440](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1440) [#1440](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1440) [#1440](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1440)
* feat(all-services): Automate Migration Execution on Installation with Optional MySQL or PostgreSQL M ([8b066bb](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8b066bb)), closes [#2209](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2209)
* fix(all-services): update migration.js to run migration on post install (#2203) ([83dc724](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/83dc724)), closes [#2203](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2203)
* fix(authentication-service): terminate JWT token  (#2212) ([e34e826](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e34e826)), closes [#2212](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2212) [#2167](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2167) [#2167](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2167) [#2167](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2167)





## <small>19.2.3 (2024-10-22)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>19.2.2 (2024-10-16)</small>

* fix(authentication-service): add condition to set locale for error me… (#2174) ([72ee7a0](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/72ee7a0)), closes [#2174](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2174) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* chore(ci-cd): resolve sonar issues (#2179) ([12ec556](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/12ec556)), closes [#2179](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2179) [#2177](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2177) [#2177](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2177)





## <small>19.2.1 (2024-09-30)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## 19.2.0 (2024-09-30)

* feat(authentication-service): add the implementation of auth0 strategy (#2164) ([ba0752d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ba0752d)), closes [#2164](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2164) [#2163](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2163) [#2163](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2163)





## <small>19.1.5 (2024-09-26)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>19.1.4 (2024-08-05)</small>

* chore(all-services): ping api in sandbox examples (#2134) ([b69cda1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b69cda1)), closes [#2134](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2134) [#2133](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2133) [#2133](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2133)





## <small>19.1.3 (2024-06-11)</small>

* chore: publish release ([89d1599](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/89d1599))
* chore(deps): loopback and sourceloop version update (#2108) ([9cd8962](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9cd8962)), closes [#2108](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2108) [#2104](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2104) [#2104](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2104)
* chore(deps): version bump commit (#2111) ([c87bc75](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c87bc75)), closes [#2111](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2111) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)
* fix(all-services): revert to pr 2072 (#2106) ([502812f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/502812f)), closes [#2106](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2106) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## <small>19.1.2 (2024-06-10)</small>

* fix(all-services): revert to pr 2072 (#2106) ([502812f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/502812f)), closes [#2106](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2106) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## <small>19.1.1 (2024-06-04)</small>

* fix(authentication-service): fix verify otp flow for mfa (#2100) ([374ddd0](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/374ddd0)), closes [#2100](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2100) [#2099](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2099)





## 19.1.0 (2024-05-20)

* chore(all-services): sonar fixes (#2096) ([7f958bb](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7f958bb)), closes [#2096](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2096) [#2095](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2095)
* feat(all-services): Follow solid for repositories in all services (#2072) ([82c934b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/82c934b)), closes [#2072](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2072) [#2037](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2037)





## 19.0.0 (2024-05-07)

* feat(all-services): update core package in all services (#2091) ([8b1703f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8b1703f)), closes [#2091](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2091) [#2077](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2077) [#2077](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2077)
* feat(authentication-service): make asymmetric encryption of the token default (#2076) ([6b78867](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/6b78867)), closes [#2076](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2076) [#2030](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2030) [#2030](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2030)
* chore(ci-cd): reverting release changes all services to be released at once (#2090) ([0b25fe4](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/0b25fe4)), closes [#2090](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2090) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)
* refactor(authentication-service): deprecate login token two in one api (#2068) ([db2bc6e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/db2bc6e)), closes [#2068](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2068) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)


### BREAKING CHANGE

* Config has to be provided to use symmetric encrytion
* update the core major version
* Updated core package




## 18.1.0 (2024-04-05)

* feat(authentication-service): enable tenant aware metrics (#2044) ([e67280d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e67280d)), closes [#2044](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2044) [#1980](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1980) [#1980](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1980)





## 18.0.0 (2024-04-02)

* fix(authentication-service): change the random fields from varchar to text (#2062) ([3213093](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3213093)), closes [#2062](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2062) [#2036](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2036)





## 17.0.0 (2024-03-26)

* feat(authentication-service): filtering option in activity logs (#2049) ([aa60b14](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/aa60b14)), closes [#2049](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2049) [#1517](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1517) [#1517](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1517) [#1517](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1517) [#1517](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1517)
* feat(authentication-service): implement configurable hashing (#2048) ([d849562](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d849562)), closes [#2048](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2048) [#2038](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2038) [#2038](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2038) [#2038](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2038)
* feat(deps): update template dependencies (#2047) ([75fc35e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/75fc35e)), closes [#2047](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2047) [#2045](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2045) [#2045](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2045)


### BREAKING CHANGE

* loopback and sourceloop versions update
* major version updates




## <small>16.0.4 (2024-03-20)</small>

* fix(authentication-service):provide support to manage tokens for user logging in and logging out via ([c19cc9d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c19cc9d)), closes [#1943](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1943) [#1924](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1924) [#1939](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1939)
* fix(authentication-service): provide support to manage tokens for user logging in via Azure (#1925) ([1c9a713](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/1c9a713)), closes [#1925](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1925) [#1924](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1924) [#1924](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1924) [#1924](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1924)





## <small>16.0.3 (2024-03-12)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>16.0.2 (2024-03-06)</small>

* fix(all-services): fix the pending sonar issues in all services (#2025) ([b2f6dc3](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b2f6dc3)), closes [#2025](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2025) [#2013](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2013)
* fix(authentication-service): remove extra env for keycloack (#2016) ([780175c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/780175c)), closes [#2016](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2016) [#2011](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2011)
* docs(all-services): update services readme (#2000) ([93a7f91](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/93a7f91)), closes [#2000](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2000)





## <small>16.0.1 (2024-02-02)</small>

* fix(cli): proper error message when microservice command not run from root folder (#1961) ([3ea4325](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3ea4325)), closes [#1961](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1961) [#1956](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1956)
* chore(deps): update authentication component version in all services (#1962) ([eeac7f6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/eeac7f6)), closes [#1962](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1962) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)





## 16.0.0 (2024-02-01)

* refactor(authentication-service): remove current user requirement fro… (#1958) ([3974acf](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3974acf)), closes [#1958](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1958) [#1957](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1957)
* fix(authentication-service): export all artifacts of modules from root (#1951) ([d842b81](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d842b81)), closes [#1951](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1951) [#1950](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1950)


### BREAKING CHANGE

* current user is not required in repository
* this will affect the projects where imports are from dist




## 15.0.0 (2024-01-23)

* fix(authentication-service): missing exports in modules (#1940) ([9a0ae6f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9a0ae6f)), closes [#1940](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1940) [#1935](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1935)
* fix(authentication-service): sync the models of auth and user tenant service (#1913) ([c3a15b0](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c3a15b0)), closes [#1913](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1913) [#1899](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1899) [#1899](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1899) [#1899](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1899) [#1899](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1899) [#1899](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1899)





## <small>14.1.2 (2024-01-19)</small>

* chore(deps): update sourceloop and loopback packages version (#1928) ([d9d1b20](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d9d1b20)), closes [#1928](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1928) [#1903](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1903)





## <small>14.1.1 (2024-01-09)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## 14.1.0 (2024-01-01)

* feat(authentication-service): provide support for authenticated issuance of access token using refre ([2afa6d8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/2afa6d8)), closes [#1877](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1877) [#1263](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1263) [#1263](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1263)





## 14.0.0 (2024-01-01)

* feat(authentication-service): add mysql db migrations (#1869) ([38ca2ea](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/38ca2ea)), closes [#1869](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1869) [#1836](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1836)
* fix(all-services): add sequelize as optional dependency (#1878) ([772b4f8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/772b4f8)), closes [#1878](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1878) [#1866](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1866)
* fix(all-services): change sequelize dependency to optional (#1868) ([bf3962f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bf3962f)), closes [#1868](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1868) [#1866](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1866)





## <small>13.0.1 (2023-12-22)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## 13.0.0 (2023-12-07)

* feat(deps): update to latest loopback 4 authentication version (#1826) ([5b827fc](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5b827fc)), closes [#1826](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1826) [#1825](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1825) [#1825](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1825)


### BREAKING CHANGE

* breaking version update
* optional dependencies need to bind required providers




## 12.1.0 (2023-12-07)

* feat(authentication-service): add sequelize support in authentication service (#1722) ([2f7a27a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/2f7a27a)), closes [#1722](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1722) [#1350](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1350) [#1350](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1350)





## 12.0.0 (2023-11-09)

* feat(chore): migrate to use npm workspaces (#1684) ([72d8f6e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/72d8f6e)), closes [#1684](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1684) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673) [#1673](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1673)


### BREAKING CHANGE

* lerna bootstrap command will not be supported
* lerna bootstrap command will not be supported
* lerna bootstrap command will not be supported
* lerna bootstrap will not be supported
* lerna bootstrap will not be supported




## 11.3.0 (2023-10-19)

* revert(cli): remove cdk flag from microservice command (#1721) ([bac0866](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bac0866)), closes [#1721](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1721) [#1710](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1710)
* feat(authentication-service): repositories now allow user to override model reference (#1720) ([88a64dd](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/88a64dd)), closes [#1720](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1720) [#1223](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1223)





## <small>11.2.6 (2023-10-05)</small>

* refactor(all-services): remove redundant `posttest` script (#1677) ([4b252cf](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4b252cf)), closes [#1677](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1677) [#1657](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1657)





## <small>11.2.5 (2023-09-01)</small>

* fix(authentication-service): change saml redirect api endpoint  (#1608) ([21dca33](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/21dca33)), closes [#1608](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1608) [#1607](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1607) [#1607](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1607)
* fix(deps): update loopback4-authentication version to latest (#1669) ([16df1a0](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/16df1a0)), closes [#1669](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1669) [#1668](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1668)
* refactor(all-services): fix sonar code smells (#1602) ([51f1cc3](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/51f1cc3)), closes [#1602](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1602)





## <small>11.2.4 (2023-08-10)</small>

* refactor(authentication-service): fix sonar code smell (#1598) ([48d7afc](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/48d7afc)), closes [#1598](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1598) [#1597](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1597)





## <small>11.2.3 (2023-08-09)</small>

* fix(authentication-service): submission of encrypted password in authentication service. (#1593) ([3dcee5c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3dcee5c)), closes [#1593](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1593) [#1592](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1592) [#1592](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1592)





## <small>11.2.2 (2023-07-28)</small>

* refactor(chore): remove useless constructors in all services (#1577) ([8df9f0d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8df9f0d)), closes [#1577](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1577)
* refactor(chore): resolve sonar smells (#1579) ([692aef8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/692aef8)), closes [#1579](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1579)





## <small>11.2.1 (2023-07-18)</small>

* chore(deps): sourceloop and loopback version updates (#1552) ([7010428](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7010428)), closes [#1552](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1552) [#1436](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1436) [#1436](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1436)





## 11.2.0 (2023-07-11)

* feat(cli): add lambda cdk module in authentication service along with option in cli (#1445) ([0200f20](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/0200f20)), closes [#1445](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1445) [#1532](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1532)
* chore(deps): package lock upgrade (#1519) ([5aaddbf](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5aaddbf)), closes [#1519](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1519)





## <small>11.1.2 (2023-06-19)</small>

* fix(chore): sonar code smells (#1453) ([01d64f2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/01d64f2)), closes [#1453](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1453)





## <small>11.1.1 (2023-06-10)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## 11.1.0 (2023-06-08)

* feat(authentication-service): maintain the entries for active users when a user login to the app (#1 ([0b6fa82](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/0b6fa82)), closes [#1425](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1425) [#1424](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1424)





## 11.0.0 (2023-06-08)

* chore(deps): update loopback and sourceloop versions (#1437) ([fafdfd8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/fafdfd8)), closes [#1437](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1437) [#1436](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1436) [#1436](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1436)
* feat(chore): remove support for node v14,v12 (#1411) ([eda2051](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/eda2051)), closes [#1411](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1411) [#1382](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1382)


### BREAKING CHANGE

* End of life of node v14 and node v12




## <small>10.0.4 (2023-06-07)</small>

* fix(authentication-service): fix refresh token api creating access token with default tenant id. (#1 ([1013b13](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/1013b13)), closes [#1431](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1431) [#1430](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1430)
* refactor(all-services): remove empty and unnecessary folder (#1423) ([15c8235](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/15c8235)), closes [#1423](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1423)





## <small>10.0.3 (2023-05-11)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>10.0.2 (2023-05-03)</small>

* refactor(all-services): add support for node 18 (#1380) ([c195255](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c195255)), closes [#1380](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1380) [#1359](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1359)
* refactor(chore): fix sonar code smells (#1402) ([9244178](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9244178)), closes [#1402](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1402)
* chore(all-services): update license and copyright headers (#1405) ([7493640](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7493640)), closes [#1405](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1405)





## <small>10.0.1 (2023-04-27)</small>

* chore(deps): Loopback and sourceloop version update (#1393) ([ef40a1d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ef40a1d)), closes [#1393](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1393) [#1392](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1392)





## 10.0.0 (2023-04-10)

* feat(authentication-service): added clientType column in auth client (#1357) ([aeb8bdc](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/aeb8bdc)), closes [#1357](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1357) [#1356](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1356) [#1356](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1356) [#1356](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1356)





## <small>9.1.1 (2023-03-15)</small>

* chore(deps): loopback and sourceloop packages version update (#1348) ([d823ea4](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d823ea4)), closes [#1348](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1348) [#1346](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1346) [#1346](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1346)





## 9.1.0 (2023-03-06)

* feat(authentication-service): add SAML passport authentication (#1326) ([c45f577](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c45f577)), closes [#1326](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1326)
* chore(deps): loopback and sourceloop version update (#1332) ([39e1f7a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/39e1f7a)), closes [#1332](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1332) [#1331](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1331)
* docs(authentication-service): update readme for authentication service (#1328) ([94b0139](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/94b0139)), closes [#1328](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1328) [#1327](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1327)





## <small>9.0.6 (2023-02-01)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>9.0.5 (2023-01-31)</small>

* chore(deps): updating the loopback4-authentication package (#1260) ([99887d6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/99887d6)), closes [#1260](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1260) [#1259](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1259) [#1259](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1259)





## <small>9.0.4 (2023-01-20)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>9.0.3 (2023-01-17)</small>

* chore(deps): loopback and sourceloop version update (#1211) ([3086a5b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3086a5b)), closes [#1211](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1211) [#1206](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1206)
* fix(authentication-service): fix sql syntax in migrations.  (#1205) ([2a1298b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/2a1298b)), closes [#1205](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1205) [#1204](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1204) [#1204](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1204)
* docs(core): add mkdocs and typedoc configuration (#1193) ([4b348b1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4b348b1)), closes [#1193](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1193) [#1192](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1192)





## <small>9.0.2 (2023-01-12)</small>

* chore(deps): loopback and sourceloop version update (#1195) ([ea9bb21](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ea9bb21)), closes [#1195](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1195) [#1194](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1194) [#1194](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1194)





## <small>9.0.1 (2022-12-07)</small>

* chore(deps): update loopback and sourceloop packages (#1101) ([fc6b432](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/fc6b432)), closes [#1101](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1101) [#1100](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1100)





## 9.0.0 (2022-11-25)

* feat(authentication-service): add asymmetric login in authentication service (#1011) ([92c21fb](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/92c21fb)), closes [#1011](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1011) [#1007](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1007)
* feat(authentication-service): feat(authentication-service): change parent class AuthClient (#1081) ([537cc75](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/537cc75)), closes [#1081](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1081)
* chore(deps): loopback version update in services and packages (#1086) ([478668a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/478668a)), closes [#1086](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1086)
* refactor(chore): fix sonar code smells (#1063) ([b4dee2c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b4dee2c)), closes [#1063](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1063) [#1052](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1052)





## 8.2.0 (2022-10-17)

* fix(services): sync user-tenant-service properties with auth-service (#1010) ([5c7fce8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5c7fce8)), closes [#1010](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1010)
* feat(authentication-service): add APIs for Cognito OAuth (#1046) ([190f96a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/190f96a)), closes [#1046](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1046) [#1045](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1045) [#1046](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1046)





## <small>8.1.8 (2022-10-10)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>8.1.7 (2022-09-26)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>8.1.6 (2022-09-21)</small>

* chore(deps): update loopback4-soft-delete version in services (#1030) ([d386bc1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d386bc1)), closes [#1030](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1030) [#1026](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1026)





## <small>8.1.5 (2022-09-21)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>8.1.4 (2022-09-20)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>8.1.3 (2022-09-12)</small>

* chore(deps): loopback version update for services (#1017) ([9a9d653](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9a9d653)), closes [#1017](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1017) [#1015](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1015)





## <small>8.1.2 (2022-09-12)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>8.1.1 (2022-09-02)</small>

* chore(deps): fixing typescript version for cli (#1005) ([9e561f2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9e561f2)), closes [#1005](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1005) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)





## 8.1.0 (2022-09-02)

* feat(deps): updated for minor update in loopback4 (#1003) ([b04ebad](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b04ebad)), closes [#1003](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/1003) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## <small>8.0.1 (2022-08-30)</small>

* chore(deps): ignore angular libraries for release (#998) ([f2a8e8c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f2a8e8c)), closes [#998](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/998) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)





## 8.0.0 (2022-08-26)

* fix(authentication-service): add all variables for azure oauth strategy (#990) ([920c6b6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/920c6b6)), closes [#990](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/990) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)
* fix(authentication-service): remove device info and auth clients from token (#992) ([880ef40](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/880ef40)), closes [#992](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/992) [#991](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/991)
* build(packages): versions update in packages (#979) ([149edf7](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/149edf7)), closes [#979](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/979) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)


### BREAKING CHANGE

* auth clients in user model made optional




## <small>7.1.2 (2022-08-20)</small>

* fix(authentication-service): fix minor issues in azure oauth (#985) ([af272a6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/af272a6)), closes [#985](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/985) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)
* fix(user-tenant-service): made user-tenant-service private (#986) ([03c5074](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/03c5074)), closes [#986](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/986) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* docs(authentication-service): readme changes for azure ad (#941) ([9dbe41b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9dbe41b)), closes [#941](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/941) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## <small>7.1.1 (2022-08-04)</small>

* fix(sandbox): email present in upn (#939) ([5a21a95](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5a21a95)), closes [#939](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/939) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)





## 7.1.0 (2022-08-04)

* feat(authentication-service): provide default implementation for azure ad (#932) ([6c6b488](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/6c6b488)), closes [#932](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/932) [#931](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/931) [#931](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/931) [#931](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/931) [#931](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/931)





## <small>7.0.5 (2022-07-27)</small>

* chore(core): update license, add copywrite to all ts files (#794) ([8753452](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8753452)), closes [#794](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/794) [#754](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/754)





## <small>7.0.4 (2022-07-11)</small>

* chore(deps): fix vulnerability (#895) ([53004c0](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/53004c0)), closes [#895](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/895) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00)





## <small>7.0.3 (2022-07-06)</small>

* chore: publish release ([3523386](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3523386))
* refactor(chore): fix sonar code smells (#873) ([347d2f2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/347d2f2)), closes [#873](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/873)





## <small>7.0.2 (2022-07-06)</small>

* refactor(chore): fix sonar code smells (#873) ([347d2f2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/347d2f2)), closes [#873](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/873)





## <small>7.0.1 (2022-06-30)</small>

* chore(deps): update lb4 dependencies (#844) ([535ba19](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/535ba19)), closes [#844](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/844)





## 7.0.0 (2022-06-24)

* fix(cache): missing return type for mixin ([f685126](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f685126)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* feat(authentication-service): add MFA (#782) ([c252b85](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c252b85)), closes [#782](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/782)
* perf(chore): sonar fixes (#847) ([910cf95](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/910cf95)), closes [#847](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/847) [#845](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/845)





## <small>6.0.2 (2022-05-30)</small>

* chore(deps): update loopback4-authorization in all services (#813) ([44d8e67](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/44d8e67)), closes [#813](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/813) [#754](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/754)
* fix(authentication-service): handle error thrown from helper service in forgot pwd (#810) ([7c9f0cd](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7c9f0cd)), closes [#810](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/810) [#798](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/798)





## <small>6.0.1 (2022-05-27)</small>

* chore(deps): changes for release (#809) ([e1a3490](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e1a3490)), closes [#809](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/809) [#808](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/808)





## 6.0.0 (2022-05-27)

* feat(authentication-service): rerstore device info in auth user (#807) ([f7fe285](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f7fe285)), closes [#807](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/807) [#800](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/800)


### BREAKING CHANGE

* restore deviceinfo in auth user




## 5.0.0 (2022-05-27)

* feat(authentication-service): set auth user strict=false (#804) ([a64a8d9](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a64a8d9)), closes [#804](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/804) [#800](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/800) [#800](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/800)
* chore(deps): update all lb4 dependencies (#805) ([572f7ae](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/572f7ae)), closes [#805](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/805) [#754](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/754) [#754](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/754)


### BREAKING CHANGE

* 
* remove unwanted properties




## <small>4.2.2 (2022-05-26)</small>

* fix(authentication-service): change response of forgot password when user is invalid (#799) ([0a939f8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/0a939f8)), closes [#799](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/799) [#798](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/798)





## <small>4.2.1 (2022-05-17)</small>

* fix(ocr-service): prettier and lint issue (#775) ([4a79629](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4a79629)), closes [#775](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/775) [#774](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/774)





## 4.2.0 (2022-05-11)

* feat(ocr-service): Add ocr-service and ocr-s3-service (#767) ([f0de12d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f0de12d)), closes [#767](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/767)





## 4.1.0 (2022-05-10)

* fix(authentication-service): remove unused imports (#771) ([fb3b681](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/fb3b681)), closes [#771](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/771)
* docs(README): updating readme file for services (#613) ([b761645](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b761645)), closes [#613](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/613)
* feat(authentication-service): implement 2-factor-authentication (#686) ([ea571ac](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ea571ac)), closes [#686](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/686) [#453](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/453)





## <small>4.0.8 (2022-05-09)</small>

* chore(deps): bump ejs in /services/authentication-service (#762) ([c1dd334](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c1dd334)), closes [#762](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/762)
* chore(deps): package lock update after sourceloop core release ([897af0a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/897af0a)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* style(authentication-service): remove eslint disable naming convention and repalce with constants (# ([a87b5b2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a87b5b2)), closes [#730](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/730) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(authentication-service): fix error messages in providers (#732) ([96cb609](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/96cb609)), closes [#732](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/732) [#688](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/688)





## <small>4.0.7 (2022-04-20)</small>

* chore(deps): bump moment in /services/authentication-service (#652) ([e85c1c6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e85c1c6)), closes [#652](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/652)
* chore(deps): bump urijs in /services/authentication-service (#680) ([bc61699](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bc61699)), closes [#680](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/680)
* chore(deps): update all deps to latest version and solve security vulnerabilities (#689) ([30ee331](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/30ee331)), closes [#689](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/689)





## <small>4.0.6 (2022-03-30)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>4.0.5 (2022-03-13)</small>

* chore(deps): bump urijs in /services/authentication-service (#592) ([d081a36](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d081a36)), closes [#592](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/592)
* fix(authentication-service): fix external token type (#597) ([71c351f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/71c351f)), closes [#597](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/597) [#569](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/569)





## <small>4.0.4 (2022-03-06)</small>

* fix(chore): update package dependencies to latest version (#577) ([bb04c18](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bb04c18)), closes [#577](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/577)
* chore(deps): bump urijs in /services/authentication-service (#545) ([d916e92](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d916e92)), closes [#545](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/545)





## <small>4.0.3 (2022-02-13)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>4.0.2 (2022-01-28)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>4.0.1 (2022-01-17)</small>

* fix(authentication-service): authclientId issue (#468) ([de351b6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/de351b6)), closes [#468](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/468)





## 4.0.0 (2022-01-16)

* fix(authentication-service): change response of signup and forget password (#459) ([9ab48c1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9ab48c1)), closes [#459](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/459) [#457](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/457)
* fix(authentication-service): security issue with forget password and login api (#466) ([7da5b0b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7da5b0b)), closes [#466](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/466) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)


### BREAKING CHANGE

* removed response body and changed response code of signup-token and forget-password apis
* response type of forget password and login api changed




## <small>3.0.2 (2022-01-12)</small>

* fix(authentication-service): downgrade node-fetch ([bd20548](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bd20548)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## <small>3.0.1 (2021-12-26)</small>

* fix(core): fix versions in package locks and update references in tsconfig ([36b563e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/36b563e)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## 3.0.0 (2021-12-26)

* feat(core): add support for node.js v17 and upgrade to @loopback/cli v3 ([4115b6c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4115b6c)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(docs): add badge for node and npm version ([caaa1bd](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/caaa1bd))


### BREAKING CHANGE

* drop support for node.js v10




## 2.0.0 (2021-12-17)

* fix(core): upgrade all deps (#438) ([c52b7f1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c52b7f1)), closes [#438](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/438)
* fix(docs): added badges ([a66ed14](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a66ed14))


### BREAKING CHANGE

* bump major versions




## <small>1.4.4 (2021-11-11)</small>

**Note:** Version bump only for package @sourceloop/authentication-service





## <small>1.4.3 (2021-11-09)</small>

* refactor(authentication-service): version bump in all services for release (#418) ([0808265](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/0808265)), closes [#418](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/418) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## <small>1.4.1 (2021-11-09)</small>

* chore(deps): bump validator in /services/authentication-service (#403) ([c854899](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c854899)), closes [#403](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/403)





## 1.4.0 (2021-10-24)

* fix: Token not working from swagger (#367) ([263db5c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/263db5c)), closes [#367](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/367)
* fix(auth-service): In authentication service fixed issue current user is not bound to any value in t ([85d3fb8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/85d3fb8)), closes [#349](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/349)
* fix(authentication-service): added test cases (#316) ([65d55e4](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/65d55e4)), closes [#316](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/316) [#181](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/181) [#181](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/181) [#181](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/181) [#181](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/181)
* fix(core): fix bugs ([e519774](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e519774)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* feat(core): new service for feature toggle (#339) ([70d5285](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/70d5285)), closes [#339](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/339)
* chore(deps): bump i in /services/authentication-service (#356) ([b273e9e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b273e9e)), closes [#356](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/356)
* chore(deps): bump passport-oauth2 in /services/authentication-service (#373) ([dc56575](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/dc56575)), closes [#373](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/373)





## 1.3.0 (2021-09-12)

* fix(authentication-service): allow keycloak username to be an auth id as well, if needed ([e831237](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e831237)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(core): missing open api and package lock files ([3bd9686](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3bd9686)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* feat(payment-service): adds payment-service feature (#257) ([e571834](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e571834)), closes [#257](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/257)
* chore(deps): bump path-parse in /services/authentication-service (#301) ([280cf0a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/280cf0a)), closes [#301](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/301)
* chore(deps): bump tar in /services/authentication-service (#308) ([587be75](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/587be75)), closes [#308](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/308)
* chore(deps): bump tar in /services/authentication-service (#319) ([2f1724a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/2f1724a)), closes [#319](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/319)





## <small>1.2.2 (2021-08-02)</small>

* fix(bpmn-service): fix readme for bpmn service (#278) ([299535b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/299535b)), closes [#278](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/278) [#211](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/211)





## <small>1.2.1 (2021-07-24)</small>

* fix(core): update readme ([4ec31ca](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4ec31ca)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(core): upgrade loopback4-soft-delete ([f653e0c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f653e0c)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* docs(authentication-service): update README.md (#276) ([88256ac](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/88256ac)), closes [#276](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/276)
* refactor(authentication-service): fix sonar issues (#266) ([3ea2082](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3ea2082)), closes [#266](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/266) [#251](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/251)
* chore(deps): bump urijs in /services/authentication-service (#274) ([d45ce21](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d45ce21)), closes [#274](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/274)





## 1.2.0 (2021-07-14)

* docs(all-services): fix readme of all services (#245) ([b8937fa](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b8937fa)), closes [#245](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/245) [#211](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/211)
* feat(authentication-service): apple-oauth2 (#243) ([98fdb0f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/98fdb0f)), closes [#243](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/243)
* feat(authentication-service): facebook oauth added (#247) ([3c3cae8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3c3cae8)), closes [#247](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/247)
* perf(all services): added security property in all the controllers an… (#232) ([e37a5a1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e37a5a1)), closes [#232](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/232)





## 1.1.0 (2021-06-14)

* fix(authentication-service): fixed authentication acceptance test (#231) ([053c71d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/053c71d)), closes [#231](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/231)
* fix(core): all packages updated (#214) ([8f15aaa](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8f15aaa)), closes [#214](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/214)
* fix(core): open api docs update ([9b7cb69](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9b7cb69)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(video-conferencing-service): fixed missing exports (#220) ([5baf4af](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5baf4af)), closes [#220](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/220) [#219](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/219)
* feat(authentication-service): validate access token (#230) ([02858bc](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/02858bc)), closes [#230](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/230)
* feat(user-onboarding): base code for user-onboarding lib (#203) ([8d4d19b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8d4d19b)), closes [#203](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/203)
* docs: add openapi spec docs in examples and improve the docs in services (#215) ([baec0f1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/baec0f1)), closes [#215](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/215)





## <small>1.0.1 (2021-05-19)</small>

* fix(authentication-service): allow https proxy for keycloak logout ([a97bb4d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a97bb4d)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(authentication-service): fix deprecated comment ([cda97b6](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/cda97b6)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## 1.0.0 (2021-05-12)

**Note:** Version bump only for package @sourceloop/authentication-service





## 1.0.0-alpha.49 (2021-05-12)

* fix(authentication-service): fix package lock ([eb6b9eb](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/eb6b9eb)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* fix(authentication-service): fixed auto-migration issue in all services (#184) ([dd7bea2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/dd7bea2)), closes [#184](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/184)
* fix(authentication-service): fixed env defaults issues in migrations (#185) ([6f1ef17](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/6f1ef17)), closes [#185](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/185)
* fix(authentication-service): fixed version of loopback packages in all services (#191) ([7eb9a60](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7eb9a60)), closes [#191](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/191)
* fix(authentication-service): moved db-migrate to dev dependencies (#180) ([7b11068](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/7b11068)), closes [#180](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/180)
* feat(authentication-service): Added Instagram oauth2 (#197) ([5567fe9](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5567fe9)), closes [#197](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/197)
* feat(in-mail-service): added migration in all services (#179) ([10aa077](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/10aa077)), closes [#179](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/179) [#124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/124)


### BREAKING CHANGE

* need to add env in existing projects to skip auto-migrations




## 1.0.0-alpha.48 (2021-04-30)

* fix(authentication-service): added a post route for keycloak login due to a possible security issue  ([50a5d5f](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/50a5d5f)), closes [#176](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/176)
* fix(sandbox): fix loopback versions issue ([60db6a0](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/60db6a0)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)
* feat(authentication-service): automigration and commit prompt for migration changes (#158) ([ce8e541](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ce8e541)), closes [#158](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/158) [#124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/124) [#124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/124) [#124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/124) [#124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/124) [#124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/124) [#124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/124) [#124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/124) [#124](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/124)
* feat(sandbox): added basic example, fixed auth-multitenant-example, changed readme (#169) ([0a849fe](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/0a849fe)), closes [#169](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/169)


### BREAKING CHANGE

* Automigration Added - will need to add SKIP env variable in existing project, read docs for help




# [1.0.0-alpha.47](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.46...@sourceloop/authentication-service@1.0.0-alpha.47) (2021-04-26)


### Bug Fixes

* **auth-service:** fixed minor issues in package.json, exports and typings ([#168](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/168)) ([689e38b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/689e38be0ef9939a8b7369b75cd84f23159b06d5))
* **authentication-service:** allow keycloak logout on logout ([#175](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/175)) ([51395b8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/51395b83d2c4741572f84b6af199c9efe925f929))





# [1.0.0-alpha.46](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.45...@sourceloop/authentication-service@1.0.0-alpha.46) (2021-03-31)


### Features

* **authentication-service:** add oauth-code read and write providers ([#154](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/154)) ([90fa8e0](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/90fa8e08a927c6c6371a19ab2f75d10c23307b92))
* **authentication-service:** upgrade loopback4-authentication package to support https proxy ([#156](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/156)) ([915b85b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/915b85b12732f677f19d960da2e88199dcd7b565))





# [1.0.0-alpha.45](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.44...@sourceloop/authentication-service@1.0.0-alpha.45) (2021-03-17)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.44](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.43...@sourceloop/authentication-service@1.0.0-alpha.44) (2021-03-05)


### Bug Fixes

* **authentication-service:** fix package lock ([32d93fe](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/32d93fe7c072d263b85d129889f41a6257b3bcec))


### Features

* **authentication-service:** signup request controller added ([#121](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/121)) ([61dd346](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/61dd34674f0711b4436fa4747a4e8ad1f22629bd))





# [1.0.0-alpha.43](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.42...@sourceloop/authentication-service@1.0.0-alpha.43) (2021-02-17)


### Features

* **authentication-service:** add jwt payload provider ([f08c5d9](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f08c5d9f61138781ffdb2c5606adbfb43523da49))





# [1.0.0-alpha.42](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.41...@sourceloop/authentication-service@1.0.0-alpha.42) (2021-02-10)


### Features

* **authentication-service:** added express middleware in sequence ([#120](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/120)) ([bf81cb1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bf81cb12bb2b7cdd7edfb43dcf09c71abb891c1d))





# [1.0.0-alpha.41](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.40...@sourceloop/authentication-service@1.0.0-alpha.41) (2021-02-06)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.40](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.39...@sourceloop/authentication-service@1.0.0-alpha.40) (2021-02-04)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.39](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.38...@sourceloop/authentication-service@1.0.0-alpha.39) (2021-02-01)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.38](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.37...@sourceloop/authentication-service@1.0.0-alpha.38) (2021-01-19)


### Features

* **core:** SFO-169: added metrics functionality in core ([#114](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/114)) ([bc8ba4d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/bc8ba4d1c429ee69279c3da3d854aab25484b695))





# [1.0.0-alpha.37](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.36...@sourceloop/authentication-service@1.0.0-alpha.37) (2020-12-30)


### Bug Fixes

* **authentication-service:** fix facades bearer verifier data source config not updating issue ([da1a96b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/da1a96b115ec65db2529d9f127a2637dfd82d5d9))





# [1.0.0-alpha.36](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.35...@sourceloop/authentication-service@1.0.0-alpha.36) (2020-12-30)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.35](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.34...@sourceloop/authentication-service@1.0.0-alpha.35) (2020-12-22)


### Features

* **core:** added casbin secure sequence ([#107](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/107)) ([9699e92](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/9699e92b82d76c0c8299207a303d6bebbec85e92))





# [1.0.0-alpha.34](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.33...@sourceloop/authentication-service@1.0.0-alpha.34) (2020-12-20)


### Bug Fixes

* **authentication-service:** add security spec ([d829a85](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d829a850faca316237ec485c00d160efb04a461e))





# [1.0.0-alpha.33](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.32...@sourceloop/authentication-service@1.0.0-alpha.33) (2020-12-20)


### Features

* **authentication-service:** add capability to add pre-verify and post verify providers ([a3ad710](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a3ad710299f6f5ccd42bf64860500d29ee65a45e))





# [1.0.0-alpha.32](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.31...@sourceloop/authentication-service@1.0.0-alpha.32) (2020-12-18)


### Features

* **core:** added helmet, rate limit in sequence when respective configs are present ([#101](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/101)) ([cbcc00c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/cbcc00ca058299c284aa8a6857ccf73ed0621536))





# [1.0.0-alpha.31](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.30...@sourceloop/authentication-service@1.0.0-alpha.31) (2020-12-08)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.30](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.29...@sourceloop/authentication-service@1.0.0-alpha.30) (2020-12-08)


### Reverts

* Revert "feat(authentication-service): adds fullName property to user model (#98)" ([3466399](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3466399d3210d872ba0835606ac416f3e77b0810)), closes [#98](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/98)





# [1.0.0-alpha.29](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.28...@sourceloop/authentication-service@1.0.0-alpha.29) (2020-12-07)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.28](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.27...@sourceloop/authentication-service@1.0.0-alpha.28) (2020-11-27)


### Features

* **authentication-service:** adds fullName property to user model ([#98](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/98)) ([2f8a3cd](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/2f8a3cd04d134a438c0de8e98a4e783005b7a09e))





# [1.0.0-alpha.27](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.26...@sourceloop/authentication-service@1.0.0-alpha.27) (2020-11-24)


### Features

* **authentication-service:** remove allowed resources ([e379514](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e379514bb7259b0c82a13b432888039c6298fdaf))





# [1.0.0-alpha.26](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.25...@sourceloop/authentication-service@1.0.0-alpha.26) (2020-11-17)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.25](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.24...@sourceloop/authentication-service@1.0.0-alpha.25) (2020-11-15)


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





# [1.0.0-alpha.24](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.23...@sourceloop/authentication-service@1.0.0-alpha.24) (2020-11-04)


### Bug Fixes

* **authentication-service:** revert previous commit ([5ade792](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/5ade79259da5a0e907b4db1ac981cf6920c62b2a))





# [1.0.0-alpha.23](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.22...@sourceloop/authentication-service@1.0.0-alpha.23) (2020-11-04)


### Bug Fixes

* **authentication-service:** fix uri encodin issue for redirection ([6656a5e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/6656a5e7b30cb7c39b49f20641ce91fbf0d6be63))





# [1.0.0-alpha.22](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.21...@sourceloop/authentication-service@1.0.0-alpha.22) (2020-11-03)


### Bug Fixes

* **authentication-service:** change interface for signup provider ([27938d0](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/27938d08ec87bf154b7b7dc7420e19caf6efce70))





# [1.0.0-alpha.21](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.20...@sourceloop/authentication-service@1.0.0-alpha.21) (2020-11-03)


### Bug Fixes

* **authentication-service:** change sign up bindings ([a04b42e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a04b42ea15568489d411b0b312d0596cbcbd8f48))





# [1.0.0-alpha.20](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.19...@sourceloop/authentication-service@1.0.0-alpha.20) (2020-10-30)


### Features

* **authentication-service:** added keycloak signup provider ([#89](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/89)) ([8f37477](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8f37477f758b917bb7ac53021966491087536c2d))





# [1.0.0-alpha.19](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.18...@sourceloop/authentication-service@1.0.0-alpha.19) (2020-10-19)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.18](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.17...@sourceloop/authentication-service@1.0.0-alpha.18) (2020-10-08)


### Features

* **core:** add security spec for open api spec generation ([d803457](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d8034578131d43ec911f4dfc7db605317bf4fb58))





# [1.0.0-alpha.17](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.16...@sourceloop/authentication-service@1.0.0-alpha.17) (2020-09-25)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.16](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.15...@sourceloop/authentication-service@1.0.0-alpha.16) (2020-09-18)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.15](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.14...@sourceloop/authentication-service@1.0.0-alpha.15) (2020-08-28)


### Bug Fixes

* **core:** fix token expiry issue ([ddfe938](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/ddfe938b984d039a7eac528623d1feda1fa939f2))





# [1.0.0-alpha.14](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.13...@sourceloop/authentication-service@1.0.0-alpha.14) (2020-08-19)


### Bug Fixes

* **authentication-service:** change in login.controller.ts ([#66](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/66)) ([834785c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/834785c5a5a461ee517c5b7edd21ab097f20edd8))
* **core:** fix build issues ([d1127f9](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d1127f9567df6636e961bae821c5836f494dfbfd))


### Reverts

* Revert "chore: publish release" ([c122216](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c122216f3e8135dd6a986e7cbf638ec513b46ac0))





# [1.0.0-alpha.13](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.12...@sourceloop/authentication-service@1.0.0-alpha.13) (2020-08-13)


### Bug Fixes

* **authentication-service:** change in condition of auth clientID ([#65](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/65)) ([0dbc278](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/0dbc2785942602ea654ac7af986f2523a05d9874))


### BREAKING CHANGES

* **authentication-service:** this will break login flow

SFO-0

* fix(authentication-service): prettier fix

prettier fix

SFO-0





# [1.0.0-alpha.12](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.11...@sourceloop/authentication-service@1.0.0-alpha.12) (2020-08-12)


### Bug Fixes

* **authentication-service:** change in user model ([#64](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/64)) ([1ac5b83](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/1ac5b83fb713e63965b1bf1888e99055a139b2dc))


### BREAKING CHANGES

* **authentication-service:** it can impact user flow





# [1.0.0-alpha.11](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.10...@sourceloop/authentication-service@1.0.0-alpha.11) (2020-08-12)


### Features

* **authentication-service:** google signup provider for creating user while logging with google ([#63](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/63)) ([c8ca37d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c8ca37ddfaaf38a152649266a720ee3b20de088f))


### Reverts

* Revert "chore: publish release" ([643209b](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/643209b46d2611a696fed91bdc4a153bf8d24f96))





# [1.0.0-alpha.10](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.9...@sourceloop/authentication-service@1.0.0-alpha.10) (2020-08-07)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.9](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.8...@sourceloop/authentication-service@1.0.0-alpha.9) (2020-07-20)


### Bug Fixes

* **authentication-service:** fix expiry handling ([35c8203](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/35c8203b4bc9de4ffcf0026c5d6196d0563267bb))





# [1.0.0-alpha.8](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.7...@sourceloop/authentication-service@1.0.0-alpha.8) (2020-07-20)


### Bug Fixes

* **authentication-service:** fix token expiry err ([65d6386](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/65d63865167f72e7a262a06ea8293699c51eb88c))





# [1.0.0-alpha.7](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.6...@sourceloop/authentication-service@1.0.0-alpha.7) (2020-07-20)


### Bug Fixes

* **authentication-service:** handle token expiry error message ([a17e768](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a17e76850cb08400768a1c5f9929785d6b3861e6))





# [1.0.0-alpha.6](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.5...@sourceloop/authentication-service@1.0.0-alpha.6) (2020-07-19)


### Bug Fixes

* **authentication-service:** fix password expiry time check and relay state for keycloak ([8e8a27d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8e8a27d174ff18fcc7f17e14dca5a5140137a69a))





# [1.0.0-alpha.5](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.4...@sourceloop/authentication-service@1.0.0-alpha.5) (2020-07-16)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.4](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.3...@sourceloop/authentication-service@1.0.0-alpha.4) (2020-07-16)


### Bug Fixes

* **authentication-service:** test cases commented ([a2f578e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/a2f578e94713656f0c59878dc89d3387a5c07244))


### Features

* **authentication-service:** add auth service to source loop catalog ([909f304](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/909f304dc056a08cf0dfcfdbabe400ca6e1aa9ee))





# [1.0.0-alpha.3](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.2...@sourceloop/authentication-service@1.0.0-alpha.3) (2020-07-08)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.2](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.1...@sourceloop/authentication-service@1.0.0-alpha.2) (2020-06-26)

**Note:** Version bump only for package @sourceloop/authentication-service





# [1.0.0-alpha.1](https://github.com/sourcefuse/loopback4-microservice-catalog/compare/@sourceloop/authentication-service@1.0.0-alpha.0...@sourceloop/authentication-service@1.0.0-alpha.1) (2020-06-25)

**Note:** Version bump only for package @sourceloop/authentication-service





# 1.0.0-alpha.0 (2020-06-11)


### Features

* **core:** change scope ([d4bf68a](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d4bf68a64da546e47519fbd479b41f7d41e3489d))
* **sandbox-testing:** add sandbox for testing ([296279c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/296279cbeeea2409d2959b48252c48b7891aea3c))


### BREAKING CHANGES

* **sandbox-testing:** Fixed binding errors in core sequence

SFO-20
* **core:** scope for all packages changed

SFO-20
