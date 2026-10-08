# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.3.0 (2026-10-08)

* fix(deps): resolve trivy high-severity vulnerabilities (#2616) ([8f9b03e](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/8f9b03e)), closes [#2616](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2616)


### BREAKING CHANGE

* yes. @sourceloop/cli now requires yeoman-environment 6 and
Node >= 22.12 (it loads the ESM yeoman-environment via require(esm)), and
@sourceloop/observability now targets the OpenTelemetry JS SDK 2.x
(sdk-trace/resources 2.x, OTLP exporters 0.222). Consumers pinned to the
previous majors must upgrade accordingly.

* fix(deps): sync package-lock and package.json

* refactor(cli): return rejected promise instead of async-throw in mcp adapter prompt

* fix(deps): cap mocha below 12 so mochawesome reporter loads

mocha 12 removed mocha/lib/utils, which mochawesome 7.1.4 requires, causing ERR_MOCHA_INVALID_REPORTER in the CI test jobs. Override mochawesome's mocha to ^11.8.0 so the reporter resolves a compatible mocha.

* fix(deps): regenerate lockfile from clean checkout to restore dropped transitives

The previous lockfile was generated in a churned working tree and dropped transitive deps (peek-readable, readable-web-to-node-stream, @microsoft/tsdoc), causing CI test jobs to fail on 'Cannot find module'. Regenerated from a pristine checkout: complete tree (no dangling deps), Trivy 0, mocha capped below 12. Full workspace build and lerna test pass.




## 0.2.0 (2026-08-16)

* feat(cache): add sequelize support (#2554) ([d724198](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d724198)), closes [#2554](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2554) [#2552](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2552) [#2552](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2552) [#2552](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2552)





## 0.1.0 (2026-06-19)

* refactor(deps): update catalog extension to latest version (#2565) ([d2c2fd8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/d2c2fd8)), closes [#2565](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2565) [#2564](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2564)
* chore(deps): upgrade catalog dependencies to latest versions (#2521) ([f5ecddf](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/f5ecddf)), closes [#2521](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2521) [#2510](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2510) [#2510](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2510) [#00](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/00) [#2510](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2510) [#2510](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2510)
* feat(observability): add @sourceloop/observability with OTEL-first bootstrap, profiles, and pluggabl ([c3d46e8](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/c3d46e8)), closes [#2502](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2502) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0) [#0](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/0) [#2502](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2502) [#2503](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2503)


### BREAKING CHANGE

* yes
* yes
* YES
