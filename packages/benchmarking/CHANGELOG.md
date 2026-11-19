# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 2.0.0 (2026-11-19)

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




## <small>1.0.1 (2026-10-30)</small>

* chore(benchmarking): prepare 1.0.0 release ([62352f2](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/62352f2))





## 1.0.0 (2026-10-09)

* First public npm release of @sourceloop/benchmarking.

## 0.2.0 (2026-10-08)

* feat(benchmarking): add @sourceloop/benchmarking package (#2613) ([30e1480](https://github.com/sourcefuse/loopback4-microservice-catalog/commit/30e1480)), closes [#2613](https://github.com/sourcefuse/loopback4-microservice-catalog/issues/2613)
