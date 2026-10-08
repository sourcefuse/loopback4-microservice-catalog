# @sourceloop/benchmarking

Benchmark helpers for Mocha. We write a benchmark the same way we write a test, and the build fails when throughput drops further than we allow against a tracked baseline.

The package wraps [tinybench](https://github.com/tinylibs/tinybench) and keeps a rolling history of results in a JSON file that we commit. Nothing else to run, no separate benchmark runner, no dashboard.

## What this is, and what it is not

This is a regression gate on the latency of one logical operation, run serially.

It is not a load test. The harness runs one callback at a time and does not model arrival rates or concurrent users, so it will not tell us how the service behaves at 500 people hitting it at once. If our callback opens ten connections in parallel, that is our code's concurrency, and the numbers shift because of it, see the `Promise.all` note below. For arrival rate or real concurrent load, reach for k6 or Artillery. What we get here is narrower, and still useful: did the change we just made slow down this one operation.

We picked that scope on purpose. A serial latency gate is cheap enough to run on every pull request. A real load test is not.

## Install

```sh
npm install --save-dev @sourceloop/benchmarking
```

Node 22.12 or later, or Node 24. The floor is higher than the rest of this monorepo, which allows Node 22.0 upward. tinybench 5 ships as ESM only, and this package compiles to CommonJS, so loading it depends on `require(esm)`. That landed as stable in 22.12 and is flagged as experimental before it. We would rather state an honest floor than have the package fail on a Node version we claimed to support.

Mocha is a peer dependency. We do not pull our own copy in, we use the one already in the project.

## Quickstart

```ts
import {bench} from '@sourceloop/benchmarking';
import {OrderService} from '../services';

bench.describe('order service', () => {
  let service: OrderService;

  before(async () => {
    service = await givenOrderService();
  });

  bench.it('creates an order', async () => {
    await service.create(orderFixture);
  });
});
```

Run it:

```sh
BENCH_UPDATE_BASELINE=1 npm run test:benchmark
```

The first few runs record samples and pass without judging anything. Once the history holds `BENCH_MIN_SAMPLES` entries, the gate turns on.

`bench.describe` and `bench.it` both prefix the title with `benchmark:`. That prefix is what lets a normal test run skip all of this:

```jsonc
{
  "scripts": {
    "test": "lb-mocha --grep 'benchmark:' --invert \"dist/__tests__\"",
    "test:benchmark": "lb-mocha \"dist/__tests__/acceptance\"",
  },
}
```

Mocha matches `--grep` against the full title path, so the prefix on either the suite or the test is enough.

## Settings

Everything is an environment variable. There is no config file and no options object, because these values change per environment, not per call site.

| Variable                | Default                | Range                       | What it does                                                                                                                                                                             |
| ----------------------- | ---------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BENCH_ITERATIONS`      | `10`                   | 1 to 1000                   | How many times tinybench runs the callback.                                                                                                                                              |
| `BENCH_OPS_TO_TRACK`    | `10`                   | 1 to 100                    | Size of the rolling history window.                                                                                                                                                      |
| `BENCH_MIN_SAMPLES`     | `3`                    | 1 to `BENCH_OPS_TO_TRACK`   | Samples needed before the gate starts failing builds. The window never holds more than `BENCH_OPS_TO_TRACK`, so a higher floor is clamped down rather than leaving the gate off forever. |
| `BENCH_THRESHOLD`       | `40`                   | 0 to 100                    | Percent drop we tolerate before the run fails. `0` fails on any drop at all, it does not turn the gate off.                                                                              |
| `BENCH_WARMUP`          | on                     | `false` to disable          | Runs one unmeasured warmup iteration.                                                                                                                                                    |
| `BENCH_UPDATE_BASELINE` | off                    | `1` to enable               | Writes the result file. Without this, nothing is saved.                                                                                                                                  |
| `BENCH_REPORT_FILE`     | `./.bench/report.json` | any path inside the project | Where the history lives.                                                                                                                                                                 |
| `BENCH_FORCE_BASELINE`  | off                    | `1` to enable               | On a run that regressed, throws the window away and restarts from that run. Ignored otherwise.                                                                                           |
| `CI`                    | off                    | `true` to enable            | Prints a line per benchmark with throughput, latency and deviation.                                                                                                                      |

Out of range numbers get clamped rather than rejected, so `BENCH_ITERATIONS=5000` becomes 1000. Anything that is not a whole number falls back to the default instead, including a fraction: `BENCH_ITERATIONS=7.5` runs ten iterations, not seven. `BENCH_THRESHOLD` is the one exception and takes a fraction such as `7.5`. A report path containing `..` is rejected outright, so a stray variable cannot write outside the project.

The default threshold of 40 percent is loose, and that is deliberate. CodSpeed measured around 2.7 percent run to run variation on GitHub hosted runners, which is enough to make a 2 percent gate fail roughly half the time on code that did not change. A gate nobody trusts gets disabled within a month. Start loose, tighten once the history shows what the real noise is.

## How the gate decides

We keep a list of past throughput means per benchmark. Each run compares against the average of the last `BENCH_OPS_TO_TRACK` entries:

```
deviation = ((current - average) / average) * 100
```

Negative means slower. The run fails when `deviation < -BENCH_THRESHOLD`.

Three things about this are worth knowing before trusting the output.

We compare against a window average, not against the single previous run. github-action-benchmark compares to the previous result by default, which means one lucky fast run quietly raises the bar for everything after it. An average over ten runs absorbs that.

Below `BENCH_MIN_SAMPLES` the gate stays quiet. A new benchmark records its result and passes, and with `CI=true` it prints how many runs it has recorded against how many it needs. Failing a build on a comparison against one prior sample is a coin flip, not a signal.

When a run regresses, we do not add it to the history. The window stays exactly as it was. This one is our own choice and it has no precedent in bencher, github-action-benchmark or CodSpeed, all of which append every result regardless of outcome. Their way is statistically cleaner. Ours prevents a slow bleed, where three merges each lose 15 percent, none of them trips a 40 percent gate on its own, and the baseline drifts down with them until the service is half as fast and the benchmark is still green. Our baseline means last known good, not most recent.

`BENCH_FORCE_BASELINE=1` is the way back out. It only does something on a run that actually regressed, and there it replaces the whole window with that run. A slowdown small enough to pass the gate needs no reset, because it is already in the history.

## Writing benchmarks that mean something

A benchmark that measures the wrong thing is worse than no benchmark. It costs CI minutes, it fails on unrelated changes, and people learn to rerun it until it passes.

### The callback must be async

```ts
// good
bench.it('creates an order', async () => {
  await service.create(fixture);
});

// bad
bench.it('creates an order', () => service.create(fixture));
```

Both return a promise, but tinybench 5 works out whether a plain function is async by calling it once and looking at the result. That extra call is not measured and it is not cleaned up. Declaring `async` skips the probe.

### Measure one operation

```ts
// good
bench.it('validates an order payload', async () => {
  await validator.validate(payload);
});

// bad
bench.it('order flow', async () => {
  const user = await createUser();
  const cart = await fillCart(user);
  await checkout(cart);
  await sendConfirmationEmail(cart);
});
```

When the second one regresses by 45 percent, we have learned nothing except that something in four operations got slower. Then we spend an afternoon bisecting by hand. Split it into four benchmarks and the failing one names itself.

### Keep setup out of the measurement

```ts
// good
let payload: OrderPayload;
before(() => {
  payload = buildLargeOrderPayload();
});
bench.it('validates an order payload', async () => {
  await validator.validate(payload);
});

// bad
bench.it('validates an order payload', async () => {
  const payload = buildLargeOrderPayload();
  await validator.validate(payload);
});
```

Fixture construction lands in the number. If someone later adds a field to the fixture builder, the benchmark regresses and the validator never changed.

### Never touch the network or a shared database

```ts
// bad
bench.it('fetches exchange rates', async () => {
  await fetch('https://api.example.com/rates');
});
```

This measures somebody else's uptime. It will fail on a Friday for reasons nobody in the repo can fix. Point benchmarks at in-memory fakes or a container the run owns.

The same goes for a shared database. If two CI jobs hit the same instance, each one shows up in the other's numbers.

### Each iteration must leave the world as it found it

```ts
// bad
const queue: Order[] = [];
bench.it('enqueues an order', async () => {
  queue.push(await buildOrder());
});
```

Iteration 500 works on a much bigger array than iteration 1. We are measuring array growth. Reset shared state in the callback, or use a structure where the operation costs the same every time.

### Do not assert on absolute time

```ts
// bad
bench.it('creates an order', async () => {
  const start = Date.now();
  await service.create(fixture);
  expect(Date.now() - start).to.be.lessThan(50);
});
```

50 milliseconds on a developer laptop is 300 on a shared runner. The whole point of the baseline is that it is relative to the same machine class over time. Let the gate do the judging, keep assertions out of the callback.

### Do not benchmark a mock

```ts
// bad
const repo = createStubInstance(OrderRepository);
repo.create.resolves(fixture);
bench.it('creates an order', async () => {
  await new OrderService(repo).create(fixture);
});
```

If the expensive part is stubbed, the number tracks sinon's dispatch cost. Mock at the network edge if we must, and keep the code under measurement real.

### Watch what the number counts

```ts
bench.it('creates 100 orders', async () => {
  await Promise.all(orders.map(o => service.create(o)));
});
```

This is legitimate, as long as we read it correctly. Throughput here is batches per second, not orders per second. Divide by 100 for per order cost. The name should say so, otherwise the next person reads the dashboard wrong.

## Where the noise comes from

These numbers carry real noise, so treat a failure as a prompt to go and look rather than proof of a regression. V8 optimises hot loops and deoptimises when object shapes change, so a benchmark can measure a fast path that production never hits. A GC pause inside one iteration drags the mean with it, and CI runners add a few percent on their own from noisy neighbours and CPU throttling.

That is why the threshold defaults to a loose 40 percent and why we compare against a window rather than the last run. Reproduce a failure locally before reverting anything.

## Running in CI

The result file is committed. That is what makes the history survive between runs, and it also means a regression shows up in review as a diff on `.bench/report.json`. Keep an eye on it in review, because an unreadable file resets the history and the gate prints a warning and passes.

The history is keyed by the full Mocha title path, so renaming a suite or a benchmark orphans its samples and starts a fresh baseline. That is worth a second of thought before a tidy-up rename.

Mocha's `--parallel` mode is not supported. Every benchmark reads and rewrites the same file, so two workers would overwrite each other.

Only the baseline branch should write it. On a pull request we want the gate to judge, not to record:

```yaml
- name: Benchmarks
  run: npm run test:benchmark
  env:
    CI: 'true'
    BENCH_UPDATE_BASELINE: ${{ github.ref == 'refs/heads/master' && '1' || '' }}

- name: Commit the baseline
  if: github.ref == 'refs/heads/master'
  run: |
    git add .bench/report.json
    git diff --staged --quiet || git commit -m 'chore: update benchmark baseline [skip ci]'
    git push
```

One job, not two, so the sample we record is the one the gate just judged. An empty `BENCH_UPDATE_BASELINE` reads as off, because only the exact string `1` enables it. If a pull request wrote to the baseline, every branch would be measuring against itself and the gate would never fire. And the commit step matters: without it the file is written on a runner that gets thrown away, and the history never grows.

When a benchmark fails and we decide the slowdown is worth it, say a new validation pass that halves throughput, reset the window on the baseline branch:

```sh
BENCH_UPDATE_BASELINE=1 BENCH_FORCE_BASELINE=1 npm run test:benchmark
```

That only has an effect on a run the gate rejected, which is exactly the case we are recovering from. Then commit the file and say in the commit message why we accepted it. The next person to find a cliff in the history will want that sentence.

## Timeouts

Mocha's default timeout is two seconds, which most benchmarks blow through. `bench.it` sets its own timeout from the iteration count: five seconds, plus two for every iteration and one more for warmup. At the default ten iterations that is 27 seconds. A `.mocharc` timeout is not needed for benchmarks and will not override this.

## API

`bench.describe(title, callback)` declares a suite and prefixes the title. The callback must be synchronous, because Mocha collects the tests inside it while the file loads.

`bench.it(title, callback)` declares a benchmark, runs it, compares it, and fails the test on a regression. The callback must be async.

Both are reached through `bench` and nowhere else. The package exposes one root entry point, so there is no second name for either of them and no way to reach past the barrel into a module.

`config` is a live view of the settings. Every property is a getter that reads `process.env` when accessed, so a test can change a variable after the module is loaded.

The errors all extend `BenchmarkingError`. `PerformanceRegressionError` carries `deviation` and `threshold` as fields so nothing has to parse a message. `BenchmarkError` means the run itself failed, which is different from a regression and should be triaged differently. `ReporterError` wraps a failure to read or write the result file and keeps the original on `cause`. `BenchmarkConfigError` means a setting was refused, currently only a report path pointing outside the project.

## License

MIT. See [LICENSE](./LICENSE).
