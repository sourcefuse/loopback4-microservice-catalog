# @sourceloop/benchmarking

Benchmark helpers for Mocha. We write a benchmark the same way we write a test. Each run measures the callback with [tinybench](https://github.com/tinylibs/tinybench) and appends its throughput to a JSON run file. Two commands do the rest:

- `bench-compare` compares the run files of two builds, recorded on the same machine, and exits 1 on a regression.
- `bench-select` picks the benchmark files that a change can affect, so a pull request runs fewer of them.

## What this is, and what it is not

This is a regression check on the throughput of one logical operation, run serially.

It is not a load test. The harness runs one callback at a time and does not model arrival rates or concurrent users. If our callback opens ten connections in parallel, that is our code's concurrency. See the rule "Do read `Promise.all` throughput as batches" in Do's and Don'ts below. For real concurrent load, use [`@sourceloop/load-testing`](../load-testing), k6 or Artillery.

A benchmark run no longer fails on its own. A number from one run, compared with numbers from earlier runs on other machines, was too noisy to gate on. Benchmarks varied by 10 to 60 percent between runs. The reliable signal is a side-by-side comparison: run the base build and the head build on one machine, alternating, and compare the two.

## Install

```sh
npm install --save-dev @sourceloop/benchmarking
```

Node 22.18 or later, or Node 24. tinybench 5 ships as ESM only and this package compiles to CommonJS, so loading it depends on `require(esm)`. `bench-select` uses `path.matchesGlob`, which is stable from Node 22.20; on 22.18 and 22.19 it can print an experimental warning.

Mocha is a peer dependency. We use the copy already in the project.

## Quickstart

```ts
import {bench, config} from '@sourceloop/benchmarking';

bench.describe('order service', () => {
  let service: OrderService;

  before(async () => {
    service = await givenOrderService();
  });

  bench.it(
    'finds open orders',
    async () => {
      await service.findOpen();
    },
    {
      // Outside the measured time, around every iteration, warm-up included
      beforeEach: () => service.resetOrders(),
    },
  );

  bench.it(
    'counts orders',
    async () => {
      await service.count();
    },
    // A fast benchmark, where one slow iteration would move the mean
    {iterations: config.iterations * 3},
  );
});

// Optional, see "Running only the affected files"
bench.links('src/services/order*.ts', 'src/repositories/order*.ts');
```

`bench.describe` and `bench.it` both prefix the title with `benchmark:`. That prefix lets a normal test run skip benchmarks:

```jsonc
{
  "scripts": {
    "test": "lb-mocha --grep 'benchmark:' --invert \"dist/__tests__\"",
    "test:benchmark": "lb-mocha \"dist/__tests__/benchmark\"",
  },
}
```

Each run appends one number per benchmark to `BENCH_REPORT_FILE`. The file grows with every run, so delete it before you collect a new set of runs.

## Settings

Every setting is an environment variable, because the values change per environment, not per call site.

| Variable                  | Default                | Range                 | What it does                                                                                                                                        |
| ------------------------- | ---------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BENCH_ITERATIONS`        | `30`                   | 1 to 1000             | Fewest measured iterations. `bench.it(..., {iterations})` overrides it for one benchmark.                                                           |
| `BENCH_MIN_TIME`          | `200`                  | 0 to 10000 ms         | Fewest ms of measured time. Measurement stops when both limits are reached, so a fast callback takes many more samples. `0` runs exactly the count. |
| `BENCH_WARMUP`            | on                     | `false` to disable    | Runs unmeasured warm-up iterations first.                                                                                                           |
| `BENCH_WARMUP_TIME`       | `100`                  | 0 to 10000 ms         | Fewest ms of warm-up, with at least one iteration. A fast callback warms up for many calls; a slow one warms up once.                               |
| `BENCH_REPORT_FILE`       | `./.bench/report.json` | any path without `..` | The run file. A path containing `..` is rejected.                                                                                                   |
| `CI`                      | off                    | `true` to enable      | Prints a line per benchmark with throughput, latency and sample count.                                                                              |
| `BENCH_THRESHOLD`         | `15`                   | 0 to 100 %            | `bench-compare`: the highest threshold.                                                                                                             |
| `BENCH_MIN_THRESHOLD`     | `10`                   | 0 to 100 %            | `bench-compare`: the lowest threshold.                                                                                                              |
| `BENCH_NOISE_MULTIPLIER`  | `4`                    | 0 to 100              | `bench-compare`: the threshold is this many times the run-to-run noise. `0` uses `BENCH_THRESHOLD` for every benchmark.                             |
| `BENCH_MIN_NOISE_HISTORY` | `3`                    | 2 to 100              | `bench-compare`: fewest runs per side to measure noise.                                                                                             |
| `BENCH_OUTLIER_PERCENT`   | `40`                   | 0 to 1000 %           | `bench-compare`: leaves out runs this far from their side's median. `0` compares medians.                                                           |

Out-of-range numbers are clamped, so `BENCH_ITERATIONS=5000` becomes 1000. A value that is not a number falls back to the default. Counts and times must be whole numbers; percentages and the multiplier take fractions.

## Comparing two builds

Build the base commit and the head commit in two directories, then run the same benchmark files for both on one machine. Run one file per process, alternate the two builds file by file, and flip the order every round. Then a slow period on the machine affects both builds alike.

```sh
BASE_DIR=/tmp/base/services/orders # built base commit
HEAD_DIR=$PWD                      # built head commit
OUT=$PWD/.bench-ab
rm -rf "$OUT"

run() { # run <base|head> <file> <run file name>
  local dir=$BASE_DIR
  [ "$1" = head ] && dir=$HEAD_DIR
  # A benchmark file new in head has nothing to compare with in base
  [ -f "$dir/$2" ] || return 0
  (cd "$dir" && BENCH_REPORT_FILE="$OUT/$3.json" npx lb-mocha --allow-console-logs "$2")
}

files=$(cd "$HEAD_DIR" && ls dist/__tests__/benchmark/*.js)
for round in 1 2 3 4 5; do
  order="base head"
  [ $((round % 2)) = 0 ] && order="head base"
  for file in $files; do
    for side in $order; do run "$side" "$file" "$side"; done
  done
done

npx bench-compare "$OUT/base.json" "$OUT/head.json" --markdown
```

Before you accept a regression, check it again. `bench-compare <base> <head> --suspects` prints `suite<TAB>test` for each benchmark slower than half its threshold. Run the files that hold them for five more rounds, the same way, into `base-recheck` and `head-recheck`. Then give all four files:

```sh
npx bench-compare "$OUT"/base.json "$OUT"/head.json "$OUT"/base-recheck.json "$OUT"/head-recheck.json
```

A regression then counts only if the second pass regresses too. Otherwise it shows as `UNCONFIRMED` and does not fail. Run whole files again, not single benchmarks: a benchmark run alone measured up to 25 percent differently from the same benchmark after the rest of its file.

Local runs also use one process per file. In one process, V8 optimisation and garbage from earlier files change the numbers of later files.

Exit codes: 0 for no regression, 1 for a regression or for a benchmark of base that is missing from head (deleted, renamed, or crashed on head), 2 for bad usage or an unreadable file.

## How a comparison decides

For each benchmark, `bench-compare` takes the mean throughput of all runs of each side, without the runs more than `BENCH_OUTLIER_PERCENT` from that side's median. A plain median of a few runs jumps between the two speeds of a benchmark that runs at one of two speeds per process. A plain mean lets one lucky-fast run move the result. The median always stays in, so at worst the comparison is between medians.

```
deviation = (head - base) / base * 100
```

The threshold comes from the noise of the benchmark. Noise is the run-to-run coefficient of variation of the noisier side, in percent. The threshold is `BENCH_NOISE_MULTIPLIER × noise`, clamped to [`BENCH_MIN_THRESHOLD`, `BENCH_THRESHOLD`]. A steady benchmark gets a tight threshold and a noisy one a loose one. A side with fewer than `BENCH_MIN_NOISE_HISTORY` runs has no noise value. When neither side has one, the threshold is `BENCH_THRESHOLD`.

The benchmark regresses when `deviation < -threshold`. The defaults caught planted slowdowns of 20 percent and more in same-machine comparisons, with steady benchmarks under 10 percent noise.

## Running only the affected files

`bench.links(...globs)` names the source files that the benchmarks of a file depend on. Paths are relative to the package and can be globs. Put the call at the bottom of the file, below the suites, so the benchmarks themselves stay free of it. It has no effect on a benchmark run.

```ts
bench.links('src/services/order*.ts', 'src/repositories/order*.ts');
```

`bench-select` prints the subset of the given built files that a change can affect. Run it in the package directory:

```sh
git diff --name-only --no-renames origin/master...HEAD > /tmp/changed.txt
npx bench-select --changed /tmp/changed.txt dist/__tests__/benchmark/*.js > /tmp/selected.txt
```

It loads each file through Mocha without running a test, and reads its `bench.links` call. A file runs when:

- its own source file changed;
- a changed path matches one of its links;
- it has no `bench.links` call.

Every file runs when a changed path is a package file outside `src` (for example `package.json` or a migration), a test helper, a file in the repository root, a file of a workspace package this package depends on, or a match for an `--all <glob>` option. Use `--all` for files outside the package that decide how benchmarks run, such as your CI workflow. Markdown files and other spec files (`*.unit.ts`, `*.acceptance.ts`, `*.integration.ts`) are ignored. `--root` sets the repository root; by default it is the nearest directory upward whose `package.json` has `workspaces`.

It exits 2 when a link matches no file in the package, when a file does not load, or when the source of a built file is missing. A renamed or deleted file then cannot leave a benchmark silently unlinked.

## Timeouts

`bench.it` sets its own Mocha time limit: 5 seconds, plus 2 for each iteration and one more for warm-up, plus 0.3 seconds for each ms of `BENCH_MIN_TIME`. At the defaults that is 127 seconds. When the limit ends, an abort signal also stops tinybench, so a slow benchmark does not keep running after Mocha has failed it.

## Do's and Don'ts

Each rule names its source:

- _field_: a mistake made in a large service suite that used this harness. Before the fixes, its benchmarks varied by 10 to 60 percent between runs.
- _research [n]_: from the numbered references at the end.
- _this package_: follows from how this package works.

Terms: a _side_ is one build, base or head. A _round_ runs every benchmark file once for each side. A _suspect_ is a benchmark that `bench-compare --suspects` lists.

### Write the callback

- **Do declare the callback `async`.** tinybench calls a plain function once, without measuring it, to find out whether it returns a promise. _research [1]_

  ```ts
  bench.it('creates an order', async () => {
    await service.create(fixture);
  }); // good
  bench.it('creates an order', () => service.create(fixture)); // bad
  ```

- **Do await all the work that the callback starts.** tinybench stops the clock when the returned promise settles. Work that is not awaited, such as an audit write or a timer, runs later in another iteration. A change that moves work to the background then looks faster, but the work is the same. _research [1]_
- **Do measure one operation.** When a four-step flow regresses, you must find the slow step by hand. Four benchmarks name it. _field_
- **Do make the callback do real work.** A benchmark on an empty table, on three rows, or on a stubbed-out path measures only the harness. Many such benchmarks were deleted in the field. A mock of the expensive part also measures only the harness. _field_
- **Do keep setup out of the measured time.** Build fixtures in Mocha `before`, or in the tinybench hook `beforeAll` or `beforeEach`. Otherwise a change to a fixture builder reads as a regression. _field_
- **Do check the outcome, never the time.** A delete that matched no row still returned 204, and a fake cache ignored a command it did not support, so broken benchmarks looked fast. Check the result in `afterEach`, outside the measured time, and make fakes throw on an unsupported call. Do not assert on time: 50 ms on a laptop is 300 ms on a shared runner. _field_
- **Do read secrets and auth settings through a helper that throws when a value is missing.** A missing secret made every request fail with 401, and the benchmark measured the error path. _field_
- **Do call a started application by its URL.** `createRestAppClient(app)` uses the URL. `supertest(handler)` and `createClientForHandler` start a new server for each request, and the benchmark measures that too. _research [15]_
- **Don't call the network or a shared database.** That measures somebody else's uptime, and two CI jobs on one database show up in each other's numbers. Use in-memory fakes or a container that the run owns. _field_
- **Do put repeated helpers in one shared fixture.** In the field, auth setup, data restore and forced GC were copied across files, and the copies drifted apart. _field_

### Data and lifecycle

- **Do give every iteration the same data volume.** A callback that inserts rows makes iteration 30 work on more data than iteration 1. Restore state in `beforeEach` or `afterEach`: they run around every iteration, outside the measured time. Piled-up data was a main cause of the 10 to 60 percent swings. _field_

  ```ts
  bench.it(
    'creates an order',
    async () => {
      await repo.create(order);
    },
    {afterEach: () => repo.deleteAll()},
  );
  ```

- **Don't let an iteration depend on the one before it.** A cache that the first iteration fills, an id that grows, or a value that flips each iteration changes the work. In the field, a value flipped while the data was restored, so every second iteration did nothing. _field_
- **Do give each iteration a fresh input.** In the field, the code under test changed one input object that every iteration reused. The benchmark then ran at 8 or 12 operations per second, depending on the process. Build the input in `beforeEach`. _field_
- **Do give read benchmarks their own fixed data.** Write benchmarks grew a shared record that a later read benchmark used. The size of the read then depended on the iteration count and on the test order. _field_
- **Do use fixed dates and set `TZ=UTC`.** Code that uses local dates runs at a different speed in each time zone. In the field, date benchmarks ran up to 3 times faster in the first process than in later ones until `TZ=UTC` was set. _field_
- **Do remember that the hooks also run during warm-up.** They receive the mode, `'warmup'` or `'run'`, as their argument. With warm-up on, `beforeAll` and `afterAll` run twice. _research [1]_
- **Do clean up in Mocha `after`, not only in the tinybench hook `afterAll`.** tinybench skips `afterAll` when an iteration throws. Also stop servers and timers there. The default Mocha setting `exit: true` hides handles that stay open and slow later benchmarks in the file. Run once with `--no-exit` to find them. _research [1][14]_
- **Don't open connections at the top level of a benchmark file.** `bench-select` loads every file to read its links. Open them in Mocha `before`. _this package_

### Measure

- **Don't set `BENCH_MIN_TIME=0` for fast benchmarks.** With a fixed count alone, a benchmark that takes microseconds per call was timed for under a millisecond, and varied by up to 24 percent between processes. 200 ms of samples brought that under 3 percent. _field_
- **Do keep warm-up on.** V8 compiles hot code in tiers (Ignition, Sparkplug, Maglev, TurboFan). Early iterations run slower code than later ones. _research [2][3]_
- **Don't expect warm-up to guarantee a steady state.** Some benchmarks never settle, or settle at a slower speed. That is why `bench-compare` uses several runs and removes outliers. _research [4]_
- **Do add rounds, not iterations, when the noise is between processes.** In the field, most noise was between processes: some benchmarks ran at one of two speeds per process. More iterations do not fix that. More rounds do. More iterations help only against noise inside one process. For that, use `{iterations: config.iterations * 3}` on the one benchmark, so `BENCH_ITERATIONS` still scales it. _field_
- **Do keep per-iteration hooks cheap.** `beforeEach` and `afterEach` run for every iteration, but their time does not count toward `BENCH_MIN_TIME`. A 30 µs callback with a 10 ms hook runs about 6,700 hooks and can reach the time limit. _research [1]_
- **Do force garbage collection outside the measured time if GC pauses dominate.** Start Node with `--expose-gc` and call `global.gc()` in `beforeEach`. Build a large input for each benchmark, not all inputs at the start. In the field, GC moved inputs built at the start during the first benchmark. _field_
- **Do measure a V8 flag before you keep it.** In the field, `no-concurrent-recompilation` cut the spread of one benchmark from 12 to 1 percent. That benchmark ran at one of two speeds per process. `single-threaded-gc` made other benchmarks worse. One flag helped on one runner and hurt on another. _field_
- **Do pass V8 flags per process, the same on both sides.** Node rejects most V8 flags in `NODE_OPTIONS`. Use, for example, `lb-mocha --node-option no-concurrent-recompilation`. V8 flags can change between Node versions. _research [5]_
- **Do read the source of the tinybench version that this package installs.** Another tinybench version in the root `node_modules` has other defaults. In the field, reading the wrong one led to a wrong warm-up setting. _field_
- **Don't benchmark with coverage on.** Coverage tools (`nyc`, `c8`) count code in V8, and that changes how V8 optimises it. _research [6]_

### Run

- **Do build base and head the same way.** Install and build both with the same commands, in directories with paths of equal length. In the field, builds made in different ways measured identical code up to 26 percent apart. _field_
- **Do run each benchmark file in its own process.** Node's own benchmark tool runs every configuration in a separate process, because V8 optimisation depends on what ran before. _field, research [7]_
- **Do run base and head in one job, on one machine, alternating.** Hosted CI runners get different CPU models from run to run, and the noise between cloud instances is larger than the noise inside one. _field, research [8][9]_
- **Don't share the machine.** Do not use Mocha `--parallel`, a second benchmark job, or other CPU-heavy programs at the same time. Mocha says parallel mode is not for timing-sensitive tests. For local runs, also keep a laptop on mains power, and on Linux set the CPU frequency governor to `performance`. _research [7][10][11][12]_
- **Do fail the job when a file crashes or runs no test.** In the field, a crashed file was removed from the comparison without a warning. Count the failed files yourself. Set a time limit for each file, so that a hung file cannot block the check. A failure on head can hide a regression. A failure on base only needs a report. _field_
- **Don't commit run files.** They belong to one machine and one run. A changed file also makes a monorepo tool such as lerna treat the package as changed. _field_
- **Don't compare numbers across machines or Node versions.** State the platform (Node version, CPU, flags) with every result you share. _research [8][13]_

### Compare and read results

- **Do read `Promise.all` throughput as batches.** With 100 calls in one callback, throughput counts batches per second. Divide by 100, and say so in the title. _field_
- **Do collect at least five rounds per side.** A noise value from three runs is itself noisy. Five rounds made the thresholds stable. _field_
- **Do check a suspect again before you act.** Use `--suspects` and a second pass. Noise rarely moves a benchmark past its threshold twice, but a real slowdown does it every time. In a large suite a false alarm is normal: at 5 percent risk per benchmark, one benchmark in 20 shows a difference that does not exist. _field, research [7]_
- **Don't re-run the job until it passes.** Each re-run is one more chance for noise to hide a real slowdown. When the second pass confirms a regression, treat it as real. _research [16]_
- **Don't set `BENCH_THRESHOLD` or `BENCH_MIN_THRESHOLD` below the noise.** At 2.66 percent run-to-run variation on hosted runners, a 2 percent threshold gives a false alarm on roughly half the runs. _research [8]_
- **Don't rename a benchmark without a reason.** A rename shows as "missing from head" and exits 1. Accept it once, on purpose. _this package_

### Select

- **Don't let a monorepo tool decide whether benchmarks run.** Tools such as `lerna --since` often ignore changes under `__tests__`. In the field, a change to benchmarks alone then ran nothing. Use `bench-select`. _field_
- **Do use `git diff --name-only --no-renames`.** With renames on, the old path of a moved file is missing from the list. _this package_
- **Do select once, on head, and use the same files for both sides.** _this package_
- **Don't add `bench.links` to a benchmark that boots the whole application.** It reaches too many files to list. Without links it always runs. _field_
- **Do update the links when you rename, move or delete a source file, or when the code under test starts to call a new file.** A changed file that no link names does not select anything. _field_

## API

`bench.describe(title, callback)` declares a suite and prefixes the title. The callback must be synchronous, because Mocha collects the tests inside it while the file loads.

`bench.it(title, callback, options?)` declares a benchmark. It measures the callback and appends its mean throughput to the run file. The callback must be async. `options` takes the tinybench hooks `beforeAll`, `beforeEach`, `afterEach` and `afterAll`, and `iterations`.

`bench.links(...globs)` names the source files for `bench-select`. It rejects a glob that starts with `!` or `./`, because `path.matchesGlob` never matches those.

`config` is a live view of the settings. Every property is a getter that reads `process.env` when accessed.

The errors all extend `BenchmarkingError`. `BenchmarkError` means the run itself failed: the callback threw, produced nothing, or hit the time limit. `ReporterError` means the run file could not be read or written, and keeps the original on `cause`. An unreadable run file stops the run instead of being replaced. `BenchmarkConfigError` means a setting was refused.

## Moving from 1.x

| 1.x                                                                         | 2.x                                                                        |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| A run failed with `PerformanceRegressionError` against a committed baseline | A run only records; `bench-compare` fails on a regression between builds   |
| `BENCH_UPDATE_BASELINE`, `BENCH_FORCE_BASELINE`                             | Removed. Every run is recorded                                             |
| `BENCH_OPS_TO_TRACK`, `BENCH_MIN_SAMPLES`                                   | Removed. Every run is kept; `BENCH_MIN_NOISE_HISTORY` sets the noise floor |
| Run file entry `{history, latest}`                                          | `{history}` only                                                           |
| `BENCH_ITERATIONS` 10, `BENCH_THRESHOLD` 40, no minimum time                | 30, 15, and `BENCH_MIN_TIME` 200 ms                                        |
| A 1.x `.bench/report.json`                                                  | Delete it. 2.x appends to it and would mix the old runs in                 |

## References

1. tinybench v5.1.0 source, `Task.benchmark` and `processRunResult`. https://github.com/tinylibs/tinybench/tree/v5.1.0
2. V8, "Sparkplug — a non-optimizing JavaScript compiler". https://v8.dev/blog/sparkplug
3. V8, "Maglev — V8's fastest optimizing JIT". https://v8.dev/blog/maglev
4. Barrett et al., "Virtual Machine Warmup Blows Hot and Cold", OOPSLA 2017. https://arxiv.org/abs/1602.00602
5. Node.js, command-line options, `NODE_OPTIONS`. https://nodejs.org/api/cli.html#node_optionsoptions
6. V8, "JavaScript code coverage". https://v8.dev/blog/javascript-code-coverage
7. Node.js, "How to write and run benchmarks in Node.js core". https://github.com/nodejs/node/blob/main/doc/contributing/writing-and-running-benchmarks.md
8. CodSpeed, "Benchmarks in CI: Escaping the Cloud Chaos". https://codspeed.io/blog/benchmarks-in-ci-without-noise
9. Laaber, Scheuner and Leitner, "Software microbenchmarking in the cloud. How bad is it really?", Empirical Software Engineering 2019. https://link.springer.com/article/10.1007/s10664-019-09681-1
10. Mocha, parallel tests. https://mochajs.org/#parallel-tests
11. Google Benchmark, "Reducing variance". https://google.github.io/benchmark/reducing_variance.html
12. LLVM, "Benchmarking tips". https://llvm.org/docs/Benchmarking.html
13. Gernot Heiser, "Systems Benchmarking Crimes". https://gernot-heiser.org/benchmarking-crimes.html
14. Mocha, command-line option `--exit`. https://mochajs.org/running/cli/#--exit
15. supertest v6.3.4 source, `serverAddress`. https://github.com/ladjs/supertest/blob/v6.3.4/lib/test.js
16. Evan Miller, "How Not To Run an A/B Test". https://www.evanmiller.org/how-not-to-run-an-ab-test.html

## License

MIT. See [LICENSE](./LICENSE).
