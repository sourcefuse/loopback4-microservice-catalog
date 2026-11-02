# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.3.0 (2026-11-02)

* feat(load-testing): add browser scenarios with Playwright (#2627) ([68d3b6d](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/68d3b6d)), closes [#2627](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2627)


### BREAKING CHANGE

* LOAD_TESTS_AUTH_URL is now LOAD_TESTS_AUTH_SERVICE_URL.
A run that finds only the old name stops with a ConfigError.

* fix(load-testing): clear the Sonar issues of the browser list

Split the check of artillery.browsers into one helper for each part, so
each function stays under the complexity limit and each branch has an
else. Move two small steps out of readTarget and execute for the same
reason. Use \w in the variable name check.

* fix(load-testing): put the optional urls of namedApis in a type

A default value before a required parameter made callers pass
undefined to use it. The parameter now accepts undefined, and the
function reads it with a fallback.

* fix(load-testing): let a test turn a Web Vital off

A flow that gives no sample of a Web Vital failed with 'no samples',
and only INP could be off. Now false turns any Web Vital off, for
example vitals: {TTFB: false}. The last layer that names it wins, so
an object after false turns it on again.

A baseline with a history must now have baseUrl or uiUrl. Without one,
the history never reset when the run moved to another host.

writeScenario makes chromium() only for a browser scenario, and the
detail reporter is named console-detail.
* Scenario is now HttpScenario | BrowserScenario, extra CLI
arguments are a usage error, and some message texts changed.

* feat(load-testing): run browser scenarios in a list of browsers

Browser scenarios now run once for each browser in artillery.browsers
(default: chromium()). The label ends with the browser, for example
'open home › chromium', so files, report rows and baselines stay apart.
A browser names its Artillery engine, so a project can add Firefox or
WebKit with its own engine. A Web Vital the browser does not report has
no limit. chromium() sets launchOptions and the start timeout.

Hooks get ctx.apis.<name> for other backends. config.ts names them in
apis, as a map of names to variables that hold the URL.




## 0.2.0 (2026-10-30)

* feat(load-testing): add @sourceloop/load-testing package (#2620) ([04e4dab](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/04e4dab)), closes [#2620](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2620)
