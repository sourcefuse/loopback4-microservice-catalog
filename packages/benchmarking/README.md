# @sourceloop/benchmarking

Benchmark helpers for Mocha. We write a benchmark the same way we write a test. Each run measures the callback with [tinybench](https://github.com/tinylibs/tinybench) and appends its throughput to a JSON run file. Two commands do the rest:

- `bench-compare` compares the run files of two builds, recorded on the same machine, and exits 1 on a regression.
- `bench-select` picks the benchmark files that a change can affect, so a pull request runs fewer of them.

## What this is, and what it is not

This is a regression check on the throughput of one logical operation, run serially.

It is not a load test. The harness runs one callback at a time and does not model arrival rates or concurrent users. If our callback opens ten connections in parallel, that is our code's concurrency, see "Read `Promise.all` throughput as batches" below. For real concurrent load, use [`@sourceloop/load-testing`](../load-testing), k6 or Artillery.

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

Each item says where it comes from:

- _field_: learned from a large service suite with this harness, where benchmarks varied by 10 to 60 percent between runs before these fixes.
- _research [n]_: from the numbered references at the end.

### Write the callback

- **Do declare the callback `async`.** tinybench works out whether a plain function is async by calling it once, unmeasured. _research [1]_

  ```ts
  bench.it('creates an order', async () => {
    await service.create(fixture);
  }); // good
  bench.it('creates an order', () => service.create(fixture)); // bad
  ```

- **Do measure one operation.** When a four-step "order flow" regresses, you must bisect by hand. Four benchmarks name the slow step themselves. _field_
- **Do keep setup out of the measured time.** Build fixtures in Mocha `before`, or in a `beforeAll`/`beforeEach` hook. With warm-up on, `beforeAll` runs twice: once for warm-up and once for the run. Otherwise a change to a fixture builder reads as a regression. _field_
- **Don't call the network or a shared database.** That measures somebody else's uptime, and two CI jobs on one database show up in each other's numbers. Use in-memory fakes or a container that the run owns. _field_
- **Don't benchmark a mock.** If the expensive part is stubbed, the number tracks the stub. _field_
- **Don't assert on time in the callback.** 50 ms on a laptop is 300 ms on a shared runner. Let `bench-compare` judge two builds on one machine. _field_
- **Do read `Promise.all` throughput as batches.** With 100 calls in one callback, throughput counts batches per second. Divide by 100, and say so in the title. _field_

### State and lifecycle

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

- **Don't let an iteration depend on the one before it.** A cache that the first iteration fills, or an id that grows, makes later iterations measure something else. _field_
- **Do remember that the hooks also run during warm-up.** They receive the mode, `'warmup'` or `'run'`, as their argument. _research [1]_
- **Do clean up in Mocha `after`, not only in `afterAll`.** tinybench skips `afterAll` when an iteration throws. _research [1]_
- **Don't open connections at the top level of a benchmark file.** `bench-select` loads every file to read its links. Open them in Mocha `before`. _this package_

### Measure

- **Don't set `BENCH_MIN_TIME=0` for fast benchmarks.** With a fixed count alone, a benchmark that takes microseconds per call was timed for under a millisecond, and varied by up to 24 percent between processes. 200 ms of samples brought that under 3 percent. _field_
- **Do keep warm-up on.** V8 compiles hot code in tiers (Ignition, Sparkplug, Maglev, TurboFan). Early iterations run slower code than later ones. _research [2][3]_
- **Don't expect warm-up to guarantee a steady state.** Some benchmarks never settle, or settle at a slower speed. That is why `bench-compare` uses several runs and removes outliers. _research [4]_
- **Do give a noisy fast benchmark more iterations, not the whole suite.** Use `{iterations: config.iterations * 3}`, so `BENCH_ITERATIONS` still scales it. _field_
- **Do force garbage collection outside the measured time if GC pauses dominate.** Start Node with `--expose-gc` and call `global.gc()` in `beforeEach`. Node accepts `--expose-gc` in `NODE_OPTIONS`. _field, research [5]_
- **Don't put V8 tuning flags in `NODE_OPTIONS`.** Node rejects most of them there, for example `--single-threaded-gc`. Pass them per process, for example `lb-mocha --node-option single-threaded-gc`, and use the same flags on both sides. V8 flags are not stable between Node versions. _field, research [5]_
- **Don't benchmark with coverage on.** Coverage tools (`nyc`, `c8`) count code in V8, and that changes how V8 optimises it. _research [6]_
- **Don't read `throughput.mean` as 1000 ÷ mean latency.** tinybench takes the mean of each sample's rate, so a few very fast samples raise it. Compare it only with the same number from the other build. _research [1]_

### Run

- **Do run each benchmark file in its own process.** Node's own benchmark tool runs every configuration in a separate process, because V8 optimisation depends on what ran before. _field, research [7]_
- **Do run base and head in one job, on one machine, alternating.** Hosted CI runners get different CPU models from run to run, and the noise between cloud instances is larger than the noise inside one. _field, research [8][9]_
- **Don't use Mocha `--parallel` for benchmarks.** Mocha says parallel mode is not for timing-sensitive tests. Parallel workers also share the CPU and the run file. _research [10]_
- **Don't run two benchmark jobs on one machine at the same time.** They compete for CPU, cache and memory bandwidth. _research [11][12]_
- **Do quiet the machine for local runs.** Close other programs, keep a laptop on mains power, and on Linux set the CPU frequency governor to `performance`. _research [7][11][12][13]_
- **Do set `UV_THREADPOOL_SIZE` at process start, and the same on both sides, if the code is heavy on `fs`, `crypto` or `dns`.** libuv sizes its thread pool once, with 4 threads by default. _research [14]_
- **Don't compare numbers across machines or Node versions.** State the platform (Node version, CPU, flags) with every result you share. _research [8][15]_

### Compare and read results

- **Do collect at least five rounds per side.** A noise value from three runs is itself noisy. Five rounds steadied the thresholds. _field_
- **Do check a suspect again before you act.** Use `--suspects` and a second pass. Noise rarely moves a benchmark past its threshold twice; a real slowdown does it every time. _field_
- **Do expect a false alarm in a large suite.** At 5 percent risk per benchmark, one benchmark in 20 shows a difference that does not exist. The second pass catches most of them. _research [7]_
- **Don't tighten `BENCH_THRESHOLD` below what the noise allows.** At 2.66 percent run-to-run variation on hosted runners, a 2 percent threshold gives a false alarm on roughly half the runs. _research [8]_
- **Don't rename benchmarks casually.** A rename shows as "missing from head" and exits 1. Accept it once, on purpose. _this package_
- **Don't commit run files.** They belong to one machine and one run, and a changed file makes a monorepo tool such as lerna treat the package as changed. _field_

### Select

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
11. pyperf, "Tune the system for benchmarks". https://pyperf.readthedocs.io/en/latest/system.html
12. Google Benchmark, "Reducing variance". https://google.github.io/benchmark/reducing_variance.html
13. LLVM, "Benchmarking tips". https://llvm.org/docs/Benchmarking.html
14. libuv, thread pool work scheduling. https://docs.libuv.org/en/v1.x/threadpool.html
15. Gernot Heiser, "Systems Benchmarking Crimes". https://gernot-heiser.org/benchmarking-crimes.html

## License

MIT. See [LICENSE](./LICENSE).
