# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## <small>1.0.2 (2021-07-24)</small>

* fix(core): upgrade loopback4-soft-delete ([f653e0c](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f653e0c)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## <small>1.0.1 (2021-07-14)</small>

* fix(core): update readme ([4ec31ca](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/4ec31ca)), closes [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0)





## 1.0.0 (2021-07-14)

* fix(core): fix facades bearer verifier to decouple from auth service (#253) ([cb30528](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/cb30528)), closes [#253](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/253)
* docs(all-services): fix readme of all services (#245) ([b8937fa](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/b8937fa)), closes [#245](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/245) [#211](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/211)
* feat(authentication-service): facebook oauth added (#247) ([3c3cae8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/3c3cae8)), closes [#247](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/247)
* feat(chat-service): setup chat microservice (#109) ([792e14e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/792e14e)), closes [#109](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/109)


### BREAKING CHANGE

* authService url removed from BearerVerifierConfig and now there is a need for a data source with AuthCacheSourceName
