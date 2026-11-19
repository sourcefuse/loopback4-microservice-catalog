# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 0.5.0 (2026-11-19)

* feat(packages): add change detection and a user pool to load-testing (#2659) ([e0681ca](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/e0681ca)), closes [#2659](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2659)


### BREAKING CHANGE

* `LOAD_TESTS_USERNAME`, `LOAD_TESTS_PASSWORD`,
`ctx.token`, `ctx.claims`, `datasources`, `ctx.sql`, the baseline
settings and the `report` command no longer exist. Use
`LOAD_TESTS_USERS_FILE` and `ctx.auth()`.

* refactor(load-testing): fix sonar findings

* chore(load-testing): drop the pg peer dependency from the lockfile

* fix(load-testing): refresh a pool token only when it expires soon

* fix(load-testing): pass only promises to Promise.allSettled




## 0.4.0 (2026-11-19)

* feat(benchmarking): compare two builds instead of a stored baseline (#2654) ([fb694c1](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/fb694c1)), closes [#2654](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2654)


### BREAKING CHANGE

* the baseline gate is removed. BENCH_UPDATE_BASELINE, BENCH_FORCE_BASELINE,
BENCH_OPS_TO_TRACK, BENCH_MIN_SAMPLES, PerformanceRegressionError, BaselineData and
BaselineEntry are gone, the run file holds only {history}, and the defaults change to
30 iterations and a 15% threshold. Use bench-compare on two run files instead.

* docs(load-testing): remove stale references to the benchmarking baseline

- @sourceloop/benchmarking no longer keeps a 10-run history, so the README and the
  HISTORY_SIZE comment do not point to it

* docs(benchmarking): add the lessons from the field and research to do's and don'ts

Add every lesson from the history of the private copy and the strongest
verified research items. Fix two rules that the history contradicts:
more rounds, not iterations, for noise between processes, and measure a
V8 flag before you keep it. Define side, round and suspect. Drop
low-impact items and renumber the references.

* docs(benchmarking): add an example GitHub Actions workflow

The example builds base and head the same way in one job, runs five
alternating rounds with one process per file, checks suspects again,
and writes the comparison to the job summary. The README links to it.
Also drop the "Moving from 1.x" table; the BREAKING CHANGE footer of
the 2.0.0 commit already lists those changes.

* refactor(benchmarking): resolve the SonarCloud findings

Split main and parseArgs into smaller functions, sort workspace paths
with localeCompare, and replace a backtracking regex and a magic number.
No behaviour change.

* docs(benchmarking): drop the rule about lerna --since

bench-select already picks files from the changed source files, so the
rule adds nothing.

* docs(benchmarking): add a sharded example workflow

Split the benchmark files across machines for packages where one job takes too long. Each machine runs base and head for its own files.

* feat(benchmarking): keep only the newest 10 runs in a run file

The run file no longer grows without a limit. A comparison can use at most 10 rounds per side.

* docs(benchmarking): restore the code samples in do's and don'ts

Bring back the good and bad samples of the old sections under the matching rules.




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
