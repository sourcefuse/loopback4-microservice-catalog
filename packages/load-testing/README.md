# @sourceloop/load-testing

Load tests for the HTTP API of a LoopBack facade or service. We write
scenarios in TypeScript, next to our other tests. The package turns each
scenario into an [Artillery](https://www.artillery.io) script, and runs it
against an app that already runs. It fails the run when an endpoint is too slow,
has too many errors, or got slower than its baseline. It also fails the run
when the project has too many heavy APIs.

This package is for load. For a serial latency gate on one operation, with no
concurrent users, use
[`@sourceloop/benchmarking`](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/packages/benchmarking).
The two work well together. The benchmark guards the code, and the load test
guards the running system.

Contents:

- [What this is, and what it is not](#what-this-is-and-what-it-is-not)
- [How a run works](#how-a-run-works)
- [Words we use](#words-we-use)
- [Install](#install)
- [Quickstart](#quickstart)
- [Set up a package in a facade and service monorepo][setup]
- [config.ts](#configts)
- [Write scenarios](#write-scenarios)
- [Set the load](#set-the-load)
- [Hooks](#hooks)
- [Test data](#test-data)
- [Datasources](#datasources)
- [Log in](#log-in)
- [Thresholds and the verdict](#thresholds-and-the-verdict)
- [Report](#report)
- [Baseline](#baseline)
- [Command line and environment](#command-line-and-environment)
- [Run in CI](#run-in-ci)
- [Engines](#engines)
- [Use any Artillery feature](#use-any-artillery-feature)
- [Errors](#errors)
- [Troubleshooting](#troubleshooting)
- [Limits](#limits)
- [Source layout](#source-layout)
- [License](#license)

[setup]: #set-up-a-package-in-a-facade-and-service-monorepo

## What this is, and what it is not

This package load tests the HTTP API of one running app. The app can be a
facade or a service. A scenario is a list of requests that a virtual user sends.
The package sends many such users at the rate we choose, measures the p95
time of each endpoint, and judges it.

It has limits on purpose.

- It does not start apps or databases. We start them before the run.
- It is not a browser test. Only the HTTP engine of Artillery runs.
- It runs on one machine. It does not spread the load over many machines.
- It does not check where the URLs point. The scenarios create and delete data.
  We run them only against a local or a test environment, never against
  production.

## How a run works

`load-testing run <package-dir>` does these steps, in this order.

1. Read the environment (`LOAD_TESTS_BASE_URL`, `LOAD_TESTS_AUTH_URL` and the
   login variables).
2. Read `src/__tests__/load/config.ts` from `dist`, and check its values.
3. Load every `*.load.ts` file from `dist/__tests__/load`. Check the names, the
   limits, the phases and the values of each scenario.
4. Choose the scenarios to run (`.only` and `.skip`). Stop with a
   `ConfigError` when one of them sends `token()` and no login is set.
5. Check that every endpoint of the scenarios that run is in
   `src/openapi.json`.
6. Log in, when `LOAD_TESTS_USERNAME` is set.
7. Read the baseline file, if it exists.
8. For each scenario, one after another:
   1. Get a fresh access token, if the old one is more than a minute old.
   2. Run `before`.
   3. Run the token check, if the scenario sends `token()`.
   4. Write the Artillery script (and the worker hooks file), and try the
      worker hooks once.
   5. Run the phases with Artillery, and read its report.
   6. Run `after`, then the cleanups (the last one first), then close the SQL
      connections.
   7. Judge the scenario against its limits and the baseline.
9. Judge the run. Every scenario must pass, and the count of heavy APIs must be
   at most `maxHeavyApis`.
10. Print the report with the reporters.
11. Save the baseline, if `LOAD_TESTS_UPDATE_BASELINE=1`. A failed run is not
    saved, unless `LOAD_TESTS_FORCE_BASELINE=1`.
12. Exit with 0 when the run passed, and with 1 when it did not.

Step 8.6 runs also when `before` or the load failed, and after a signal.

## Words we use

| Word | Meaning |
| --- | --- |
| Scenario | One `load.it`. A list of requests that one virtual user sends. We name it after what a user does. |
| Endpoint id | `METHOD path`, for example `GET /orders/{id}`. Results and baselines use it. |
| Vuser | A virtual user. It runs the steps of a scenario once. |
| Phase | One step of the load, for example `{duration: 60, arrivalRate: 10}`. A load is a list of phases. |
| Workload | The load of a scenario as one line of text, for example `10 vusers/s for 60 s`. |
| p95 | The time that 95% of the requests beat, in milliseconds. The time runs to the first byte of the response. It does not include the download of the body. |
| Limit | The highest value that passes. Each threshold has one. |
| Baseline | The mean p95 of the last 10 recorded runs of an endpoint. |
| Heavy API | An endpoint with a `p95` limit above `P95_TARGETS.supportingApi` (1000 ms). |
| Hook | A function that runs at a set point of a run, for example `before`. |
| Value | An object that the engine fills in at run time, for example `randomString()`. |
| Datasource | A named database connection that `ctx.sql` can use. |
| Engine | The part that runs the load and measures it. The default is Artillery. |
| Reporter | The part that gets the result of the run. The default prints to the console. |

## Install

```sh
npm install --save-dev @sourceloop/load-testing
```

What we need to know before the install.

- We need Node 22 from 22.18, or Node 24. Odd releases are not supported. The
  `engines` field of the package says `>=22.18.0 <23 || 24`. The floor comes
  from Artillery 2.0.34, which asks for Node 22.18 or later.
- Artillery comes with the package as a dependency, pinned to 2.0.34. We
  install nothing else for it. An install of this package into an empty
  project adds 468 packages (npm 11, Artillery 2.0.34, measured on
  2026-10-09). Artillery has the MPL-2.0 license. We use it unmodified.
- Artillery lists `@playwright/browser-chromium`, and that package downloads a
  browser in its install script. We do not need the browser, because this
  package uses only the HTTP engine of Artillery. We skip the download with
  `npm install --ignore-scripts`, or we set `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`
  before the install.
- `pg` is an optional peer dependency. We install it only when a datasource has
  `type: 'postgres'`. See [Datasources](#datasources).
- We compile with `skipLibCheck: true`. The type file of Artillery 2.0.34
  (`artillery/types.d.ts`) has an error of its own. The LoopBack `tsconfig` of
  an ARC app already sets this option.

The Artillery engine switches the Artillery telemetry off
(`ARTILLERY_DISABLE_TELEMETRY`), so Artillery sends no usage data.
Artillery also gets only a short list of the variables of the CLI. See
[The environment of Artillery](#the-environment-of-artillery).

The package finds Artillery when the first scenario runs, not at import. If it
is missing, the run stops with this message:

```text
artillery is missing from @sourceloop/load-testing: reinstall the package
```

## Quickstart

This is the shortest working setup, in the facade `orders-facade`. We assume
that the facade has an `npm run build` script and a committed
`src/openapi.json`. See
[Set up a package](#set-up-a-package-in-a-facade-and-service-monorepo).

First, `src/__tests__/load/config.ts`. It holds the default load.

```ts
import type {LoadTestConfig} from '@sourceloop/load-testing';

const config: LoadTestConfig = {
  phases: [{name: 'steady load', duration: 30, arrivalRate: 10}],
};

export default config;
```

Second, one scenario file, `src/__tests__/load/orders.controller.load.ts`.

```ts
import {captureFrom, load, template, token} from '@sourceloop/load-testing';

load.describe(
  'OrderController',
  {headers: {authorization: template`Bearer ${token()}`}},
  () => {
    load.it('browse orders and customers', [
      load.get('/orders', {query: {limit: 20}}),
      load.get('/orders/{id}', {
        pathParams: {id: captureFrom('GET /orders', '$[0].id')},
      }),
      load.get('/customers', {query: {limit: 20}}),
    ]);
  },
);
```

Third, two scripts in the `package.json` of the facade.

```json
{
  "scripts": {
    "pretest:load": "npm run build",
    "test:load": "load-testing run ."
  }
}
```

Fourth, the environment. The login user is a test user (see
[Log in](#log-in)). The password and the secret come from the shell or from CI
secrets, never from a file in git.

```sh
export LOAD_TESTS_BASE_URL=http://localhost:3000
export LOAD_TESTS_USERNAME=load-test@example.com
export LOAD_TESTS_PASSWORD="$LOAD_TEST_PASSWORD"
export LOAD_TESTS_CLIENT_ID=load-test-client
export LOAD_TESTS_CLIENT_SECRET="$LOAD_TEST_CLIENT_SECRET"
```

Last, run it. The orders facade must already run at the base URL.

```sh
npm run test:load
```

The CLI prints `Scenario: <name>` before each scenario, and Artillery prints its
own progress while the load runs. At the end the console reporter prints the
result. This is the first run, so no baseline exists yet.

```text
Results

OrderController › browse orders and customers
Workload: 10 vusers/s for 30 s
Vusers:   300 started, 300 completed, 0 failed (limit 1%)

Endpoint          Requests  Req/s  p95 ms (limit)  Base ms  Err % (limit)  Result
GET /orders       300       9.9    41.2 (500)      -        0 (1)          pass (no baseline)
GET /orders/{id}  300       9.9    36.8 (500)      -        0 (1)          pass (no baseline)
GET /customers    300       9.9    52.3 (500)      -        0 (1)          pass (no baseline)

Coverage: 3 of 41 endpoints in src/openapi.json
No src/__tests__/load/.out/baseline.json. Run once with LOAD_TESTS_UPDATE_BASELINE=1 to record it.

A vuser is one virtual user. It runs the steps of a scenario one time. Failed means that its run stopped on an error.
```

The run passes, and the exit code is 0. To record the baseline, run again with
`LOAD_TESTS_UPDATE_BASELINE=1`. Later runs compare each p95 with it. See
[Baseline](#baseline). The numbers above are an example, and ours will differ.

## Set up a package in a facade and service monorepo

Our monorepos hold facades and services. A facade takes the request from the
client, calls one or more services, and each service reads its own database.

### Where the tests live

We put the load tests in the facade in most cases. A request to the facade
passes through the whole path, from the facade to the services and to the
databases. So one test covers all of it. A service can have its own load tests
too, for an endpoint that clients do not reach through a facade. The set-up is
the same for both, and each package has its own `config.ts`, scenarios and
baseline.

### Build first

The package does not compile our TypeScript. It loads the files that `tsc`
made, from `dist`. For `src/__tests__/load/<name>.load.ts` it loads
`dist/__tests__/load/<name>.load.js`. So we build before each run. The
`pretest:load` script of the quickstart does it.

- A missing built file stops the run, and the message names the file.
- A built file that has no source file is never loaded.
- The build step must keep `dist/__tests__`. Most services of this catalog run
  `openapi-spec` in `build` or `postbuild`. Their `preopenapi-spec` hook runs
  `rm -rf dist/__tests__`, and it runs on every call of `openapi-spec`. So
  after it, we compile again. The `pretest` script of such a service does it,
  and `pretest:load` can do the same, for example
  `"pretest:load": "npm run clean && lb-tsc"`.

### The OpenAPI file

The CLI checks every endpoint of the scenarios against `src/openapi.json`. The
run stops when a request names an endpoint that the file does not have. The
report also shows how many endpoints of the file the scenarios cover.

ARC apps have an `openapi-spec` script. It boots the built app from `dist`,
and writes the spec to the path that we pass. We build the app first, then we
run the script file with `node`. We generate the file, and we commit it.

```sh
npm run build
node ./dist/openapi-spec src/openapi.json
```

In an app that the ARC generator made,
`npm run openapi-spec -- src/openapi.json` also works, because its
`preopenapi-spec` hook builds the app first. Some
scripts have several commands, as in some catalog services. Then npm gives the
path to the last command only. So we call `node` directly.

We run this again after each change of a route, so the file stays current. The
CLI does not fetch the spec from the running app. The apps serve it behind
Basic auth when `authenticateSwaggerUI` is on in the core config.

### Keep load files out of the unit tests

The unit test run of the package loads `dist/__tests__`, and that folder now
holds the load files. A load file is not a unit test. We tell Mocha to ignore
the folder in `.mocharc.json`.

```json
{
  "exit": true,
  "recursive": true,
  "require": "source-map-support/register",
  "ignore": ["dist/__tests__/load/**"]
}
```

### Ignore the generated files

The CLI writes its generated files to `src/__tests__/load/.out/`. These are the
Artillery scripts, the worker hooks files, the reports and `baseline.json`.
We add this line to `.gitignore` and to `.prettierignore` of the package.
Prettier reads only the ignore files of the folder where it runs, so without
the line `npm run lint` fails after a load run.

```text
src/__tests__/load/.out
```

The baseline is the one file that we can keep between CI runs. See
[Baseline](#baseline).

### Folder layout and naming

The CLI finds every `*.load.ts` file under `src/__tests__/load/`, also in
subfolders, in the order of the paths. We do not list them.

```text
src/__tests__/load/
  config.ts
  orders.controller.load.ts      scenarios, request bodies, short hooks
  order-items.controller.load.ts
  fixtures/
    run.ts                       run id, name prefix
    api.ts                       small calls through ctx.api
    customer.ts                  customers
    order.ts                     orders and their statuses
    order-item.ts                items of an order
    index.ts                     exports all of the above
```

- A load file holds the scenarios. Its hooks only call functions of
  `fixtures/`. A load file never imports another load file.
- A fixture file makes and removes the rows of one entity. A function that
  makes data starts with `given`, for example `givenCustomer`. It registers the
  cleanup of what it made with `ctx.defer`, right after the create. A function
  that removes data starts with `cleanup`.
- A fixture file can import the fixtures of an entity that it needs. There must
  be no import cycle. If an order needs a customer, `order.ts` imports
  `customer.ts`, and `customer.ts` never imports `order.ts`.
- The CLI loads only `*.load.ts` files. A file in `fixtures/` is an import.
- We name a scenario after what a user does, for example "browse orders and
  customers". The report shows the name as the heading of the scenario. A name
  such as "returns 200" tells the reader nothing.

A fixture function takes the `RunContext` that `before` gets. We import the
type with `import type`, because the package lints with
`@typescript-eslint/consistent-type-imports`. This is `fixtures/customer.ts`.
The fixture sends the token itself, because `ctx.api` does not. See
[The ctx of before and after](#the-ctx-of-before-and-after).

```ts
import type {RunContext} from '@sourceloop/load-testing';

export async function givenCustomer(ctx: RunContext): Promise<string> {
  const api = ctx.api.with({
    headers: {authorization: `Bearer ${ctx.token}`},
  });
  const customer = await api.post<{id: string}>('/customers', {
    name: 'loadtest-customer',
  });
  ctx.defer(() => api.delete(`/customers/${customer.id}`));
  return customer.id;
}
```

The hook of a scenario calls it, for example
`runVars.customerId = await givenCustomer(ctx)`.

### The public types

The package exports these types. We import them with `import type`, and the
values (`load`, `vars`, `token` and so on) with a normal import.

| Use | Types |
| --- | --- |
| Hooks and `ctx` | `RunContext`, `Vars`, `UserContext`, `BeforeEachContext`, `HookRequest`, `HookResponse`, `Hooks`, `Api`, `ApiOptions`, `ApiClientOptions`, `Sql`, `QueryResult` |
| Scenarios and requests | `ScenarioOptions`, `GroupOptions`, `RequestOptions`, `LoadRequest`, `Method`, `ParallelGroup`, `FlowItem`, `StepInput`, `RawStep`, `Scenario`, `Phase`, `Thresholds`, `HeaderMap` |
| Values | `Value`, `Var`, `Capture`, `Token`, `Template`, `Uuid`, `RandomNumber`, `RandomString` |
| `config.ts` | `LoadTestConfig`, `TokenCheck`, `ArtilleryConfig`, `Datasource`, `PostgresDatasource`, `PostgresOptions`, `CustomDatasource`, `SqlConnector`, `Connection` |
| Engines and reporters | `Engine`, `EngineRun`, `Measurement`, `Reporter`, `RunResult`, `ScenarioResult`, `EndpointResult`, `EndpointStats`, `VuserCounts`, `HeavyApis`, `HeavyEndpoint` |

## config.ts

`src/__tests__/load/config.ts` holds the settings of the package. It exports a
`LoadTestConfig` as its default. The CLI loads its built file, like a scenario
file. Only `phases` is required.

The type checks the keys when we build. When the CLI starts, it also checks the
values, before it logs in. A problem stops the run with a `ConfigError` that
lists each problem on its own line.

| Key | Type | Default | Use |
| --- | --- | --- | --- |
| `phases` | `Phase[]` | none, required | The default load. A list with at least one phase. See [Set the load](#set-the-load). |
| `thresholds` | `{default?: Thresholds}` | `p95` 500, `p95Regression` 20, `minDelta` 10, `errorRate` 1 | Default limits for each endpoint. See [Thresholds and the verdict](#thresholds-and-the-verdict). |
| `maxHeavyApis` | whole number, 0 or more | `0` | How many heavy APIs the package can have. |
| `datasources` | `Record<string, Datasource>` | none | The databases that `ctx.sql` can use. See [Datasources](#datasources). |
| `tokenCheck` | `TokenCheck` | the default token check | Replaces the default check of the token life. See [Log in](#log-in). |
| `reporters` | `Reporter[]` | `[consoleReporter()]` | Who gets the result. An empty list prints no result. See [Report](#report). |
| `engine` | `Engine` | `artillery()` | Who runs the load. See [Engines](#engines). |
| `artillery.config` | `ArtilleryConfig` | none | Artillery `config` options for every scenario. See [Use any Artillery feature](#use-any-artillery-feature). |
| `artillery.env` | `string[]` | none | The exact names of more variables to pass to Artillery, only when the CLI has them. For example `['MY_REGION']`. See [The environment of Artillery](#the-environment-of-artillery). |

An example with every key. A real package sets only the keys that it needs.

```ts
import type {LoadTestConfig} from '@sourceloop/load-testing';
import {
  P95_TARGETS,
  artillery,
  consoleReporter,
} from '@sourceloop/load-testing';

const config: LoadTestConfig = {
  phases: [
    {name: 'warm up', duration: 10, arrivalRate: 1, rampTo: 10},
    {name: 'steady load', duration: 60, arrivalRate: 10},
  ],
  thresholds: {
    default: {p95: P95_TARGETS.userBlockingApi, errorRate: 1},
  },
  maxHeavyApis: 0,
  datasources: {
    orders: {
      type: 'postgres',
      url: process.env.ORDERS_DB_URL,
      database: 'orders',
    },
  },
  tokenCheck: ({claims}) => {
    if (claims.exp === undefined) {
      throw new Error('the token has no exp claim');
    }
  },
  reporters: [consoleReporter()],
  engine: artillery(),
  artillery: {config: {http: {timeout: 30}}, env: ['MY_REGION']},
};

export default config;
```

`config.ts` has no `headers`. We set headers on `load.describe` or on `load.it`.

The library reads no database variable. `config.ts` reads the environment, and
we choose the name of the variable. When `config.ts` loads, it opens nothing.

The check of `artillery.env` gives these problems.

- `artillery.env must be an array of variable names, for example ["MY_REGION"]`
- `artillery.env[<i>] must be a text that is not empty`
- `artillery.env[<i>] must not have "="`
- `artillery.env[<i>] "<name>" is not allowed: these variables are for the CLI
  only`, for a name that starts with `LOAD_TESTS_` in any letter case.

## Write scenarios

### load.describe and load.it

`load.it(name, requests, options?)` adds one scenario, like `it` of Mocha.
`load.describe(name, options?, fn)` groups the scenarios of a file, like
`describe`. A `load.describe` can hold other `load.describe` blocks. Its
function runs at once, and it cannot be async. A file needs at least one
`load.it`.

```ts
import {load, template, token} from '@sourceloop/load-testing';

load.describe(
  'OrderController',
  {headers: {authorization: template`Bearer ${token()}`}},
  () => {
    load.it('browse orders and customers', [
      load.get('/orders', {query: {limit: 20}}),
      load.get('/customers', {query: {limit: 20}}),
    ]);

    load.it('browse products', [load.get('/products', {p95: 800})]);
  },
);
```

- The scenarios run one after another. Files run in file-name order, and a file
  runs in the order of its `load.it` calls. They share the app, its pools and
  the baseline, so they do not run in parallel. Each scenario has its own load,
  hooks and data.
- The name of a scenario in the report and in `baseline.json` is
  `group › name`, for example `OrderController › browse products`. The CLI
  names the generated files after it, in lower case with `-` between the
  words. Two scenarios cannot make the same file name, and a name needs a
  letter or a digit.
- The file name `baseline` is reserved for the baseline file. The CLI refuses a
  scenario whose file name would be `baseline`, for example `baseline` or
  `Baseline!`, when it loads the scenarios. The message reads
  `The scenario name "<name>" gives the file name "baseline", which the
  baseline file uses. Rename the scenario.` The name `baseline orders` is fine.
- The endpoint id is `METHOD /path`, with the path as we wrote it, for example
  `GET /orders/{id}`.

### Run only some scenarios

| Call | Effect |
| --- | --- |
| `load.it.only(...)`, `load.describe.only(...)` | Only the scenarios with `only` run. |
| `load.it.skip(...)`, `load.describe.skip(...)` | The scenario does not run. The report lists it as `Skipped`. |

- On a `load.describe`, `.only` and `.skip` apply to every scenario inside it.
- `skip` wins over `only`. Only a scenario with `.only` and without `.skip`
  runs. A `.only` on a scenario that also has `.skip` runs nothing. When no
  other scenario has `.only`, nothing runs. The report lists every scenario as
  skipped. This holds only on a local run. With `CI` set, such a `.only` is an
  error (see below).
- A `.only` that stays in a file hides the other scenarios. When the variable
  `CI` is set to a value other than empty, `0` or `false`, a `.only` stops the
  run. The CLI ignores the letter case, so `False` and `FALSE` also mean that
  this is not CI. Any other value means CI. A `.only` stops the run in CI, also
  when the same scenario has `.skip`. The message names the scenarios, like
  `mocha --forbid-only`. We remove the `.only` before we push.
- When `CI` is set and every scenario is skipped, the run stops with
  `No scenario runs: every scenario has .skip`. So a green gate cannot hide that
  nothing ran. A local run prints `Skipped:` lines and exits with 0.
- When `.only` leaves scenarios out, the CLI prints a line such as
  `Only 1 of 2 scenarios run (.only)`.

### Requests

`load.get`, `load.post`, `load.put`, `load.patch` and `load.delete` make a
request. Each takes the path and an options object. A path can hold `{name}`
parts, which `pathParams` fills. A name is any text without braces or a
slash, for example `{id}` or `{order-id}`.

| Option | Use |
| --- | --- |
| `pathParams` | Fills the `{name}` parts of the path. A string, a number or a value. |
| `query` | The query string. A number or a boolean becomes its text. |
| `json` | The JSON body. A value works at any depth, through plain objects and arrays. A `Date` or a class instance goes as it is. |
| `headers` | Headers of this request. They win over the headers of the scenario. |
| `p95`, `errorRate`, `p95Regression`, `minDelta` | Limits of this endpoint. See [Thresholds and the verdict](#thresholds-and-the-verdict). |
| `beforeRequest`, `afterResponse` | Worker hooks of this request. See [Hooks](#hooks). |
| `artillery` | `{raw}`, the Artillery request fields. See [Use any Artillery feature](#use-any-artillery-feature). |

A request object belongs to one place in a flow. To send the same request
twice, call `load.get` twice.

### Values

A value is an object that the engine fills in when a vuser sends a request. It
works in the `json`, `pathParams`, `headers` and `query` of a request. The
scenario holds no `{{ }}` engine syntax.

| Call | Gives |
| --- | --- |
| `vars(name)` | What `before` set in `vars`, or what `beforeEach` returned. |
| `captureFrom(from, jsonPath)` | A part of the response of an earlier request of the scenario. |
| `token()` | The access token of the login user. |
| `randomString(length = 8)` | `length` letters and digits, new for each use. |
| `randomNumber(min, max)` | A whole number from `min` to `max`, new for each use. |
| `uuid()` | A UUID, the same in all requests of one vuser. |
| `template` | Joins strings, numbers and values into one text. |

To put a value inside a string, we use the tag `template`.

```ts
import {captureFrom, load, randomString, template, uuid} from '@sourceloop/load-testing';

load.it('create an order for a new customer, then delete both', [
  load.post('/customers', {
    json: {name: template`loadtest-${randomString()}-customer`},
  }),
  load.post('/orders', {
    json: {
      customerId: captureFrom('POST /customers', '$.id'),
      externalId: uuid(),
    },
  }),
  load.delete('/orders/{id}', {
    pathParams: {id: captureFrom('POST /orders', '$.id')},
  }),
  load.delete('/customers/{id}', {
    pathParams: {id: captureFrom('POST /customers', '$.id')},
  }),
]);

load.it('search orders of a customer', [
  load.get('/customers', {query: {limit: 1}}),
  load.get('/orders', {
    query: {
      filter: template`{"where":{"customerId":"${captureFrom('GET /customers', '$[0].id')}"}}`,
    },
  }),
]);
```

- `template` takes strings, numbers and values.
- A plain template literal fails on purpose. `${randomString()}` in a normal
  backtick string calls `toString()` of the value, and this throws a
  `TypeError` that says to use `template`. Without the throw, the text would be
  `[object Object]`.
- For the same reason, a value cannot go into `JSON.stringify`. `toJSON()`
  throws a `TypeError`. We build a JSON text that holds a value, such as a
  `filter`, with `template` (see the second scenario above).
- A plain string that contains `{{` in `path`, `pathParams`, `headers`, `query`
  or `json` stops the run with a `ScenarioError`. This keeps the syntax of one
  engine out of the scenario. The CLI does not check the strings under
  `artillery`. A value that a hook or a response gives at run time has its own
  check. See [Text that the engine refuses](#text-that-the-engine-refuses).
- The same check covers the keys of objects in `json`, `headers`, `query`,
  `pathParams` and the `headers` of a scenario. The message reads
  `POST /orders: json key "{{ x }}" contains "{{": rename the key`. For a
  nested key it reads `json.deep[0] key "a{{" contains "{{": rename the key`.
  A key cannot use `template`, so we rename it. A body with a key named
  `constructor`, or an object from `Object.create(null)`, gets the same checks.
- The check reads one string at a time. Two strings that touch can still form
  `{{` after the engine joins them. So in a `template`, we never put a lone `{`
  next to a value.
- `captureFrom` works in all four places, also inside a `template`. The source
  must be an earlier request of the same scenario, found by its endpoint id. It
  cannot be a request of the same `load.parallel` group. A capture that finds
  nothing stops the vuser.
- `vars('name')` needs a `name` from the `vars` of `before`, or from what
  `beforeEach` returns. The CLI stops before the load when no hook sets it.
- There is no list of custom values. For a value that these calls cannot make,
  we compute it in a hook (`before`, `beforeEach` or `beforeRequest`), and read
  it with `vars(name)`.
- The calls check their arguments when the scenario file loads. For example
  `randomString(0)` and `randomNumber(5, 1)` throw a `TypeError`.
  `randomString(length)` needs a whole number from 1.
- `randomNumber(min, max)` needs whole numbers from 0 up, and `min` must not
  be above `max`. A negative or fractional value throws a `TypeError` with
  `randomNumber: the minimum and the maximum must be whole numbers from 0 up`.
  Artillery reads only letters, digits, `_`, `,` and spaces inside
  `$randomNumber(...)`.
- We do not write `{{ $env.LOAD_TESTS_TOKEN }}` by hand. The CLI gives the
  token to Artillery only for a scenario that uses `token()`. See
  [Send the token](#send-the-token).

### Text that the engine refuses

Artillery fills a template with a text replace, and it expands a text again
after the fill. So a value that holds `{{ ... }}` can read `$env` or loop for
ever. A value that holds `$&`, `` $` `` or `$'` can loop or grow, because the
replace reads them as patterns. A `$$` becomes one `$`, so `pa$$word` in a
longer text would reach the API as `pa$word`. We call these five texts the
refused text: `{{`, `$&`, `` $` ``, `$'` and `$$`. A `$1`, a `$0` and a
`$<name>` pass.

The package checks the values that arrive at run time. The check reads
strings, arrays, and the values and the keys of objects. It reads one value at
a time. It never prints the value.

- A text in the `vars` of `before`, at any depth, fails the scenario before its
  load with a `RunError`. The next scenario still runs. The check reads the
  vars as JSON, as the generated file holds them. So a result of `toJSON`
  counts, and a value `undefined` is skipped. A cycle in `vars` gives a
  `TypeError` from `JSON.stringify`. The `<path>` looks like `vars.order.note`
  or `vars.ids[1]`. `after` and the cleanups still run.
- A `beforeEach` result with the refused text fails the vuser. The message
  starts with `load-testing hook beforeEach: ` and then holds the message of
  `vars` below. The worker finds it, so it appears after the load starts. The
  worker reads the result as JSON too, so a `toJSON` result counts. A value
  that JSON cannot write is a hook error.
- A captured value (`captureFrom`) with the refused text fails the vuser
  before it sends another request. The check runs first in the
  `afterResponse` list of the request, before a hook of ours.
- An access token with the refused text fails the scenario with a `RunError`,
  before the CLI writes any file. The next scenario still runs. The message
  has no token in it.
- A base URL with the refused text fails the scenario with a `RunError`, before
  the CLI writes any file. Artillery reads the target as
  `{{ $env.LOAD_TESTS_BASE_URL }}`, so such a text would change the target. The
  message does not show the URL.

The messages read like this. The first line is for `vars`, the second for a
capture, the third for the token, and the fourth for the base URL.

```text
<path> contains text that the engine reads as a template ("{{", "$&", "$`", "$'" or "$$"). Put the value in vars without it, or leave it out.
load-testing hook capture: "{{", "$&", "$`", "$'" or "$$" in the value of <endpoint id> at <JSON path>. The engine reads it as a template. The vuser stopped before it sent another request.
The access token contains text that the engine reads as a template ("{{", "$&", "$`", "$'" or "$$"). Log in again to get another token.
The base URL contains text that the engine reads as a template ("{{", "$&", "$`", "$'" or "$$"). Use a URL without it.
```

A refused text in `vars` is rare. A name or a note that comes from an API can
hold it, so we keep such a value out of `vars`.

The checks belong to the Artillery engine. A custom engine gets none of them
from the package. It must refuse such text itself, if its own engine reads
templates. See [Engines](#engines).

Where we see a failure of the worker.

- The `load-testing` process exits with 1, because the scenario fails.
- Artillery prints `errors.<message>  <count>` in its own summary, with two
  spaces and no dots for a long message. A short message gets dots between
  the message and the count. Artillery cuts a line at 79 columns, so a long
  message starts with the cause.
- The report of the package shows the line
  `Hooks:    <n> error(s), not app errors (FAIL)`.
- The full message is the key `errors.<message>` under `aggregate.counters` in
  `src/__tests__/load/.out/<slug>.report.json`. The `<slug>` is the label of
  the scenario, `group › name`, in lower case. Each run of other characters
  becomes one `-`.

```sh
jq '.aggregate.counters | with_entries(select(.key | startswith("errors.")))' \
  src/__tests__/load/.out/<slug>.report.json
```

### Parallel requests

`load.parallel(requests, {limit?})` sends requests at the same time in one
vuser. The flow goes on when all of them finish. In a hook, we use
`Promise.all` instead.

```ts
import {captureFrom, load} from '@sourceloop/load-testing';

load.it('open the order dashboard', [
  load.get('/orders'),
  load.parallel(
    [load.get('/customers'), load.get('/products'), load.get('/order-statuses')],
    {limit: 2},
  ),
  load.get('/orders/{id}', {
    pathParams: {id: captureFrom('GET /orders', '$[0].id')},
  }),
]);
```

- A group holds only requests. It cannot hold a `load.step` or another group.
- `limit` is the most requests that run at the same time. It must be a whole
  number of 1 or more.
- Each request of a group keeps its endpoint id, its limits and its row in the
  report.
- A request after the group can capture from a request in the group. A request
  in the group cannot capture from another request of the same group. The run
  stops with a `ScenarioError`, because the response can be missing.
- A group can sit in the `loop` of a `load.step`.

### Group options and the merge order

`load.describe(name, options?, define)` and `load.it(name, requests, options?)`
both take `headers`, `phases` and `thresholds`. `load.it` also takes the
[hooks](#hooks), `tokenCheck` and `artillery`.

```ts
import {load, template, token} from '@sourceloop/load-testing';

load.describe(
  'OrderItemController',
  {
    headers: {authorization: template`Bearer ${token()}`},
    thresholds: {p95: 800},
  },
  () => {
    load.it('list order items', [load.get('/order-items', {p95: 400})], {
      headers: {'X-Trace': 'load'},
      phases: [{duration: 20, arrivalRate: 2}],
      thresholds: {errorRate: 2},
    });
  },
);
```

The layers, strongest first:

1. the request
2. `load.it`
3. `load.describe` (the inner one first, then the outer one)
4. `config.ts`
5. the library default

| Option | How the layers combine |
| --- | --- |
| `headers` | They merge by name. Names ignore case. The winner keeps its spelling. |
| `phases` | The list of the strongest layer replaces the others. There is no merge. |
| `thresholds` | They merge by field. |

In the example, the scenario gets the `authorization` and `X-Trace` headers.
It gets its own `phases`, a `p95` of 800 and an `errorRate` of 2. The request
limit `p95: 400` wins on `GET /order-items`.

## Set the load

The load is `phases`, a list of phases that run one after another. A phase uses
the field names of Artillery. We set it in one of two places.

- `phases` in `config.ts` is the default of the package. Every scenario uses it.
- `phases` in the options of a scenario (or of a `load.describe`) replaces the
  default. The lists do not merge, so we name all the phases that we want. We
  use it for a flow that the app cannot take at the default rate.

In `config.ts`:

```ts
import type {LoadTestConfig} from '@sourceloop/load-testing';

// One flat phase: 10 new vusers a second for 60 seconds.
const config: LoadTestConfig = {
  phases: [{duration: 60, arrivalRate: 10}],
};

export default config;
```

In `orders.controller.load.ts`:

```ts
import {load} from '@sourceloop/load-testing';

// A slow start, a ramp, a pause and a count of vusers.
load.it('browse orders slowly', [load.get('/orders')], {
  phases: [
    {duration: 30, arrivalRate: 1},
    {duration: 60, arrivalRate: 1, rampTo: 5},
    {pause: 10},
    {duration: 30, arrivalCount: 100},
  ],
});
```

| Phase | Meaning |
| --- | --- |
| `{duration, arrivalRate}` | `arrivalRate` new vusers a second |
| `{duration, arrivalRate, rampTo}` | the rate goes from `arrivalRate` to `rampTo` |
| `{duration, arrivalCount}` | `arrivalCount` vusers in all |
| `{pause}` | no new vusers |
| `name` on a phase | a label that Artillery shows in its output |
| `maxVusers` on a phase | the most vusers that run at once |

`duration` and `pause` are seconds, or a text such as `1m`. The CLI checks the
values before the load. These rules hold.

- A phase needs a `duration`, and one of two forms of load: `arrivalCount`, or
  `arrivalRate` with an optional `rampTo`. A pause needs a `pause` time.
- `duration`, `arrivalCount` and `pause` must be whole numbers above 0.
  `arrivalRate` and `rampTo` can be 0.
- A phase with `rampTo` also needs `arrivalRate`.
- A text value for `duration`, `pause`, `arrivalRate`, `rampTo` or
  `arrivalCount` is not read by the CLI. It only checks that the text is not
  empty. Artillery reads the text, and a text that it cannot read fails later.

The messages read like this.

- `phases[i] needs arrivalRate or arrivalCount`
- `phases[i] needs arrivalRate with rampTo`
- `phases[i].duration must be a whole number above 0, or a text such as "1m"`,
  and the same for `pause`
- `phases[i].arrivalCount must be a whole number above 0`
- `phases[i].arrivalRate must be 0 or more`, and the same for `rampTo`

The report shows every phase in its `Workload` line, for example
`10 vusers/s for 60 s`. A ramp reads `ramp 1 to 5 vusers/s over 60 s`. A count
reads `100 vusers over 30 s`. A pause reads `pause 10 s`. The phases join with
`, then `. A phase with `maxVusers` ends with ` (at most N vusers at once)`.
An example is `10 vusers/s for 60 s (at most 50 vusers at once)`. The `name` of
a phase is not part of the text.

The baseline file keeps this text. A run with another workload does not compare
its p95 with the old one. A change of `maxVusers` counts as a changed workload.
See [Baseline](#baseline).

Every vuser of a scenario runs its steps once. A scenario that needs a longer
load than the access token lives stops before the load starts. See
[Log in](#log-in).

## Hooks

A scenario can have hooks. They create the data that it needs, and they remove
it.

| Hook | Runs | Where |
| --- | --- | --- |
| `before(ctx, vars)` | once per run, before the load | the CLI |
| `after(ctx, vars)` | once per run, always | the CLI |
| `beforeEach({vars, vu})` | when a vuser starts | a worker of the engine |
| `afterEach({vars})` | when the flow of a vuser ends without an error | a worker of the engine |
| `beforeRequest(req, {vars})` | before each send of that request | a worker of the engine |
| `afterResponse(req, res, {vars})` | after each response of that request | a worker of the engine |

`before` and `after` run in the CLI. They use full TypeScript. They can import
and call anything. `before` puts values in `vars`. `after` gets the same
`vars`, also when `before` stopped half way. To run calls at the same time in a
hook, we use `Promise.all`.

The hooks of `before` call the app with `ctx.api`. That client sends no token,
so a call to a protected endpoint makes a client with the token first, as the
example does. This needs a login. See [Log in](#log-in).

```ts
import {load, template, token, vars} from '@sourceloop/load-testing';

load.it(
  'read the deliveries of an order',
  [
    load.get('/orders/{id}/deliveries', {
      pathParams: {id: vars('orderId')},
      headers: {authorization: template`Bearer ${token()}`},
    }),
  ],
  {
    async before(ctx, runVars) {
      const api = ctx.api.with({
        headers: {authorization: `Bearer ${ctx.token}`},
      });
      const customer = await api.post<{id: string}>('/customers', {
        name: 'loadtest-customer',
      });
      ctx.defer(() => api.delete(`/customers/${customer.id}`));
      const order = await api.post<{id: string}>('/orders', {
        customerId: customer.id,
      });
      ctx.defer(() => api.delete(`/orders/${order.id}`));
      runVars.orderId = order.id;
    },
  },
);
```

### The ctx of before and after

| Member | Use |
| --- | --- |
| `ctx.token` | The access token of the login user. Undefined without a login. |
| `ctx.claims` | The claims of that token. `{}` without a login, or for a token that is not a JWT. |
| `ctx.api` | The HTTP client of the app. It sends no token by itself. |
| `ctx.sql(db, text, params?)` | One SQL statement on a datasource of `config.ts`. |
| `ctx.defer(cleanup)` | Registers a cleanup for something that the hook made. |

`ctx.api` adds the base URL to each path. It sends no `Authorization` header
and no other default header. For a call that needs the token, we make a client
that has it with `ctx.api.with`.

A path must start with `/`. Otherwise the call throws a `RunError` that reads
`<METHOD> <path>: the path must start with "/"`, and it sends nothing. A path
such as `@host/x` would change the host and send the token there. A path such as
`//host/x` starts with `/`, so it goes to the base host as a path.

```ts
import {load, template, token, vars} from '@sourceloop/load-testing';

load.it(
  'read the first order',
  [
    load.get('/orders/{id}', {
      pathParams: {id: vars('orderId')},
      headers: {authorization: template`Bearer ${token()}`},
    }),
  ],
  {
    async before(ctx, runVars) {
      if (ctx.token === undefined) {
        throw new Error('Set the LOAD_TESTS_ login variables.');
      }
      const api = ctx.api.with({
        headers: {authorization: `Bearer ${ctx.token}`},
      });
      const orders = await api.get<{id: string}[]>('/orders', {
        query: {limit: 5, archived: false},
        timeoutMs: 10_000,
      });
      runVars.orderId = orders[0]?.id;
      const invoice = await api.raw('GET', `/orders/${orders[0]?.id}/invoice`);
      runVars.invoiceSize = (await invoice.arrayBuffer()).byteLength;
    },
  },
);
```

| Call | Gives |
| --- | --- |
| `get(path, options?)`, `delete(path, options?)` | The body, parsed as JSON. |
| `post`, `put`, `patch (path, body?, options?)` | The body, parsed as JSON. |
| `raw(method, path, body?, options?)` | The `Response`, for a file, a stream or a header. |
| `with({headers})` | A new client that adds these headers to each call. |

- The options of a call are `headers`, `query` and `timeoutMs`.
- A header with the value `undefined` removes a default header of the client.
- A `query` value goes through `String()`, never through JSON. The client
  skips a value of `undefined`. It adds `query` to a query that the path
  already has.
- `timeoutMs` is 60 s by default. The requests of the login have the same
  limit.
- The client sends the body of a request in this order. `undefined` sends no
  body and no content type. A `FormData`, `URLSearchParams`, `Blob`,
  `ArrayBuffer`, typed array or string goes as it is, and the client sets no
  content type. Anything else goes as JSON with
  `content-type: application/json`, unless we set a content type.
- A response with no body gives `undefined`. We ask for `<void>` in the type.
- A 2xx body that is not JSON throws a `RunError`. We use `raw()` for it.
- Any status that is not 2xx throws an `HttpError`, also from `raw()`.
- A network failure throws a `RunError` with the text
  `<METHOD> <path> failed: <cause>`. A call that takes longer than its
  timeout throws a `RunError` with `<METHOD> <path> timed out after <N> s`.
  This holds also when the body stalls while the client reads it.
- `ctx.api` follows redirects. The login does not. See
  [The flow](#the-flow).
- The package exports `ApiClient`. `new ApiClient(baseUrl, options)` makes a
  client for our own code. `options` can hold `token`, `headers`, `timeoutMs`
  and `signal`. `token` adds the bearer header. The type of `signal` is
  `() => AbortSignal | undefined`. The client adds `baseUrl` to the path as
  it is, so `new ApiClient('http://h/')` makes the URL `http://h//orders`. The
  CLI removes a slash at the end of its base URL, and this class does not.

### Cleanups with ctx.defer

`ctx.defer(cleanup)` registers a cleanup for the data that a hook made. We call
it right after the create, as the example above does.

- At the end of the run, the CLI calls the cleanups, the last one first. So a
  row goes before the rows that it depends on.
- This happens after `after`. It also happens when `before` stopped half way,
  when the load failed, and when a signal came.
- A cleanup can use `ctx.api`. It works after a signal too.
- A cleanup that throws does not stop the others, and the run fails. When the
  scenario ran to the end, the report shows each failure as a
  `FAIL: cleanup failed:` line. When `before` or the load failed, the CLI
  prints `<scenario>: cleanup failed: <message>` on stderr instead.
- A cleanup must accept that its row is gone already.
- Vusers run in workers, so they cannot register a cleanup. We give the rows of
  the vusers a name tag, and remove them in `after`.

Why not only `after`? `after` runs once, and it does not know how far `before`
got. Say that `before` creates a customer and an order, and the order create
fails. Then `after` must check each id to see what exists. A new create needs
one more check in `after`, and a missed check leaves rows behind. With
`ctx.defer`, the function that creates the data also registers its cleanup,
right after the create works. So the list holds only what exists. A cleanup can
even go before the create. That is safe when the cleanup runs with nothing to
remove, because it finds the rows by the name of the run. It also covers a
create that committed, but whose reply we lost.

We still use `after` for rows that no hook created, such as the rows that the
vusers made. It runs before the deferred cleanups, so these rows go before the
rows that they point to. One rule needs care. We register first the cleanup
that must run last.

### Worker hooks

The workers do not load our scenario file. The engine copies the source of
`beforeEach`, `afterEach`, `beforeRequest` and `afterResponse` into a file for
the workers (`.out/<slug>.processor.js`). So these rules hold.

- A worker hook can use only its arguments and JavaScript globals, such as
  `URL`, `Buffer`, `crypto`, `process` and `setTimeout`. It cannot use an
  `import` or a variable of its module.
- A worker hook must be synchronous. A worker does not wait for a promise. An
  `async` hook would run its work after the vuser went on, and nobody would see
  a rejection. The CLI fails the scenario before its load when one of the four
  hooks returns a promise. The next scenario still runs.
- `beforeEach` must give the same result for the same arguments, and it must
  have no side effects. It must return an object, the vars of the vuser.
- Before the load, the CLI runs each hook once, with made-up arguments, from the
  generated file. A hook that uses a name from outside fails at once, with a
  `ReferenceError` in the message. For `beforeRequest`, `afterResponse` and
  `afterEach`, only a `ReferenceError` fails the scenario, because the made-up
  arguments can cause other errors. A side effect of a hook runs once there.
  This test runs in the CLI process, so it sees all environment variables. A
  worker sees only the list that the next rule names.
- The file writes `vars` (what `before` sets) in plain text. We never put a
  secret or the token in `vars`. `token()` is safe. The CLI passes the token to
  Artillery in the environment and does not write it to disk. It does so only
  for a scenario that uses `token()`.
- A worker hook runs inside Artillery. So `process.env` there holds only the
  allowed names, plus `LOAD_TESTS_BASE_URL`, and `LOAD_TESTS_TOKEN` when the
  scenario sends `token()`. See
  [The environment of Artillery](#the-environment-of-artillery).
- A `beforeEach` result with the refused text fails the vuser. See
  [Text that the engine refuses](#text-that-the-engine-refuses).
- `afterEach` does not run for a vuser whose flow stopped with an error.
- An error in a worker hook stops that vuser. The report counts these errors
  apart from app errors, in the `Hooks:` line, and the scenario fails.

```ts
import {load} from '@sourceloop/load-testing';

load.it(
  'tagged requests',
  [
    load.get('/orders', {
      beforeRequest: (req, {vars}) => {
        req.headers['x-run-id'] = String(vars.runId);
      },
      afterResponse: (_req, res) => {
        if (res.statusCode >= 500) console.error('server error');
      },
    }),
  ],
  {
    before: async (_ctx, vars) => {
      vars.runId = Date.now();
    },
    beforeEach: ({vu}) => ({tag: `vu-${vu}`}),
  },
);
```

`vu` counts the vusers that this worker started, from 0. Every worker counts
from 0, so it is not unique in the run.

### Ctrl-C and signals

On SIGINT (Ctrl-C), SIGTERM or SIGHUP the CLI does these steps.

1. Stop the `ctx.api` calls of `before`.
2. Stop Artillery, and wait until it has exited. It gets SIGKILL after 10
   seconds. The wait makes sure that no late request of the load creates a row
   after the cleanup removes it.
3. Run `after` and the cleanups.
4. Run the reporters, with `stopped: true`. The console reporter prints no
   coverage or heavy API lines then.
5. Exit with 128 plus the signal number: 130 for SIGINT (Ctrl-C), 143 for
   SIGTERM and 129 for SIGHUP.

A second signal ends the process at once, with the exit code of the first. A
second signal that comes less than 500 ms after the first is ignored, because
npm can forward one Ctrl-C twice. A stopped run saves no baseline.

Ctrl-C also works during the login (step 6 of
[How a run works](#how-a-run-works)) and the token refresh (step 8.1). The CLI
prints `Cancelled.` and exits with the code of step 5 above (130, 143 or 129)
at once. It does not wait for a request that is still open.

The CLI ignores write errors on the terminal, but only `EPIPE`, `EIO` and
`ERR_STREAM_DESTROYED`. After SIGHUP the terminal can be gone, and a failed
write cannot stop the cleanups. Any other write error, such as a full disk,
is thrown.

When the CLI process exits for any reason, it kills every running Artillery
process with SIGKILL. Examples are a second signal, `process.exit` and an
uncaught error. A SIGKILL of the CLI itself cannot be caught, so the Artillery
processes can survive that case.

## Test data

The scenarios make and delete data in the app under test. A good scenario
leaves nothing behind, and it never depends on rows that someone made by hand.

### Create and remove data

There are two ways to create data.

- Through the API, with `ctx.api` in `before`. This goes through the same code
  as a real client, so it makes audit rows, events and cache entries.
- With SQL, with `ctx.sql` in `before`. This goes around the app. It makes no
  audit rows or events, and it does not clear a cache that the app keeps. We use
  it for data that no endpoint can create, or to find rows by name in `after`.

We always register a cleanup with `ctx.defer` right after a create. See
[Hooks](#hooks). A vuser can also create and delete its own data as steps of
the flow. The first request creates a row, `captureFrom` takes its id, and the
last request deletes it. Then no two vusers share a row.

This scenario needs data of its own for each run. The `before` hook makes the
customer and the products, and `ctx.defer` removes them.

```ts
import {
  captureFrom,
  load,
  randomNumber,
  randomString,
  template,
  token,
  vars,
} from '@sourceloop/load-testing';

load.it(
  'create an order with 3 items, set its discount, then read its deliveries',
  [
    load.post('/orders', {
      json: {
        customerId: vars('customerId'),
        reference: template`loadtest-${randomString()}-order`,
      },
    }),
    load.post('/order-items/bulk', {
      json: [1, 2, 3].map(() => ({
        orderId: captureFrom('POST /orders', '$.id'),
        productId: vars('productId'),
        quantity: randomNumber(1, 5),
      })),
    }),
    load.patch('/orders/{id}', {
      pathParams: {id: captureFrom('POST /orders', '$.id')},
      json: {discount: 10},
    }),
    load.get('/orders/{id}/deliveries', {
      pathParams: {id: captureFrom('POST /orders', '$.id')},
    }),
    load.delete('/orders/{id}', {
      pathParams: {id: captureFrom('POST /orders', '$.id')},
    }),
  ],
  {
    headers: {authorization: template`Bearer ${token()}`},
    async before(ctx, runVars) {
      const api = ctx.api.with({
        headers: {authorization: `Bearer ${ctx.token}`},
      });
      const customer = await api.post<{id: string}>('/customers', {
        name: 'loadtest-customer',
      });
      ctx.defer(() => api.delete(`/customers/${customer.id}`));
      const product = await api.post<{id: string}>('/products', {
        name: 'loadtest-product',
      });
      ctx.defer(() => api.delete(`/products/${product.id}`));
      runVars.customerId = customer.id;
      runVars.productId = product.id;
    },
  },
);
```

### Give each vuser a unique value

We put a random part in a string with `template`. The engine makes a new value
for each vuser, in every worker. We share nothing.

```ts
import {
  load,
  randomNumber,
  randomString,
  template,
  uuid,
} from '@sourceloop/load-testing';

load.post('/products', {
  json: {
    name: template`loadtest-${randomString()}-product`,
    stock: randomNumber(1, 9),
    externalId: uuid(),
  },
});
```

- With 1,000 vusers and the default length, the chance that two vusers get the
  same `randomString` is 2 in a billion. A part of a UUID is worse. Eight hex
  characters give 1 chance in 8,600. `uuid()` is unique, but it has 36
  characters. A column with a size limit can need a shorter value. We use
  `randomString` there.
- `randomNumber` can give the same number to two vusers. We do not use it where
  each vuser needs a unique value.
- `uuid()` is the same in all requests of one vuser, so it also links them.
- Artillery has no unique index of a vuser. It does not split a CSV `payload`
  between the workers. In local mode, each worker gets the whole payload and
  starts at the first row. So we do not use a CSV to give each vuser its own
  row.
- `vu` in `beforeEach` is not unique in the run either.
- The Artillery engine renders these values as `{{ $randomString(8) }}`,
  `{{ $randomNumber(1, 9) }}` and `{{ $uuid }}`. If Artillery changes them, we
  change the engine only.

## Datasources

A datasource is a named database connection. We declare datasources in
`config.ts`. The first argument of `ctx.sql` is one of the names. A facade can
reach several services, and each service has its own database. So we
declare one datasource for each database that a scenario touches, for example
`orders`, `inventory`, `audit`, `suppliers`, `billing` and `users`.

A datasource has one of three forms.

- `{type: 'postgres', url, ...}` is Postgres. The package has the adapter, and
  the project installs the driver.
- `{type: 'custom', connector}` is any other database, with a connector that we
  write.
- A bare `connector` is the same as `custom`, shorter.

In `config.ts`:

```ts
import type {LoadTestConfig, SqlConnector} from '@sourceloop/load-testing';

// The server URL, with no database path.
const server = process.env.ORDERS_DB_URL;

declare function openDatabase(url: string): Promise<{
  run(text: string, params?: unknown[]): Promise<unknown[]>;
  close(): Promise<void>;
  onClose(listener: (err: Error) => void): void;
}>;

// A connector for any other database.
function warehouse(url: string): SqlConnector {
  return {
    async connect(onError) {
      const db = await openDatabase(url);
      db.onClose(onError);
      return {
        query: async (text, params) => ({rows: await db.run(text, params)}),
        end: () => db.close(),
      };
    },
  };
}

const config: LoadTestConfig = {
  phases: [{duration: 60, arrivalRate: 10}],
  datasources: {
    orders: {type: 'postgres', url: server, database: 'orders'},
    audit: {type: 'postgres', url: server, database: 'audit'},
    billing: {type: 'custom', connector: warehouse('wh://billing')},
    inventory: warehouse('wh://inventory'), // a bare connector
  },
};

export default config;
```

In `orders.controller.load.ts`:

```ts
import {load} from '@sourceloop/load-testing';

load.it('read orders', [load.get('/orders')], {
  async before(ctx, runVars) {
    const rows = await ctx.sql<{id: string}>(
      'orders',
      'SELECT id FROM orders WHERE reference LIKE $1',
      ['loadtest-%'],
    );
    runVars.orderId = rows[0]?.id;
  },
});
```

- The package reads no database variable. Our `config.ts` reads the
  environment, and we choose the name of the variable.
- `type: 'postgres'` needs the `pg` package in our project, with
  `npm install --save-dev pg`. The package loads `pg` from our project folder,
  never from its own, at the first `ctx.sql` call of the datasource. When `pg`
  is missing, the call fails with a `ConfigError`.
- The calls to one datasource share one connection and run one after another,
  also inside `Promise.all`. Calls to different datasources run at the same
  time.
- A Postgres datasource takes `url`, or `host`, `port`, `user` and `password`.
  It also takes `database`, `ssl`, `connectionTimeoutMs`, `statementTimeoutMs`
  and `applicationName`.
- We read the URL from an environment variable, never from a literal in
  `config.ts`. We keep the certificate checks of `ssl` on. We turn them off
  only for a local database.
- With `url`, `database` replaces the path of the URL. So one server URL serves
  many datasources. With `url`, the options `host`, `port`, `user` and
  `password` are ignored, with no message.
- `connectionTimeoutMs` is 10,000 ms by default, so a database that does not
  answer cannot hold the run for ever.
- `statementTimeoutMs` is a whole number of milliseconds from 0. Another
  value in a datasource is a `ConfigError` with the message
  `datasources.<name>.statementTimeoutMs must be a whole number of
  milliseconds from 0 (0 turns the limit off)`. `connectionTimeoutMs` follows
  the same rule.
  - By default the client waits at most 60 s for a statement
    (`query_timeout`). The server gets no `statement_timeout`, so it keeps
    running a statement after the client gave up. The CLI then drops that
    connection. The next `ctx.sql` call opens a new one.
  - A value above 0 sets both limits. It sends `statement_timeout` to the
    server as a startup parameter. A proxy such as PgBouncer can refuse that
    parameter.
  - Behind such a proxy we leave the option unset (client limit only), or we
    set `0` (no limit at all).
- With neither `url` nor `host`, the first call fails with a `ConfigError` that
  says what to set. A run whose scenarios use no SQL needs no URL.
- A name that `config.ts` does not declare gives a `ConfigError` that lists the
  declared names.
- The package opens one connection for each datasource, at the first call, and
  keeps it. It drops a connection that breaks, and the next call opens a new
  one. The connections close after the cleanups of each scenario.
- `params` fill `$1`, `$2` and so on in the text. A call with several
  statements and no `params` gives the rows of the last one.
- A connector has one method, `connect(onError)`. It opens one connection and
  returns `{query, end}`. It calls `onError` when an idle connection breaks, so
  that the package can open a new one. It opens nothing when we create the
  connector.

## Log in

The login is optional. The CLI logs in only when `LOAD_TESTS_USERNAME` is set.
Then it also needs the password, the client id and the client secret.
`LOAD_TESTS_BASE_URL` is always required. The
[Environment](#environment) table lists all six variables.

### The flow

The login follows the two-step login of the ARC authentication service
(`@sourceloop/authentication-service`).

1. `POST /auth/login` with `username`, `password`, `client_id` and
   `client_secret`. The answer holds a `code`.
2. `POST /auth/token` with the `code` and the `clientId`. The answer holds an
   `accessToken` and a `refreshToken`. Both must be non-empty texts. If not,
   the CLI throws a `LoginError`: `<call> gave no accessToken` or
   `<call> gave no refreshToken`.
3. Before each scenario, the CLI gets a new token with
   `POST /auth/token-refresh`. It sends the `refreshToken`, and the old access
   token as a bearer token. It skips the refresh when the access token is less
   than a minute old. The auth service revokes the access token that a refresh
   replaces. The signed payload has no random part (`jti`), so two refreshes
   in the same second give the same token string. The second refresh then
   revokes the token that it just gave. We refresh at most once a minute to
   avoid this.

All three calls go to `LOAD_TESTS_AUTH_URL`, or to the base URL when that
variable is not set. A call that answers with a status other than 2xx throws a
`LoginError` with the status and the first 200 characters of the body.

The login and the refresh do not follow redirects. A 307 or a 308 would send
the password and the client secret again to the new host. A status from 300 to
399 stops with a `LoginError`. It names the status and the origin of the
`location` header, when the header parses. It never shows the whole location.
The message reads
`POST <url> gave <status>, a redirect to <origin>. The login does not follow
redirects, so the password goes only to the URL that we set. Set
LOAD_TESTS_AUTH_URL to the final URL.`
We set `LOAD_TESTS_AUTH_URL` to the final URL.

We use https for an auth URL that is not on this machine. The package does not
enforce it, because it accepts http for any host.

A network failure names the URL and the cause. These are the messages.

- `POST <url> failed: <cause>`, for example with the cause
  `connect ECONNREFUSED 127.0.0.1:4010`. The cause is never empty. When
  `fetch` gives several errors, the text joins their messages with `; `.
- `POST <url> timed out after 60 s`. This holds also when the body stalls.
- `POST <url> gave <status> with a body that is not JSON`, for a 2xx answer
  whose body is not JSON.
- `POST <url> gave <status> with a body that is not a JSON object`, for a 2xx
  answer whose body is JSON but not an object (`null`, a list, a number or a
  text).

Ctrl-C stops a login or a refresh at once. See
[Ctrl-C and signals](#ctrl-c-and-signals).

### Send the token

The package does not add an `Authorization` header. A request asks for the
token with `token()`. We set the header once, on the `load.describe` or on the
`load.it`.

```ts
import {load, template, token} from '@sourceloop/load-testing';

load.describe(
  'Orders',
  {headers: {authorization: template`Bearer ${token()}`}},
  () => {
    load.it('browse orders', [load.get('/orders')]);
  },
);
```

`token()` works in `headers`, `query`, `pathParams` and `json`.

- Without a login, `ctx.token` is undefined and `ctx.claims` is `{}`. When a
  scenario that runs sends `token()`, the whole run stops with a `ConfigError`
  before any scenario or hook runs. The message names these scenarios.
- With a login, the engine sends one token for the whole load of a scenario.
  `after` and the cleanups use the same token as `ctx.token`.
- The CLI gives the token to Artillery only for a scenario that uses `token()`.
  Another scenario gets no token variable. `ctx.token` and `ctx.claims` in
  `before` and `after` do not change.
- `ctx.api` does not send the token. See [Hooks](#hooks).

### The token check

The token check runs for a scenario that sends `token()`, when there is a
login. It runs after `before` and before the load.

The default check stops the scenario when the load time plus 120 seconds is at
least the time that the token has left. The 120 seconds are for the last
requests of Artillery, `after` and the cleanups. The check reads the `exp`
claim of the token. A token without `exp` passes.

The check also stops the scenario with a `RunError` when it cannot read the
time of a phase. We write a time as a number of seconds, or as a text such as
`20m`.

The token life comes from the login client of the auth service. A short life
limits the length of a load.

`tokenCheck` replaces the default check. So a custom check must test the
expiry itself, as the example does. We set it in `config.ts` for the package,
or in the options of a `load.it`. The innermost wins. It gets
`{token, claims, phases}`. It throws an error to stop the scenario before its
load. The report shows the message as a `FAIL:` line. `after` and the cleanups
still run, and the next scenario starts.

```ts
import {RunError, load} from '@sourceloop/load-testing';

// The load lasts 3000 s. The check wants 120 s more, as the default check does.
const NEEDED_MS = (3000 + 120) * 1000;

load.it('a long load on orders', [load.get('/orders')], {
  phases: [{duration: 3000, arrivalRate: 1}],
  tokenCheck: ({claims}) => {
    if (claims.role !== 'service') {
      throw new RunError('a long load needs a service token');
    }
    if (typeof claims.exp !== 'number') {
      throw new RunError('the token has no exp claim');
    }
    if (claims.exp * 1000 - Date.now() < NEEDED_MS) {
      throw new RunError('the token ends before the load ends');
    }
  },
});
```

### Login errors and the rate limit

- A 401 from `/auth/login` means that the username, the password, the client id
  or the client secret is wrong. The message reads
  `POST <url>/auth/login gave 401: ...`.
- A 429 means that something in front of the auth route limits the rate of
  calls. The package does not retry. The first login happens once, at the start
  of the run. A 429 there stops the run with a `LoginError`. A 429 on a
  refresh fails that scenario, and the next scenario tries its own refresh.
  When it happens, we wait, or we raise the limit for the test environment.

### The test user

The login needs a user that exists in each environment. This checklist tells
what that user must be. We do not give SQL, because each project creates users
in its own way.

- [ ] The user is only for load tests. It is never a real person, and
      nobody else uses it. A name such as `load-test@example.com` shows its
      purpose.
- [ ] The user has the smallest role that can call every endpoint under test.
      A load test needs no more power than that.
- [ ] A client exists for the login, with a client id (for example
      `load-test-client`) and a client secret. That client lets the user log
      in.
- [ ] The password and the client secret live only in environment variables or
      in CI secrets. They are never in git, in `config.ts` or in a script.
- [ ] Create the user with the user API or the seed script of the project.
      Then the project hashes the password in the way that it expects.
- [ ] Each environment has its own user, with its own password. We do not share
      one user over development, test and production-like systems.

## Thresholds and the verdict

Thresholds are optional. We set them in `thresholds.default` of `config.ts`, in
the options of a `load.describe` or a `load.it`, or in the options of one
request. An example is `load.get('/orders', {p95: 800})`.

The order is the request, then `load.it`, then `load.describe`, then
`thresholds.default` of `config.ts`, then the library default. Layers merge by
field. A field that no layer sets takes the library default from the table.
The package still checks each value that we give.

| Name | Unit | Default | An endpoint fails when |
| --- | --- | --- | --- |
| `errorRate` | percent | 1 | more than this percent of its requests get a network error or a 4xx or 5xx status |
| `p95` | milliseconds | 500 | its p95 is above this value. It needs no baseline, so the limit holds on the first run too |
| `p95Regression` | percent | 20 | its p95 is more than this percent above the baseline, and also more than `minDelta` above it |
| `minDelta` | milliseconds | 10 | its p95 is more than this many milliseconds above the baseline, and also above `p95Regression` |

The names have no unit. The table gives it. `errorRate` must be from 0 to 100.
The other values must be 0 or more.

### Targets for the p95 limit

`P95_TARGETS` holds common p95 targets for HTTP APIs, in milliseconds. We use
one as the `p95` of an endpoint, so that a reader sees which kind of API the
limit is for.

| Key | Value | Kind of API |
| --- | --- | --- |
| `userBlockingApi` | 500 | User-blocking APIs, which a user waits for. The target is 300 to 500 ms where practical. This is the default limit. |
| `supportingApi` | 1000 | Supporting APIs, such as reports and exports. The target is 700 ms to 1 s where practical. It is the highest target for an API. |
| `heavyOperation` | 5000 | Not a target for an API. Work of more than 5 s must be async, or must have an explicit approval. An endpoint with this `p95` is performance debt, and a heavy API. |

A limit above the target of its kind is a deviation. We write the reason next
to it, and we let the review approve it. The package cannot judge "where
practical", so it fails an endpoint that is over its limit. A limit with a
reason is the way out.

```ts
import {load, P95_TARGETS} from '@sourceloop/load-testing';

// This endpoint builds a summary from many rows. It is a supporting API, not
// a user-blocking one, so it gets the higher target.
load.get('/orders/summary', {p95: P95_TARGETS.supportingApi});
```

The package has no number for how much slower than before is too slow, and none
for an error rate. So `p95Regression` (20), `minDelta` (10) and `errorRate` (1)
are values that the package chose.

> [!CAUTION]
> Every endpoint counts as user-blocking until it sets another target. The
> target for user-blocking APIs is 300 to 500 ms, where practical. The default
> limit of 500 ms is the top of that range.
>
> We keep 500 ms, and not 300 ms, because of the architecture. In a facade and
> service architecture, a request passes through three network layers. It goes
> from the client (the UI, or the load generator) to the facade. Then it goes
> from the facade to a service, and from the service to its database. Some
> endpoints add more calls, because a facade can call several services before
> it answers. Without a cache, it is hard for an API that reads through all
> these layers to meet the user-blocking target.
>
> A pass on a CI runner does not prove that an API meets the target in
> production. A CI runner and a small test cluster give other numbers than a
> production system. We review the default when the tests run on an environment
> that is close to production.

### Heavy APIs

A heavy API is an endpoint with a `p95` limit above 1000 ms. That is
`P95_TARGETS.supportingApi`, the highest target for an API. A plain number such
as `p95: 2000` also makes an endpoint heavy. A `p95` in `thresholds` of a
`load.it`, a `load.describe` or `config.ts` counts too. So a default above
1000 ms makes every endpoint heavy.

Work of more than 5 s must be async. The endpoint that starts the work
answers within its target, and a background job does the work. This package
measures HTTP responses only, so it does not test the job.

`maxHeavyApis` in `config.ts` is the number of heavy APIs that the package can
have. The default is 0, so no heavy API passes. Here is a package with two.

```ts
import type {LoadTestConfig} from '@sourceloop/load-testing';

const config: LoadTestConfig = {
  phases: [{duration: 60, arrivalRate: 10}],
  /*
   * POST /order-items/bulk and PATCH /orders/{id} are heavy APIs, and
   * performance debt. Lower this number when one of them is fixed.
   */
  maxHeavyApis: 2,
};

export default config;
```

- The package counts the distinct endpoint ids (`METHOD path`) over all
  scenarios of the package. It counts the skipped scenarios and the ones that
  `.only` leaves out. The same id in two scenarios counts once, with its
  highest limit.
- The report lists the heavy APIs. See [Report](#report).
- A package with more heavy APIs than `maxHeavyApis` fails the run. The rows
  keep their own results, and the load still runs. A failed run saves no
  baseline, unless `LOAD_TESTS_FORCE_BASELINE=1`.
- We raise the number only for performance debt that the pull request lists,
  with an owner and a target date. We write the reason in a comment next to the
  limit.
- When a fix lands, we lower the number, and we lower the `p95` limit of the
  fixed endpoint too. An endpoint stays heavy until its limit goes down, also
  when it got faster. The `Note` line of the report tells when the number can
  go down.

The count does not say which endpoints are heavy. We chose a count because a
new heavy API then needs one change, its `p95`, and not a second list of ids.
The price is a gap. If a fix lands and the number stays, a new heavy API can
take its place without a failure.

### Every rule that fails a run

| What fails | Rule |
| --- | --- |
| An endpoint | It got no requests. |
| An endpoint | Its error rate is above `errorRate`. |
| An endpoint | Its p95 is above its `p95` limit. |
| An endpoint | Its p95 is above its baseline by more than `p95Regression` percent and more than `minDelta` ms. |
| A scenario | More than `errorRate` percent of its vusers failed. The limit is the one of `thresholds.default` or the library default. A vuser fails when its flow stops with an error, for example a network error, a capture that finds nothing, or a hook that throws. A 4xx or 5xx status does not stop a vuser, but it counts in the error rate of its endpoint. |
| A scenario | A worker hook threw an error. |
| A scenario | `after` or a cleanup threw. |
| A scenario | It stopped with an error, for example in `before`, in the token check, in a token refresh or in the engine. The report shows a `FAIL:` line with the message. The next scenario still runs. |
| The run | The package has more heavy APIs than `maxHeavyApis`. |
| The run | A reporter threw an error. |

An endpoint without a response has no p95. Then only the error rate and the
"no requests" rule can fail it.

A failed run exits with 1. A problem in `config.ts`, in a scenario file, in the
environment, or in the login stops the run before any load. The exit code is 1
then too.

### The reasons in a FAIL line

The `Result` column of an endpoint shows `FAIL:` and one or more reasons,
joined by `;`. These are the four texts. We can search the output for them.

| Reason text | Meaning |
| --- | --- |
| `no requests` | The endpoint got no requests. |
| `error rate X% > Y%` | The error rate X is above `errorRate` Y. |
| `p95 X ms > limit Y ms` | The p95 X is above the `p95` limit Y. |
| `p95 +N% (+M ms) over baseline B ms` | The p95 is N percent and M ms above the baseline B. A baseline of 0 leaves out the `+N% ` part. |

## Report

At the end of the run, the console reporter prints one block for each scenario.
This sample comes from a run that had a baseline. One endpoint is too slow, and
one has errors.

```text
Results

OrderController › create an order for a new customer, then delete both
Workload: 10 vusers/s for 5 s
Vusers:   50 started, 50 completed, 0 failed (limit 1%)

Endpoint                Requests  Req/s  p95 ms (limit)  Base ms  Err % (limit)  Result
POST /customers         50        10.1   38.5 (52.9)     42.9     0 (1)          pass
POST /orders            50        10.1   120.4 (73.6)    61.3     0 (1)          FAIL: p95 +96.4% (+59.1 ms) over baseline 61.3 ms
DELETE /orders/{id}     50        10.1   44 (500)        -        4 (1)          FAIL: error rate 4% > 1%
DELETE /customers/{id}  50        10.1   31.9 (500)      -        0 (1)          pass (no baseline)

Skipped: OrderController › browse products

Coverage: 4 of 41 endpoints in src/openapi.json

Heavy APIs: 2 of at most 2 (maxHeavyApis in config.ts). A heavy API has a p95 limit above 1000 ms.
  POST /order-items/bulk  5000 ms
  PATCH /orders/{id}      5000 ms

A vuser is one virtual user. It runs the steps of a scenario one time. Failed means that its run stopped on an error.
```

The columns and lines:

- `Workload` is the load that the scenario ran. See
  [Set the load](#set-the-load).
- `Vusers` counts the virtual users. The limit in brackets is the highest
  percent of failed vusers that passes. When too many failed, the brackets
  read `(FAIL: vuser failure rate 8% > 1%)`.
- `Requests` is the count of responses plus network errors for the endpoint.
- `Req/s` is the requests divided by the seconds from the first to the last
  count of the run.
- `p95 ms (limit)` is the p95. The brackets hold the highest p95 that passes.
  That is the lower of `p95` and the baseline limit. The baseline limit is the
  baseline plus the larger of `minDelta` milliseconds and `p95Regression`
  percent of the baseline. With no baseline, the limit is `p95`.
- `Base ms` is the baseline p95 of the endpoint, or `-` when there is none.
- `Err % (limit)` is the error rate, with `errorRate` in brackets.
- `Result` is `pass`, or `FAIL:` with the reasons, joined by `;`. A passing
  endpoint can carry a note in brackets, `pass (no baseline)` or
  `pass (workload changed)`.
- `Hooks:` shows how many errors worker hooks threw. These are not app errors.
  The scenario fails.
- A line `FAIL: after failed: ...` or `FAIL: cleanup failed: ...` shows that
  `after` or a cleanup threw. The numbers in the table are still good, but the
  scenario fails, and so does the run.
- A scenario that stopped with an error has no table. It shows one line,
  `FAIL: <message>`. A failed `after` or cleanup of such a scenario goes to
  stderr as `<scenario>: after failed: <message>` or
  `<scenario>: cleanup failed: <message>`, and not into the report.
- A line `Baseline: recorded with <workload>, so p95 is not compared` shows that
  the workload changed since the baseline.
- `Skipped: <name>` lists a scenario that `.skip` hides.
- `Coverage` counts the endpoints of `src/openapi.json` that the scenarios call.
  It does not count `/ping`, `/openapi.json` and the `/explorer` paths.
- When no baseline file exists, the reporter prints the line `No
  src/__tests__/load/.out/baseline.json. Run once with
  LOAD_TESTS_UPDATE_BASELINE=1 to record it.` after the coverage.
- The legend at the end says what a vuser is, because "users" can mean the rows
  of a users table.

### The block of heavy APIs

The block comes after the `Coverage` line. It shows when the package has a
heavy API, or a `maxHeavyApis` above 0. It covers every scenario of the
package, so it can name endpoints of scenarios that the report does not show.
The reporter pads the ids to the longest id, and each line has its limit. See
[Heavy APIs](#heavy-apis).

- When the package has more heavy APIs than the maximum, the block ends with a
  `FAIL` line, and the run exits with 1.
- When the maximum is higher than the count, the block ends with a `Note` line.
  With no heavy endpoint and a maximum above 0, only the `Note` line shows.

The `FAIL` and `Note` lines read like this:

```text
FAIL: 3 heavy APIs, but maxHeavyApis is 2. Lower the p95 limit of an endpoint to 1000 ms or less, or raise maxHeavyApis in config.ts.
Note: maxHeavyApis is 2, but 1 endpoint is heavy. Lower maxHeavyApis in config.ts.
Note: maxHeavyApis is 2, but no endpoint is heavy. Lower maxHeavyApis in config.ts.
```

### Custom reporters

A reporter gets the result of the run once, at the end. `reporters` in
`config.ts` is a list, and the default is `[consoleReporter()]`. An empty list
prints no result. We write a reporter for our own tools, for example a file, a
dashboard or a chat message.

```ts
import {writeFile} from 'node:fs/promises';
import type {LoadTestConfig, Reporter} from '@sourceloop/load-testing';
import {consoleReporter} from '@sourceloop/load-testing';

const jsonFile: Reporter = {
  name: 'json-file',
  async onRunEnd(result) {
    await writeFile('load-result.json', JSON.stringify(result, null, 2));
  },
};

const config: LoadTestConfig = {
  phases: [{duration: 60, arrivalRate: 10}],
  reporters: [consoleReporter(), jsonFile],
};

export default config;
```

- A `Reporter` is `{name, onRunEnd(result)}`. The function can be async.
- `result` is a `RunResult`. It is plain data, with no engine names.
- The reporters run one after another. A reporter that throws prints
  `reporter <name> failed: <message>`. The run exits with 1, and the baseline
  does not move. The other reporters still run. A reporter cannot make a
  failing run pass.
- The reporters run also after a signal, with `stopped: true`.

The fields of a `RunResult`:

| Field | Meaning |
| --- | --- |
| `scenarios` | A `ScenarioResult` for each scenario that ended: `name`, `workload`, `vusers`, `hookErrors`, `problems`, `error`, `baselineNote`, `endpoints` and `passed`. |
| `skipped` | The names of the skipped scenarios. |
| `coverage` | `{covered, total, specFile}`. |
| `heavyApis` | `{max, endpoints: {id, p95}[]}`. |
| `hasBaseline` | False when there is no baseline file. |
| `passed` | True when every scenario passed and the heavy APIs are within `max`. |
| `stopped` | True when a signal ended the run. |

Each entry of `endpoints` is an `EndpointResult`. It holds `id`, `requests`,
`perSecond`, `p95`, `p95Limit`, `baselineP95`, `errorRate`, `errorRateLimit`,
`failures` and `note`. `vusers` has the type `ScenarioResult['vusers']`. It
holds `started`, `completed`, `failed`, `failedLimit` and `failures`.

## Baseline

The file `src/__tests__/load/.out/baseline.json` keeps the p95 of the last 10
runs of each endpoint, by scenario. The baseline of an endpoint is the mean of
these values. The sister package `@sourceloop/benchmarking` also averages its
last ten runs.

- `LOAD_TESTS_UPDATE_BASELINE=1` adds the run to the history. The run prints
  `Saved src/__tests__/load/.out/baseline.json`.
- A run that failed stays out, so that a regression does not become the normal
  value. This holds also when only `after` or a cleanup failed and every
  endpoint passed, because rows that stay behind can skew the next run. The
  run prints `Baseline not changed: the run failed. Set
  LOAD_TESTS_FORCE_BASELINE=1 to add it anyway.` on stderr.
  `LOAD_TESTS_FORCE_BASELINE=1` adds the run anyway.
- A reporter that throws also keeps the run out of the baseline. The CLI prints
  the same `Baseline not changed` line. `LOAD_TESTS_FORCE_BASELINE=1` with
  `LOAD_TESTS_UPDATE_BASELINE=1` still saves the run.
- A run that a signal stopped saves nothing.
- Without a baseline, the run checks only `errorRate` and `p95`.
  `p95Regression` and `minDelta` do nothing.
- The file also keeps the workload of each scenario. When a scenario now has
  another workload, the run does not compare its p95. The result is
  `pass (workload changed)`. With `LOAD_TESTS_UPDATE_BASELINE=1`, the scenario
  then starts a new history.
- The file keeps the base URL of the run that wrote it. When the next run uses
  another URL, the CLI prints this line. The p95 of another host does not
  describe this one.

  ```text
  The baseline is from <url>, not <url>.
  ```
- The CLI writes the file to `baseline.json.<pid>.tmp` in the same folder and
  renames it, so a killed run leaves no half file. It removes the temp file
  when the write or the rename fails. A file that is not valid, for example a
  history that is not a list of numbers, stops the run with a
  `RunError`. We delete the file and record a new one.
- The history key is the label `group › name`. A rename of a `load.it` or of
  a `load.describe` starts an empty history, and the scenario passes as
  `pass (no baseline)`. The CLI never deletes the old key, so we delete it from
  the file by hand.
- A baseline is only good for the machine that made it. A laptop and a CI runner
  give other numbers.

### Where the file lives, and how CI keeps it

The file is in `src/__tests__/load/.out/`. The `.gitignore` line from
[Ignore the generated files](#ignore-the-generated-files) makes git ignore it.
A fresh CI checkout has no baseline, so a CI job must bring it back. The job
does this.

1. Restore `baseline.json` before the run, for example from the artifact of the
   last passing run on the main branch.
2. Run `npm run test:load`. On the main branch, set
   `LOAD_TESTS_UPDATE_BASELINE=1` for this run.
3. After a passing run on the main branch, save the file, for example as an
   artifact.

Pull request runs only restore the file. They do not save it. So the baseline
holds the runs of the main branch, and the run judges a pull request against
them.

## Command line and environment

```text
load-testing run <package-dir>
```

The command takes one folder, the package that holds `src/__tests__/load`. The
scripts of the quickstart use `.`. `load-testing --help` prints the usage and
exits with 0. The usage lists the `LOAD_TESTS_` variables below. A wrong
option prints its message and the usage, with exit code 1. So does a command
other than `run`, or a missing folder.

### Exit codes

| Code | Meaning |
| --- | --- |
| 0 | The run passed. |
| 1 | The run failed, a reporter failed, or the CLI stopped on an error before or during the run. |
| 129 | SIGHUP. |
| 130 | Ctrl-C (SIGINT). |
| 143 | SIGTERM. |

The CLI prints only the message of an error that it throws on purpose. For any
other error it prints the stack, because that is a bug. See [Errors](#errors).

### Environment

| Variable | Use |
| --- | --- |
| `LOAD_TESTS_BASE_URL` | The app under test. Always required. |
| `LOAD_TESTS_AUTH_URL` | The app that serves `/auth/login` and `/auth/token`. Default is the base URL. |
| `LOAD_TESTS_USERNAME` | Set it to log in. Then the three variables below are required too. |
| `LOAD_TESTS_PASSWORD` | The password of the test user. |
| `LOAD_TESTS_CLIENT_ID` | The client id for the login. |
| `LOAD_TESTS_CLIENT_SECRET` | The client secret for the login. |
| `LOAD_TESTS_UPDATE_BASELINE` | `1` adds the run to the baseline history. |
| `LOAD_TESTS_FORCE_BASELINE` | `1` adds a failed run to the history too. It works only with `LOAD_TESTS_UPDATE_BASELINE=1`. |
| `CI` | Any value other than empty, `0` or `false` makes a `.only` and a run with every scenario skipped fail. The letter case does not matter. |

- An empty variable counts as not set, because a CI job can leave one empty.
- `LOAD_TESTS_BASE_URL` and `LOAD_TESTS_AUTH_URL` must be http or https URLs,
  with no user and no password. A bad value stops the run with a `ConfigError`
  that names the variable. It does not show the value, because a URL can hold a
  password. The CLI removes a slash at the end of the URL.
- The package reads no database variable. Our `config.ts` reads its own.
- Artillery and its plugins get only a short list of the variables of the CLI.
  Our secrets stay out of it. See
  [The environment of Artillery](#the-environment-of-artillery).

```sh
# Build, run, compare, and exit with 1 on a failure.
npm run test:load

# The same, and add the run to the baseline.
LOAD_TESTS_UPDATE_BASELINE=1 npm run test:load
```

### The environment of Artillery

Artillery gets only the names below from the CLI. The match ignores the letter
case. The CLI does not pass a name that it does not have.

| Group | Names |
| --- | --- |
| Paths | `PATH`, `HOME`, `USERPROFILE`, `TMPDIR`, `TMP`, `TEMP` |
| Terminal and locale | `LANG`, `TZ`, `TERM`, `COLORTERM`, `NO_COLOR`, `FORCE_COLOR`, and every name that starts with `LC_` |
| CI | `CI` |
| Proxy and certificates | `HTTP_PROXY`, `HTTPS_PROXY`, `SSL_CERT_FILE`, `SSL_CERT_DIR` |
| Node | `NODE_OPTIONS`, `NODE_EXTRA_CA_CERTS`, `NODE_PATH`, `NODE_ENV`, `NODE_NO_WARNINGS`, `NODE_TLS_REJECT_UNAUTHORIZED` |
| Artillery | `ARTILLERY_WORKERS` |
| Windows | `SYSTEMROOT`, `WINDIR`, `COMSPEC`, `PATHEXT`, `APPDATA`, `LOCALAPPDATA` |

- The CLI does not pass these names, for example `NODE_AUTH_TOKEN`,
  `ARTILLERY_CLOUD_API_KEY`, `GITHUB_TOKEN`, every `AWS_*` name and every
  `LOAD_TESTS_*` name. `NODE_` and `ARTILLERY_` are not prefixes.
- This is not a sandbox. The Artillery process can still read files. The list
  keeps the secrets of a CI job out of `{{ $env.NAME }}` and out of the plugins
  of Artillery.
- To pass more variables, we list their exact names in `artillery.env` of
  `config.ts`, for example `artillery: {env: ['MY_REGION']}`. The CLI passes
  such a name only when it has the variable. A name that starts with
  `LOAD_TESTS_` is a config error.
- `NO_PROXY` and `ALL_PROXY` are not in the list. Artillery reads neither of
  them. A project that needs one lists its name in `artillery.env`.
- A proxy URL with a password (`HTTP_PROXY`, `HTTPS_PROXY`) and `NODE_OPTIONS`
  pass to Artillery as they are. So we use a proxy without a password, and we
  keep secrets out of `NODE_OPTIONS`.
- The package sets `LOAD_TESTS_BASE_URL`. It sets `LOAD_TESTS_TOKEN` only for a
  scenario that uses `token()`. The runner sets `ARTILLERY_DISABLE_TELEMETRY` to
  `true`.
- The worker hooks (`beforeEach`, `afterEach`, `beforeRequest`,
  `afterResponse`, `functions` and `processor`) run inside Artillery. They see
  only these names too.

## Run in CI

A CI job for the load tests does these steps.

1. Start the apps that the tests need, and their databases. The package starts
   nothing.
2. Run the migrations and the seed, so that the databases hold the data that
   the scenarios expect.
3. Create the test user, with its client. See [Log in](#log-in).
4. Set the environment variables. The password and the client secret come from
   the secrets of the CI system.
5. Restore the baseline. See [Baseline](#baseline).
6. Run `npm run test:load`. The job fails when the exit code is not 0.
7. After a passing run on the main branch, save the baseline.

```yaml
- name: Load tests
  env:
    LOAD_TESTS_BASE_URL: http://localhost:3000
    LOAD_TESTS_USERNAME: load-test@example.com
    LOAD_TESTS_PASSWORD: ${{ secrets.LOAD_TEST_PASSWORD }}
    LOAD_TESTS_CLIENT_ID: load-test-client
    LOAD_TESTS_CLIENT_SECRET: ${{ secrets.LOAD_TEST_CLIENT_SECRET }}
  working-directory: facades/orders-facade
  run: npm run test:load
```

- Artillery does not get the secrets of the CI job. See
  [The environment of Artillery](#the-environment-of-artillery). A script that
  needs one more variable lists its name in `artillery.env`.
- GitHub Actions sets `CI=true`. So a `.only` that stays in a file fails the
  job, and so does a package where every scenario has `.skip`.
- A small CI runner gives other numbers than a laptop. We keep the baseline of
  CI runs apart from the baseline of laptop runs, and we do not copy one to the
  other.
- A run in CI takes the time of all phases of all scenarios, plus the time of
  the hooks. We keep the phases short, or we run the load tests in a separate
  job.

## Engines

An engine runs the load of one scenario and returns what it measured. The
default is `artillery()`. The scenarios, the thresholds, the baseline and the
reports do not depend on it. To write an engine, we return an object with a
`name` and a `run` function, and set it as `engine` in `config.ts`.

This engine is a stub. It sends nothing and measures nothing. It returns fixed
numbers for one endpoint, so any other endpoint of a scenario fails with
`no requests`.

```ts
import type {Engine, LoadTestConfig} from '@sourceloop/load-testing';

const mine: Engine = {
  name: 'mine',
  async run({signal}) {
    signal.throwIfAborted();
    return {
      endpoints: new Map([['GET /orders', {count: 10, failed: 0, p95: 20}]]),
      hookErrors: 0,
      vusers: {started: 10, completed: 10, failed: 0},
      seconds: 10,
    };
  },
};

const config: LoadTestConfig = {
  phases: [{duration: 10, arrivalRate: 1}],
  engine: mine,
};

export default config;
```

- `run` gets an `EngineRun`. It has `pkgDir`, `scenario`, `config`, `phases`,
  `runVars` (what `before` set), `endpointIds`, `baseUrl`, `token` (undefined
  without a login) and `signal`.
- `run` returns a `Measurement`. It has `endpoints` (a map of the endpoint id to
  `{count, failed, p95}`), `hookErrors`, `vusers` and `seconds`.
- The package checks the `{{` strings of the scenario for every engine. It
  checks the run-time values only for the Artillery engine: `vars`, captured
  values and the token. A custom engine must refuse such text itself, if its
  tool reads templates. See
  [Text that the engine refuses](#text-that-the-engine-refuses).
- On `signal`, the engine stops its work and throws. It throws `ScenarioError`
  for a scenario that it cannot run, and `RunError` when the load fails.
- `load.step` and the `artillery` options work only with the Artillery engine.
  Nothing checks this yet.
- The baseline file does not record the engine.

## Use any Artillery feature

The Artillery engine owns the target, the token, the metrics and the phases.
The `artillery` option reaches everything else in Artillery. Its types come
from Artillery, so a typo is a compile error. The engine passes the strings
under `artillery` on as they are, so the `{{` check does not read them.

| Option | Where | Use |
| --- | --- | --- |
| `artillery.config` | `config.ts` | Part of the Artillery `config` (`http`, `plugins` and so on), merged into every scenario. It cannot hold `phases`, `processor`, `target` or the `metrics-by-endpoint` plugin, because the package owns them. We use `phases` and `artillery.processor` instead. |
| `artillery.config` | scenario options | The same, merged over the one of `config.ts`. Plain objects merge. An array replaces the one before it. |
| `artillery.raw` | scenario options | `weight`, `onError`, `beforeScenario` and `afterScenario`. The package keeps its own `beforeScenario` and `afterScenario`, and adds the ones of `artillery.raw` after them. |
| `artillery.raw` | request options | Request fields that the package does not own, such as `expect`, `ifTrue`, `capture` by header and `form`. The package keeps its own `capture`, `beforeRequest` and `afterResponse`, and adds the ones of `artillery.raw` after them. |
| `artillery.functions` | scenario options | `{name: fn}` for a `{function: 'name'}` step. The rules of a worker hook hold, but the CLI does not try them before the load. |
| `artillery.processor` | scenario options | The absolute path of a built `.js` file. Its exports are Artillery processor functions. Every worker loads it, so it can import anything. Every worker pays for its imports. |
| `load.step(step)` | the request list | An Artillery flow step, such as `think`, `log`, `function` or `loop`. We build a request inside a `loop` with `load.get(...)`. It gets an endpoint id, limits and hooks. |

In `config.ts`:

```ts
import type {LoadTestConfig} from '@sourceloop/load-testing';

const config: LoadTestConfig = {
  phases: [{duration: 60, arrivalRate: 10}],
  artillery: {config: {http: {timeout: 30}}},
};

export default config;
```

In `orders.controller.load.ts`:

```ts
import {load} from '@sourceloop/load-testing';

load.it(
  'warm up the lists',
  [
    load.step({think: 0.5}),
    load.step({
      loop: [load.get('/orders'), load.get('/products')],
      count: 2,
    }),
    load.get('/orders', {artillery: {raw: {expect: [{statusCode: 200}]}}}),
  ],
  {
    phases: [{duration: 10, arrivalRate: 1, rampTo: 5}],
    artillery: {config: {plugins: {expect: {}}}},
  },
);
```

- A name in `functions` or in the exports of `processor` must not repeat. It
  must not be one that the package generates (`loadTests...`,
  `beforeRequest_<n>` and `afterResponse_<n>`). The run stops on such a name.
- Requests with one endpoint id add up to one result.

## Errors

Every error that the package throws on purpose extends `LoadTestError`. The CLI
prints only the message of such an error. For any other error it prints the
stack, because that is a bug.

| Class | When |
| --- | --- |
| `ConfigError` | `config.ts` (also `artillery.env`), the folder layout, the environment, a datasource, or `token()` with no login. |
| `ScenarioError` | A scenario file, a request, a worker hook, a scenario name, a `{{` string or a capture. |
| `HttpError` | A response of `ctx.api` with a status that is not 2xx. |
| `LoginError` | The login or the refresh of the token failed, also on a redirect. |
| `RunError` | A fault of the engine, a report, the baseline file or a token check. Also a `ctx.api` path with no leading `/`. Also refused text in the `vars` of `before` or in the token. Also a 2xx body that is not JSON. |

- `ConfigError` and `ScenarioError` have `problems`, one line for each problem.
  The message is the header, then one indented line for each problem.
- `HttpError` has `method`, `path` (with the query), `status`, `statusText`,
  `headers`, `body` (the text) and `data`. `data` is the parsed body when the
  response says it is JSON, else `undefined`. Its message holds the first 200
  characters of the body.
- All classes accept `{cause}`.
- A network failure of `ctx.api` is a `RunError` that keeps the cause. The
  message reads `<METHOD> <path> failed: <cause>`, for example with the cause
  `connect ECONNREFUSED 127.0.0.1:4010`. The cause is never empty. A timeout
  reads `<METHOD> <path> timed out after <N> s`. A stalled body gives the same
  text.
- A missing or unreadable Artillery report is a `RunError` with
  `Artillery wrote no valid report: <reportPath>`. It keeps the cause. A report
  file that is not a JSON object gives the same message.
- A report that parses but has no `aggregate` gives the `RunError`
  `<reportPath> has no aggregate: Artillery wrote no result`.
- A report with `aggregate` but no `counters` or `summaries` counts as no
  requests.

```ts
import {HttpError, load} from '@sourceloop/load-testing';

load.it('read an order', [load.get('/orders')], {
  async before(ctx) {
    const api = ctx.api.with({
      headers: {authorization: `Bearer ${ctx.token}`},
    });
    try {
      await api.post('/orders', {reference: 'loadtest-order'});
    } catch (err) {
      if (err instanceof HttpError && err.status === 409) return;
      throw err;
    }
  },
});
```

## Troubleshooting

| What we see | Why, and what to do |
| --- | --- |
| `Set LOAD_TESTS_BASE_URL` (or other `LOAD_TESTS_` names) | A required variable is missing or empty. Set it. With `LOAD_TESTS_USERNAME` set, the password, the client id and the client secret are required too. |
| `No src/__tests__/load/config.ts. Add one that exports the default config ...` | The package has no `config.ts` in the load folder. Add one with `phases`. See [config.ts](#configts). |
| `No *.load.ts file in <dir>` | The load folder has no scenario file. Add a file that ends in `.load.ts`. |
| `<file> registers no scenario. Add a load.it(...) call to it. If it has one, two copies of @sourceloop/load-testing are installed.` | The file has no `load.it`, or it imports another copy of the package. In a workspace, install one copy, so that the CLI and the scenario file share it. |
| `No dist/__tests__/load/config.js. Run npm run build.` | The built file is missing. Build the package. The `pretest:load` script does it. The same message names a missing built scenario file. |
| `src/openapi.json has no GET /orders/{id}` | A request names an endpoint that the OpenAPI file does not have. Check the path and the method. If the route is new, build the app, run `node ./dist/openapi-spec src/openapi.json`, and commit the file. |
| ``No src/openapi.json in <dir>. Build the app, run `node ./dist/openapi-spec src/openapi.json`, and commit the file.`` | The file does not exist. Do the steps in the message. |
| `The load takes 1200 s, and the end of the run needs 120 s more, but the access token expires in 800 s.` | The access token would end before the load ends. Shorten the phases, or give the login client a longer token life. The numbers in the message are ours. |
| `POST <url>/auth/login gave 401: ...` | The username, the password, the client id or the client secret is wrong, or the user cannot use that client. Check the variables and the test user. |
| `POST <url>/auth/login gave 429: ...` | Something limits the rate of the login. The package does not retry. We wait, or we raise the limit for the test environment. |
| `The "pg" package is not installed in <dir>. Install it in the project: npm install --save-dev pg` | A Postgres datasource needs the driver in the project. Run `npm install --save-dev pg` in the package. |
| `POST /orders: json.name contains "{{": use template...` | A plain string has `{{`. Build the text with the tag `template`. |
| `POST /orders: json key "{{ x }}" contains "{{": rename the key` | An object key has `{{`. A key cannot use `template`. Rename the key. |
| `vars.<path> contains text that the engine reads as a template ...` | A text in the `vars` of `before` has the refused text. Put the value in `vars` without it, or leave it out. See [Text that the engine refuses](#text-that-the-engine-refuses). |
| `load-testing hook beforeEach: vars.<path> contains text that the engine reads as a template ...` | The result of `beforeEach` has the refused text. The vuser failed. Return the value without it. |
| `load-testing hook capture: ...` with `in the value of <endpoint id> at <JSON path>` | A response gave a value with the refused text to a `captureFrom`. The vuser stopped before its next request. We read the full message in the report file. |
| `The access token contains text that the engine reads as a template ...` | The access token has the refused text. Log in again to get another token. |
| `The base URL contains text that the engine reads as a template ...` | `LOAD_TESTS_BASE_URL` has the refused text. Use a URL without it. |
| `errors.load-testing hook ...  <count>` in the summary of Artillery | Artillery cuts a line at 79 columns. The full text is the key `errors.<message>` under `aggregate.counters` in `src/__tests__/load/.out/<slug>.report.json`. See [Text that the engine refuses](#text-that-the-engine-refuses). |
| `{{ $env.MY_REGION }}` is empty in a script | Artillery gets only an allowed list of variables. Add the exact name to `artillery.env` in `config.ts`. See [The environment of Artillery](#the-environment-of-artillery). |
| `artillery.env must be an array of variable names, for example ["MY_REGION"]` | `artillery.env` is not an array. Write a list of names. |
| `artillery.env[<i>] must be a text that is not empty`, `artillery.env[<i>] must not have "="`, or `artillery.env[<i>] "<name>" is not allowed: these variables are for the CLI only` | An entry of `artillery.env` is not a name, has `=`, or starts with `LOAD_TESTS_`. Use the exact name of a variable that is not for the CLI. |
| `POST <url> gave <status>, a redirect to <origin>. The login does not follow redirects, ...` | The auth URL redirects. Set `LOAD_TESTS_AUTH_URL` to the final URL. |
| `<METHOD> <path>: the path must start with "/"` | A `ctx.api` call has a path with no leading `/`. The call sends nothing. Start the path with `/`. |
| `beforeEach returned a promise: worker hooks must be synchronous` | A worker hook is `async`, or returns a promise. Make it synchronous. Do async work in `before`. |
| `... can use only its arguments and the globals of a worker, such as URL and Buffer: x is not defined` | A worker hook uses an import or a variable of its module. Pass the value through `vars`, or use only globals. |
| `randomNumber: the minimum and the maximum must be whole numbers from 0 up` | A value is negative or has a fraction. Use whole numbers from 0 up, with `min` not above `max`. |
| `The scenario name "<name>" gives the file name "baseline", ...` | The file name `baseline` is for the baseline file. Rename the scenario. |
| `phases[i].duration must be a whole number above 0, or a text such as "1m"` | A phase has a bad time or count. Use a whole number above 0. The same holds for `pause` and `arrivalCount`. A phase with `rampTo` needs `arrivalRate`. |
| `phases[i] needs arrivalRate or arrivalCount` | A phase has neither a rate nor a count. Add `arrivalRate`, or `arrivalCount`. |
| `POST /orders failed: connect ECONNREFUSED 127.0.0.1:4010` | The request did not reach the app. Check the base URL and that the app runs. The text after `failed:` is the cause. |
| `POST /orders timed out after 60 s` | The app did not answer in time. Check the app. For a slow call, set `timeoutMs` in the options of the call. |
| `Artillery wrote no valid report: <reportPath>` | Artillery wrote no report, or the file is broken. Read the output of Artillery above the line. |
| `<reportPath> has no aggregate: Artillery wrote no result` | The report parses but holds no result. Read the output of Artillery above the line. |
| `ctx.sql: the connection to <name> broke: ...` | An idle database connection broke. The CLI prints this on stderr. The next call opens a new connection. Check the database if it repeats. |
| `No scenario runs: every scenario has .skip` | `CI` is set and every scenario is skipped. Remove a `.skip`. |
| `.only is not allowed when CI is set: ...` | A `.only` stays in a file. Remove it before the push. |
| `vars("x") is set by neither before nor beforeEach` | A request reads `vars('x')` that no hook sets. Set it in `before` or return it from `beforeEach`. |
| `capture source "GET /orders" is not a request in this scenario` | No request of the scenario has this endpoint id. Check the id. |
| `capture source "GET /orders" is not earlier in the flow` | The request exists, but it comes after the `captureFrom`. Move it before. |
| `capture source "GET /orders" runs in parallel with this request` | The source is in the same `load.parallel` group. Capture from a request before the group. |
| `Two scenarios have the same name: ...` | Two scenarios give the same generated file name. Rename one. |
| `token() needs a login: ...` | A scenario sends `token()`, but `LOAD_TESTS_USERNAME` is not set. Set the login variables. |
| `FAIL: 3 heavy APIs, but maxHeavyApis is 2. ...` | The package has more heavy APIs than it can have. Lower the `p95` limit of an endpoint to 1000 ms or less. Raise `maxHeavyApis` only for performance debt that the pull request lists. |
| `Artillery stopped with code 1: <script>` | Artillery failed. Its own output, above this line, tells why. |
| `artillery is missing from @sourceloop/load-testing: reinstall the package` | Artillery is not installed. Reinstall the package, and do not prune its dependencies. |
| `src/__tests__/load/.out/baseline.json ... Delete it, and record a new one.` | The baseline file is not valid. Delete it, and run with `LOAD_TESTS_UPDATE_BASELINE=1`. |
| Every row says `pass (workload changed)` | The phases changed since the baseline. Run once with `LOAD_TESTS_UPDATE_BASELINE=1` to start a new history. |

## Limits

- The package runs on one machine, with the local mode of Artillery. The workers
  are threads of the Artillery process. It does not spread the load over many
  machines.
- Artillery does not split a CSV `payload` between the workers. Each worker gets
  the whole payload. So we cannot use a CSV to give each vuser its own row.
- The scenarios of a package run one after another, never in parallel.
- The CLI kills the Artillery processes when it exits, but it cannot catch a
  SIGKILL of itself. After such a kill, Artillery processes can stay alive.
- The engine sends one access token for the whole load of a scenario. The token
  life limits the length of a load. See [Log in](#log-in).
- The count of heavy APIs leaves a gap. If a fix lands and `maxHeavyApis` stays
  the same, a new heavy API can take its place without a failure. See
  [Heavy APIs](#heavy-apis).
- The p95 is the time to the first byte of the response. It does not include
  the download of the body. Artillery reads this time from its HTTP engine.
- The p95 includes the whole network path. For a request to a facade, that is
  the client to the facade, the facade to a service, and the service to its
  database. The number also depends on the machine that runs the load. A pass
  on a CI runner does not prove the target in production.
- A baseline is good only for the machine that made it, and only for one
  workload.
- The package measures HTTP responses only. It does not test a background job
  that an endpoint starts.
- A value that a request captures through `artillery.raw` on the request (its
  `capture` field) gets no check for the refused text. The package checks only
  `captureFrom`.
- A `beforeEach` result with the refused text is found in the worker, not
  before the load starts.
- The package does not check where the URLs point. We run it only against a
  local or a test environment.

## Source layout

This part is for people who change the package. Each folder is one step of a
run.

| Path | What it holds |
| --- | --- |
| `types.ts` | The public types: scenario, request, hooks, config. |
| `errors.ts` | All error classes, `errorMessage`, `fetchFailure`, `guardedStep` and `MS_PER_SECOND`. |
| `output.ts` | `print`, `printError`, `output` and `ignoreOutputErrors` (stops a dead terminal from ending the process). No other file writes to the console. |
| `scenario/` | What a load file calls (`builder.ts`), the values (`values.ts`, `braces.ts`), headers (`headers.ts`), `token.ts`, the name of a scenario (`label.ts`), `.only` and `.skip` (`select.ts`), the load (`workload.ts`). `brand.ts`, `guards.ts` and `types.ts` mark and check the objects that the calls make, and hold the scenario types. |
| `context/` | What `before` and `after` get as `ctx`: `api.ts`, `sql.ts`, `postgres.ts`, `driver.ts` and `cleanup.ts`. `types.ts` holds the types of `ctx`. |
| `project/` | What the CLI reads from a package: where its files are (`layout.ts`), `config.ts`, the scenario files (`loader.ts`), `spec.ts` and `heavy.ts`. `types.ts` holds the types of these files. |
| `report/` | Judges the measurement against the limits and the baseline (`compare.ts`, `report.ts`), and the default reporter (`console.ts`). |
| `engine/` | The `Engine` type. `index.ts` is the `artillery()` engine, and `types.ts` holds the Artillery types. `engine/artillery/` is the Artillery adapter. It holds the transpiler, the worker hooks (`processor.ts`), `requests.ts`, the check for the refused text (`templates.ts`), the environment of the process (`env.ts`), the process (`runner.ts`) and the report reader (`measure.ts`). |
| `run/` | One run: the login (`target.ts`), `tokenCheck.ts`, Ctrl-C (`cancel.ts`), `prepare.ts`, `execute.ts`, the token refresh (`session.ts`) and the baseline save (`baseline.ts`). `types.ts` holds the types of a run. |

`cli.ts` is the command, and `index.ts` is what the package exports.

The import order is `types.ts`, `errors.ts`, `output.ts`, `scenario`,
`context`, `project`, `report`, `engine`, `run`, `cli.ts`. At run time, a file
imports only from the files and folders before it in this list. There is one
exception, for types only. `types.ts` has `import type` lines for the
`types.ts` files of later folders. They leave no trace in the built code, so
they cannot make a cycle. A cycle of run-time imports is a bug. Only `cli.ts`
and `index.ts` import the code of `engine/artillery/`. The unit tests in
`src/__tests__/unit/` use the same folders.

## License

MIT, copyright SourceFuse. See the `LICENSE` file.

Artillery, which this package installs as a dependency, has the MPL-2.0
license. We use it unmodified.
