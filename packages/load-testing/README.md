# @sourceloop/load-testing

Load tests for the HTTP API of a LoopBack facade or service, and for the screens of a web app. We write scenarios in TypeScript, next to our other tests. The package turns each scenario into an [Artillery](https://www.artillery.io) script, and runs it against an app that already runs. It fails the run when an endpoint is too slow, has too many errors, or got slower than its baseline. It also fails the run when the project has too many heavy APIs.

A browser scenario opens the web app in Chromium, for many users at once. It times the steps that a user waits for, and reads the Web Vitals of each page. The same limits, baseline and report apply. See [Browser scenarios](#browser-scenarios).

This package is for load. For a serial latency gate on one operation, with no concurrent users, use [`@sourceloop/benchmarking`](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/packages/benchmarking). The two work well together. The benchmark guards the code, and the load test guards the running system.

New to the package? Read [Install](#install) and [Quickstart](#quickstart), then [Quickstart for a browser scenario](#quickstart-for-a-browser-scenario). Looking for an option, a default or a message? Go to [Reference](#reference) and [Troubleshooting](#troubleshooting).

Contents:

- [Overview](#overview)
  - [When to use it](#when-to-use-it)
  - [What this is, and what it is not](#what-this-is-and-what-it-is-not)
- [Get started](#get-started)
  - [Install](#install)
  - [Quickstart](#quickstart)
  - [Quickstart for a browser scenario](#quickstart-for-a-browser-scenario)
  - [Read the output](#read-the-output)
  - [Fix a failure](#fix-a-failure)
  - [Run it locally and in CI](#run-it-locally-and-in-ci)
- [Concepts](#concepts)
  - [Words we use](#words-we-use)
  - [How a run works](#how-a-run-works)
  - [Limits, baseline and report](#limits-baseline-and-report)
- [Guides and recipes](#guides-and-recipes)
  - [Set up a package in a facade and service monorepo](#set-up-a-package-in-a-facade-and-service-monorepo)
  - [Write scenarios](#write-scenarios)
  - [Set the load](#set-the-load)
  - [Hooks](#hooks)
  - [Test data](#test-data)
  - [Datasources](#datasources)
  - [Log in](#log-in)
  - [Browser scenarios](#browser-scenarios)
  - [Thresholds and the verdict](#thresholds-and-the-verdict)
  - [Baseline](#baseline)
  - [Run in CI](#run-in-ci)
  - [Report](#report)
  - [Recipes](#recipes)
- [Best practices](#best-practices)
  - [One endWhenVisible step per screen](#one-endwhenvisible-step-per-screen)
  - [Choose selectors for end elements](#choose-selectors-for-end-elements)
  - [Size the load](#size-the-load)
  - [Keep a stable baseline](#keep-a-stable-baseline)
  - [Production build or dev server](#production-build-or-dev-server)
  - [What the Artillery counters mean](#what-the-artillery-counters-mean)
  - [HTTP scenarios](#http-scenarios)
- [Reference](#reference)
  - [config.ts](#configts)
  - [Limits: levels and merge order](#limits-levels-and-merge-order)
  - [Defaults and limits at a glance](#defaults-and-limits-at-a-glance)
  - [Command line and environment](#command-line-and-environment)
  - [Errors](#errors)
  - [Engines](#engines)
  - [Use any Artillery feature](#use-any-artillery-feature)
- [Help and internals](#help-and-internals)
  - [Troubleshooting](#troubleshooting)
  - [Limits](#limits)
  - [How it works inside](#how-it-works-inside)
  - [Source layout](#source-layout)
  - [Contributing](#contributing)
- [License](#license)

## Overview

### When to use it

Use this package when a change can make an API or a screen slower, and we want the CI job to fail before a user sees it. `load.it` registers an HTTP scenario, and `load.browser` registers a browser scenario.

| We want to know | We use |
| --- | --- |
| Does each endpoint of a running API stay fast with many users at once? | `load.it` |
| How long does a user wait on each screen of a web app, with many users? | `load.browser` |
| Does one operation stay fast in code, with no concurrent users? | [`@sourceloop/benchmarking`](https://github.com/sourcefuse/loopback4-microservice-catalog/tree/master/packages/benchmarking) |
| Does a screen show the right content, and does a click do the right thing? | Playwright tests |

A run fails, with exit code 1, when an endpoint or a screen step is too slow, has too many errors, or is slower than its baseline. See [Limits, baseline and report](#limits-baseline-and-report).

### What this is, and what it is not

This package load tests the HTTP API of one running app. The app can be a facade or a service. A scenario is a list of requests that a virtual user sends. The package sends many such users at the rate we choose, measures the p95 time of each endpoint, and judges it. A browser scenario does the same for a web app. Each virtual user opens the app in Chromium and runs a flow of steps.

It has limits on purpose.

- It does not start apps or databases. We start them before the run.
- It does not check what a screen does. Our Playwright tests do that. A browser scenario only times the screens.
- A browser scenario does not time the API calls of the page. A `load.it` scenario on the same API does that.
- It runs on one machine. It does not spread the load over many machines.
- It does not check where the URLs point. The scenarios create and delete data. We run them only against a local or a test environment, never against production.

## Get started

### Install

```sh
npm install --save-dev @sourceloop/load-testing
```

What we need to know before the install.

- We need Node 22 from 22.18, or Node 24. Odd releases are not supported. The `engines` field of the package says `>=22.18.0 <23 || 24`. The floor comes from Artillery 2.0.34, which asks for Node 22.18 or later.
- Artillery comes with the package as a dependency, pinned to 2.0.34. We install nothing else for it. An install of this package into an empty project adds 468 packages (npm 11, Artillery 2.0.34, measured on 2026-10-09). Artillery has the MPL-2.0 license. We use it unmodified.
- Artillery lists `@playwright/browser-chromium`, and that package downloads a browser in its install script. A project with only `load.it` scenarios does not need the browser. It skips the download with `npm install --ignore-scripts`, or it sets `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` before the install.
- A project with browser scenarios needs Chromium for the Playwright of Artillery, 1.62.1 today. `npm install` already downloads it, through `@playwright/browser-chromium` 1.62.1, a dependency of Artillery 2.0.34. It does not when npm runs no install scripts (for example with `ignore-scripts`, or when npm blocks the script) or when `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` is set. Then we run `npx playwright@1.62.1 install chromium`. On a new Linux machine, we add `--with-deps` for the OS libraries. A plain `npx playwright install` gets the browser of the project's own Playwright, which can be another build.
- `pg` is an optional peer dependency. We install it only when a datasource has `type: 'postgres'`. See [Datasources](#datasources).
- We compile with `skipLibCheck: true`. The type file of Artillery 2.0.34 (`artillery/types.d.ts`) has an error of its own. The LoopBack `tsconfig` of an ARC app already sets this option.

The Artillery engine switches the Artillery telemetry off (`ARTILLERY_DISABLE_TELEMETRY`), so Artillery sends no usage data. Artillery also gets only a short list of the variables of the CLI. See [The environment of Artillery](#the-environment-of-artillery).

The package finds Artillery when the first scenario runs, not at import. If it is missing, the run stops with this message:

```text
artillery is missing from @sourceloop/load-testing: reinstall the package
```

### Quickstart

This is the shortest working setup, in the facade `orders-facade`. We assume that the facade has an `npm run build` script and a committed `src/openapi.json`. See [Set up a package](#set-up-a-package-in-a-facade-and-service-monorepo).

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

Fourth, the environment. The login user is a test user (see [Log in](#log-in)). The password and the secret come from the shell or from CI secrets, never from a file in git.

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

The CLI prints `Scenario: <name>` before each scenario, and Artillery prints its own progress while the load runs. At the end the console reporter prints the result. This is the first run, so no baseline exists yet.

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

The run passes, and the exit code is 0. To record the baseline, run again with `LOAD_TESTS_UPDATE_BASELINE=1`. Later runs compare each p95 with it. See [Baseline](#baseline). The numbers above are an example, and ours will differ.

### Quickstart for a browser scenario

This is the shortest working setup for a web app. We assume that the app has an `npm run build` script, and that we can serve its production build on a port. See [Production build or dev server](#production-build-or-dev-server).

First, `src/__tests__/load/config.ts`. A browser run needs only `phases`.

```ts
import type {LoadTestConfig} from '@sourceloop/load-testing';

const config: LoadTestConfig = {
  phases: [{name: 'steady load', duration: 10, arrivalRate: 1}],
};

export default config;
```

Second, `src/__tests__/load/home.load.ts`. Each vuser gets a Chromium `page`. A relative URL in `page.goto` starts at `LOAD_TESTS_UI_URL`, which we set in step four. The step ends at the first animation frame where its end element is visible. We replace `main` with an element that only the loaded page shows.

```ts
import {load} from '@sourceloop/load-testing';

load.browser('open the home page', async ({page, step}) => {
  await step('open', () => page.goto('/'), {endWhenVisible: 'main'});
});
```

Third, the build. Angular, Vite and webpack do not write `dist/__tests__`, so the load files get their own `tsc` build. We copy `tsconfig.load.json` from [Set up a web app](#set-up-a-web-app), and add two scripts.

```json
{
  "scripts": {
    "pretest:load": "tsc -p tsconfig.load.json",
    "test:load": "load-testing run ."
  }
}
```

Fourth, we build the app for production and serve it. A run of only browser scenarios needs this one variable.

```sh
export LOAD_TESTS_UI_URL=http://localhost:4200
npm run test:load
```

`npm install` downloads Chromium. If it did not, see [Install](#install). The CLI starts and closes Chromium to check it, runs the load, and prints one block for the scenario. This is the end of the output for a page that has a `main` element. The numbers are an example, and ours will differ.

```text
Results

open the home page
Workload: 1 vusers/s for 10 s
Vusers:   10 started, 10 completed, 0 failed (limit 1%)
Flow:     p95 141.2 ms (no limit)
Metrics:  5 of 5 pass. Run load-testing report to see each one.

Coverage: not calculated, because the application has no API specification.
No src/__tests__/load/.out/baseline.json. Run once with LOAD_TESTS_UPDATE_BASELINE=1 to record it.
```

The exit code is 0. `npm run test:load` stops with 1 when a metric fails. We run `npx load-testing report .` to see every metric. See [Read the output](#read-the-output).

### Read the output

Each scenario prints one block. The exit code is the verdict: 0 when everything passed, 1 when something failed.

An HTTP scenario prints a table. Each row is one endpoint.

| Column | Meaning |
| --- | --- |
| `Workload`, `Vusers` | The load that ran, and how many vusers started, completed and failed. |
| `Requests`, `Req/s` | How many requests the endpoint got, and the rate. |
| `p95 ms (limit)` | The p95 of the endpoint, and the highest p95 that passes. |
| `Base ms` | The baseline p95. `-` means that there is none yet. |
| `Err % (limit)` | The share of failed requests, and its limit. |
| `Result` | `pass`, or `FAIL:` and the reasons. |

A browser scenario prints a short block: the vusers, the flow total, and how many metrics pass. A table follows only when a metric fails, and it holds only the failed rows. `load-testing report <package-dir>` prints every metric. See [Report](#report) for full samples of both.

Artillery is the engine under the package. Each run prints its progress while the load runs, and its counters at the end of the load. See [What the Artillery counters mean](#what-the-artillery-counters-mean).

### Fix a failure

Read the `Result` column first. Each `FAIL:` reason has a usual cause.

| The reason says | The usual cause | What we do |
| --- | --- | --- |
| `no requests` | The endpoint never got a request. An earlier request stopped the vuser, a `captureFrom` found nothing, or a hook failed. | Read the Artillery output above the table. Fix the first error. |
| `error rate X% > Y%` | The app answered with 4xx or 5xx, or the network failed. | Check the app log, the token, and the data that `before` creates. |
| `p95 X ms > limit Y ms` | The endpoint is slow, or the load is too high for the machine. | Run with fewer vusers to tell the two apart. If the limit is wrong, set `p95` and write the reason. |
| `p95 +N% (+M ms) over baseline B ms` | The endpoint got slower than its last 10 runs. | Find the change. If it is on purpose, see [Baseline](#baseline). |
| `no samples` | No vuser ran the step, or a step name has a typo. | Check the names in `steps`, and the errors of the vusers. |
| `lost samples: N for M completed vusers` | Some vusers did not run the step, or a page sent no Web Vital. | Make every vuser run every step. |
| `vuser failure rate X% > Y%` | A browser scenario judges failed vusers. The share of failed vusers is above `errorRate`. | Read the errors of the failed vusers. Fix the first one. |
| `FAIL: <message>` and no table | The scenario stopped before or during the load. | Read the message, and find it in [Troubleshooting](#troubleshooting). |

The full list of reasons is in [The reasons in a FAIL line](#the-reasons-in-a-fail-line).

### Run it locally and in CI

Locally, we start the app, build, and run `npm run test:load`. We add `LOAD_TESTS_UPDATE_BASELINE=1` to record the first baseline. In CI, the job starts the app, restores the baseline, and runs the same script. See [Run in CI](#run-in-ci) for an API repo and a web app repo.

## Concepts

### Words we use

| Word | Meaning |
| --- | --- |
| Scenario | One `load.it`. A list of requests that one virtual user sends. We name it after what a user does. |
| Browser scenario | One `load.browser`. A flow that one virtual user runs in Chromium. |
| Step | A named and timed part of a browser flow, for example `step('save', action)`. |
| End element | The element that the CSS selector of `endWhenVisible` finds. The step ends at the first frame where this element is visible. |
| Flow total | The time of the whole flow of one vuser. The report shows it, and it has a limit only when the scenario sets `flow`. |
| Web Vitals | FCP (first contentful paint), LCP (largest contentful paint), CLS (cumulative layout shift), TTFB (time to first byte) and INP (interaction to next paint). Artillery reads them only in the first page that a vuser opens. A second page of the same vuser reports none. |
| Endpoint id | `METHOD path`, for example `GET /orders/{id}`. Results and baselines use it. |
| Vuser | A virtual user. It runs the steps of a scenario once. |
| Phase | One step of the load, for example `{duration: 60, arrivalRate: 10}`. A load is a list of phases. |
| Workload | The load of a scenario as one line of text, for example `10 vusers/s for 60 s`. |
| p95 | The time that 95% of the requests beat, in milliseconds. The time runs to the first byte of the response. It does not include the download of the body. |
| Limit | The highest value that passes. Each threshold has one. |
| Baseline | The mean p95 of the last 10 recorded runs of an endpoint. |
| Report | The text that the reporter prints at the end of a run. `load-testing report` prints it again from the last run. |
| Verdict | Pass or fail, for an endpoint, a scenario and the whole run. The exit code of `run` gives it. |
| Heavy API | An endpoint with a `p95` limit above `P95_TARGETS.supportingApi` (1000 ms). |
| Hook | A function that runs at a set point of a run, for example `before`. |
| Value | An object that the engine fills in at run time, for example `randomString()`. |
| Datasource | A named database connection that `ctx.sql` can use. |
| Engine | The part that runs the load and measures it. The default is Artillery. |
| Reporter | The part that gets the result of the run. The default prints to the console. |

### How a run works

`load-testing run <package-dir>` does these steps, in this order.

1. Read `src/__tests__/load/config.ts` from `dist`, and check its values.
2. Load every `*.load.ts` file from `dist/__tests__/load`. Check the names, the limits, the phases and the values of each scenario.
3. Choose the scenarios to run (`.only` and `.skip`).
4. Check that every endpoint of the scenarios that run is in `src/openapi.json`. A package without this file still runs, and it skips the check.
5. Read the environment. `LOAD_TESTS_BASE_URL` is required when a `load.it` scenario runs, when a browser scenario has `before` or `after`, or when the run logs in. `LOAD_TESTS_UI_URL` is required when a browser scenario runs. Stop with a `ConfigError` when a scenario sends `token()` and no login is set.
6. Log in, when `LOAD_TESTS_USERNAME` is set.
7. Read the baseline file, if it exists.
8. For each scenario, one after another:
   1. Get a fresh access token, if the old one is more than a minute old.
   2. Run `before`.
   3. Run the token check, if the scenario sends `token()`.
   4. Write the Artillery script (and the worker hooks file), and try the worker hooks once.
   5. Run the phases with Artillery, and read its report.
   6. Run `after`, then the cleanups (the last one first), then close the SQL connections.
   7. Judge the scenario against its limits and the baseline.
9. Judge the run. Every scenario must pass, and the count of heavy APIs must be at most `maxHeavyApis`.
10. Print the report with the reporters.
11. Save the baseline, if `LOAD_TESTS_UPDATE_BASELINE=1`. A failed run is not saved, unless `LOAD_TESTS_FORCE_BASELINE=1`.
12. Exit with 0 when the run passed, and with 1 when it did not.

Step 8.6 runs also when `before` or the load failed, and after a signal.

Before it starts, each `load-testing run` deletes the report files of the last run. So `load-testing report` judges only the last run.

A browser scenario has `before` and `after`, but no token check or worker hooks. Its script runs the Playwright engine of Artillery. Before each browser scenario, the CLI runs the `check` of its browser. For Chromium, it starts and closes the browser, to check that it works. The check uses the `launchOptions` of `engines.playwright` in `artillery.config`, as Artillery does, or the ones that we give to `chromium()`. See [Browsers](#browsers).

### Limits, baseline and report

A run turns what the engine measured into a verdict.

1. The engine (Artillery by default) measures each endpoint: requests, errors and p95. For a browser scenario, it measures each step, each Web Vital and the flow total.
2. The package compares each value with its limits.
3. The reporter prints the result. `load-testing report` prints it again from the report files of the last run.
4. The exit code gives the verdict, 0 or 1.

There are four limits for an HTTP endpoint. A browser metric has `p95`, `p95Regression` and `minDelta`. A browser scenario judges failed vusers with the `errorRate` of `thresholds.default`.

| Limit | It asks | Needs a baseline | Default |
| --- | --- | --- | --- |
| `p95` | Is the p95 at or below this many ms? | No | 500 |
| `errorRate` | Is the share of failed requests at or below this percent? | No | 1 |
| `p95Regression` | Is the p95 at most this percent above the baseline? | Yes | 20 |
| `minDelta` | Is the p95 more than this many ms above the baseline? | Yes | 10 |

A regression fails the run only when it is above both `p95Regression` and `minDelta`. The baseline is the mean of the last 10 recorded runs. Without a baseline, a run checks `p95` and `errorRate` only. See [Thresholds and the verdict](#thresholds-and-the-verdict) and [Baseline](#baseline).

## Guides and recipes

The guides below follow the work of one project. We set up the package, write HTTP scenarios, write browser scenarios, set limits and a baseline, run in CI, and read the report. [Recipes](#recipes) at the end answers short "how do I" questions.

### Set up a package in a facade and service monorepo

Our monorepos hold facades and services. A facade takes the request from the client, calls one or more services, and each service reads its own database.

#### Where the tests live

We put the load tests in the facade in most cases. A request to the facade passes through the whole path, from the facade to the services and to the databases. So one test covers all of it. A service can have its own load tests too, for an endpoint that clients do not reach through a facade. The set-up is the same for both, and each package has its own `config.ts`, scenarios and baseline.

#### Build first

The package does not compile our TypeScript. It loads the files that `tsc` made, from `dist`. For `src/__tests__/load/<name>.load.ts` it loads `dist/__tests__/load/<name>.load.js`. So we build before each run. The `pretest:load` script of the quickstart does it.

- A missing built file stops the run, and the message names the file.
- A built file that has no source file is never loaded.
- The build step must keep `dist/__tests__`. Most services of this catalog run `openapi-spec` in `build` or `postbuild`. Their `preopenapi-spec` hook runs `rm -rf dist/__tests__`, and it runs on every call of `openapi-spec`. So after it, we compile again. The `pretest` script of such a service does it, and `pretest:load` can do the same, for example `"pretest:load": "npm run clean && lb-tsc"`.

#### The OpenAPI file

The CLI checks every endpoint of the scenarios against `src/openapi.json`. The run stops when a request names an endpoint that the file does not have. The report also shows how many endpoints of the file the scenarios cover.

A package without the file still runs. It skips the check, and the coverage line reads `Coverage: not calculated, because the application has no API specification.` A web app with only browser scenarios needs no such file. An API package makes the file as shown below.

ARC apps have an `openapi-spec` script. It boots the built app from `dist`, and writes the spec to the path that we pass. We build the app first, then we run the script file with `node`. We generate the file, and we commit it.

```sh
npm run build
node ./dist/openapi-spec src/openapi.json
```

In an app that the ARC generator made, `npm run openapi-spec -- src/openapi.json` also works, because its `preopenapi-spec` hook builds the app first. Some scripts have several commands, as in some catalog services. Then npm gives the path to the last command only. So we call `node` directly.

We run this again after each change of a route, so the file stays current. The CLI does not fetch the spec from the running app. The apps serve it behind Basic auth when `authenticateSwaggerUI` is on in the core config.

#### Keep load files out of the unit tests

The unit test run of the package loads `dist/__tests__`, and that folder now holds the load files. A load file is not a unit test. We tell Mocha to ignore the folder in `.mocharc.json`.

```json
{
  "exit": true,
  "recursive": true,
  "require": "source-map-support/register",
  "ignore": ["dist/__tests__/load/**"]
}
```

#### Ignore the generated files

The CLI writes its generated files to `src/__tests__/load/.out/`. These are the Artillery scripts, the worker hooks files, the reports and `baseline.json`. We add this line to `.gitignore` and to `.prettierignore` of the package. Prettier reads only the ignore files of the folder where it runs, so without the line `npm run lint` fails after a load run.

```text
src/__tests__/load/.out
```

The baseline is the one file that we can keep between CI runs. See [Baseline](#baseline).

#### Folder layout and naming

The CLI finds every `*.load.ts` file under `src/__tests__/load/`, also in subfolders, in the order of the paths. We do not list them.

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

- A load file holds the scenarios. Its hooks only call functions of `fixtures/`. A load file never imports another load file.
- A fixture file makes and removes the rows of one entity. A function that makes data starts with `given`, for example `givenCustomer`. It registers the cleanup of what it made with `ctx.defer`, right after the create. A function that removes data starts with `cleanup`.
- A fixture file can import the fixtures of an entity that it needs. There must be no import cycle. If an order needs a customer, `order.ts` imports `customer.ts`, and `customer.ts` never imports `order.ts`.
- The CLI loads only `*.load.ts` files. A file in `fixtures/` is an import.
- We name a scenario after what a user does, for example "browse orders and customers". The report shows the name as the heading of the scenario. A name such as "returns 200" tells the reader nothing.

A fixture function takes the `RunContext` that `before` gets. We import the type with `import type`, because the package lints with `@typescript-eslint/consistent-type-imports`. This is `fixtures/customer.ts`. The fixture sends the token itself, because `ctx.api` does not. See [The ctx of before and after](#the-ctx-of-before-and-after).

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

The hook of a scenario calls it, for example `runVars.customerId = await givenCustomer(ctx)`.
### Write scenarios

#### load.describe and load.it

`load.it(name, requests, options?)` adds one scenario, like `it` of Mocha. `load.describe(name, options?, fn)` groups the scenarios of a file, like `describe`. A `load.describe` can hold other `load.describe` blocks. Its function runs at once, and it cannot be async. A file needs at least one `load.it` or `load.browser`.

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

- The scenarios run one after another. Files run in file-name order, and a file runs in the order of its `load.it` calls. They share the app, its pools and the baseline, so they do not run in parallel. Each scenario has its own load, hooks and data.
- The name of a scenario in the report and in `baseline.json` is `group › name`, for example `OrderController › browse products`. The CLI names the generated files after it, in lower case with `-` between the words. Two scenarios cannot make the same file name, and a name needs a letter or a digit. A browser scenario runs once for each browser, so its label ends with the browser, for example `orders › save an order › chromium`. See [Browsers](#browsers).
- The file name `baseline` is reserved for the baseline file. The CLI refuses a scenario whose file name would be `baseline`, for example `baseline` or `Baseline!`, when it loads the scenarios. The message reads `The scenario name "<name>" gives the file name "baseline", which the baseline file uses. Rename the scenario.` The name `baseline orders` is fine.
- The endpoint id is `METHOD /path`, with the path as we wrote it, for example `GET /orders/{id}`.

#### Run only some scenarios

| Call | Effect |
| --- | --- |
| `load.it.only(...)`, `load.describe.only(...)` | Only the scenarios with `only` run. |
| `load.it.skip(...)`, `load.describe.skip(...)` | The scenario does not run. The report lists it as `Skipped`. |

- On a `load.describe`, `.only` and `.skip` apply to every scenario inside it.
- `skip` wins over `only`. Only a scenario with `.only` and without `.skip` runs. A `.only` on a scenario that also has `.skip` runs nothing. When no other scenario has `.only`, nothing runs. The report lists every scenario as skipped. The scenarios that `.only` leaves out are listed as skipped too. This holds only on a local run. With `CI` set, such a `.only` is an error (see below).
- A `.only` that stays in a file hides the other scenarios. When the variable `CI` is set to a value other than empty, `0` or `false`, a `.only` stops the run. The CLI ignores the letter case, so `False` and `FALSE` also mean that this is not CI. Any other value means CI. A `.only` stops the run in CI, also when the same scenario has `.skip`. The message names the scenarios, like `mocha --forbid-only`. We remove the `.only` before we push.
- When `CI` is set and every scenario is skipped, the run stops with `No scenario runs: every scenario has .skip`. So a green gate cannot hide that nothing ran. A local run prints `Skipped:` lines and exits with 0.
- When `.only` leaves scenarios out, the CLI prints a line such as `Only 1 of 2 scenarios run (.only)`.

#### Requests

`load.get`, `load.post`, `load.put`, `load.patch` and `load.delete` make a request. Each takes the path and an options object. A path can hold `{name}` parts, which `pathParams` fills. A name is any text without braces or a slash, for example `{id}` or `{order-id}`.

| Option | Use |
| --- | --- |
| `pathParams` | Fills the `{name}` parts of the path. A string, a number or a value. |
| `query` | The query string. A number or a boolean becomes its text. |
| `json` | The JSON body. A value works at any depth, through plain objects and arrays. A `Date` or a class instance goes as it is. |
| `headers` | Headers of this request. They win over the headers of the scenario. |
| `p95`, `errorRate`, `p95Regression`, `minDelta` | Limits of this endpoint. See [Thresholds and the verdict](#thresholds-and-the-verdict). |
| `beforeRequest`, `afterResponse` | Worker hooks of this request. See [Hooks](#hooks). |
| `artillery` | `{raw}`, the Artillery request fields. See [Use any Artillery feature](#use-any-artillery-feature). |

A request object belongs to one place in a flow. To send the same request twice, call `load.get` twice.

#### Values

A value is an object that the engine fills in when a vuser sends a request. It works in the `json`, `pathParams`, `headers` and `query` of a request. The scenario holds no `{{ }}` engine syntax.

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
- A plain template literal fails on purpose. `${randomString()}` in a normal backtick string calls `toString()` of the value, and this throws a `TypeError` that says to use `template`. Without the throw, the text would be `[object Object]`.
- For the same reason, a value cannot go into `JSON.stringify`. `toJSON()` throws a `TypeError`. We build a JSON text that holds a value, such as a `filter`, with `template` (see the second scenario above).
- A plain string that contains `{{` in `path`, `pathParams`, `headers`, `query` or `json` stops the run with a `ScenarioError`. This keeps the syntax of one engine out of the scenario. The CLI does not check the strings under `artillery`. A value that a hook or a response gives at run time has its own check. See [Text that the engine refuses](#text-that-the-engine-refuses).
- The same check covers the keys of objects in `json`, `headers`, `query`, `pathParams` and the `headers` of a scenario. The message reads `POST /orders: json key "{{ x }}" contains "{{": rename the key`. For a nested key it reads `json.deep[0] key "a{{" contains "{{": rename the key`. A key cannot use `template`, so we rename it. A body with a key named `constructor`, or an object from `Object.create(null)`, gets the same checks.
- The check reads one string at a time. Two strings that touch can still form `{{` after the engine joins them. So in a `template`, we never put a lone `{` next to a value.
- `captureFrom` works in all four places, also inside a `template`. The source must be an earlier request of the same scenario, found by its endpoint id. It cannot be a request of the same `load.parallel` group. A capture that finds nothing stops the vuser.
- `vars('name')` needs a `name` from the `vars` of `before`, or from what `beforeEach` returns. The CLI stops before the load when no hook sets it.
- There is no list of custom values. For a value that these calls cannot make, we compute it in a hook (`before`, `beforeEach` or `beforeRequest`), and read it with `vars(name)`.
- The calls check their arguments when the scenario file loads. For example `randomString(0)` and `randomNumber(5, 1)` throw a `TypeError`. `randomString(length)` needs a whole number from 1.
- `randomNumber(min, max)` needs whole numbers from 0 up, and `min` must not be above `max`. A negative or fractional value throws a `TypeError` with `randomNumber: the minimum and the maximum must be whole numbers from 0 up`. Artillery reads only letters, digits, `_`, `,` and spaces inside `$randomNumber(...)`.
- We do not write `{{ $env.LOAD_TESTS_TOKEN }}` by hand. The CLI gives the token to Artillery only for a scenario that uses `token()`. See [Send the token](#send-the-token).

#### Text that the engine refuses

Artillery fills a template with a text replace, and it expands a text again after the fill. So a value that holds `{{ ... }}` can read `$env` or loop for ever. A value that holds `$&`, `` $` `` or `$'` can loop or grow, because the replace reads them as patterns. A `$$` becomes one `$`, so `pa$$word` in a longer text would reach the API as `pa$word`. We call these five texts the refused text: `{{`, `$&`, `` $` ``, `$'` and `$$`. A `$1`, a `$0` and a `$<name>` pass.

The package checks the values that arrive at run time. The check reads strings, arrays, and the values and the keys of objects. It reads one value at a time. It never prints the value.

- A text in the `vars` of `before`, at any depth, fails an HTTP scenario before its load with a `RunError`. A browser scenario has no template fill, so its vars can hold the refused text. For a browser scenario, only a value that JSON cannot write (a cycle or a `BigInt`) fails the scenario before its load. The next scenario still runs. The check reads the vars as JSON, as the generated file holds them. So a result of `toJSON` counts, and a value `undefined` is skipped. A cycle in `vars` gives a `TypeError` from `JSON.stringify`. The `<path>` looks like `vars.order.note` or `vars.ids[1]`. `after` and the cleanups still run.
- A `beforeEach` result with the refused text fails the vuser. The message starts with `load-testing hook beforeEach: ` and then holds the message of `vars` below. The worker finds it, so it appears after the load starts. The worker reads the result as JSON too, so a `toJSON` result counts. A value that JSON cannot write is a hook error.
- A captured value (`captureFrom`) with the refused text fails the vuser before it sends another request. The check runs first in the `afterResponse` list of the request, before a hook of ours.
- An access token with the refused text fails the scenario with a `RunError`, before the CLI writes any file. The next scenario still runs. The message has no token in it.
- A base URL with the refused text fails the scenario with a `RunError`, before the CLI writes any file. Artillery reads the target as `{{ $env.LOAD_TESTS_BASE_URL }}`, so such a text would change the target. The message does not show the URL.

The messages read like this. The first line is for `vars`, the second for a capture, the third for the token, and the fourth for the URL. A browser scenario names `LOAD_TESTS_UI_URL` in place of `LOAD_TESTS_BASE_URL`.

```text
<path> contains text that the engine reads as a template ("{{", "$&", "$`", "$'" or "$$"). Put the value in vars without it, or leave it out.
load-testing hook capture: "{{", "$&", "$`", "$'" or "$$" in the value of <endpoint id> at <JSON path>. The engine reads it as a template. The vuser stopped before it sent another request.
The access token contains text that the engine reads as a template ("{{", "$&", "$`", "$'" or "$$"). Log in again to get another token.
The URL in LOAD_TESTS_BASE_URL contains text that the engine reads as a template ("{{", "$&", "$`", "$'" or "$$"). Use a URL without it.
```

A refused text in `vars` is rare. A name or a note that comes from an API can hold it, so we keep such a value out of `vars`.

The checks belong to the Artillery engine. A custom engine gets none of them from the package. It must refuse such text itself, if its own engine reads templates. See [Engines](#engines).

Where we see a failure of the worker.

- The `load-testing` process exits with 1, because the scenario fails.
- Artillery prints `errors.<message>  <count>` in its own summary, with two spaces and no dots for a long message. A short message gets dots between the message and the count. Artillery cuts a line at 79 columns, so a long message starts with the cause.
- The report of the package shows the line `Hooks:    <n> error(s), not app errors (FAIL)`.
- The full message is the key `errors.<message>` under `aggregate.counters` in `src/__tests__/load/.out/<slug>.report.json`. The `<slug>` is the label of the scenario, `group › name`, in lower case. Each run of other characters becomes one `-`.

```sh
jq '.aggregate.counters | with_entries(select(.key | startswith("errors.")))' \
  src/__tests__/load/.out/<slug>.report.json
```

#### Parallel requests

`load.parallel(requests, {limit?})` sends requests at the same time in one vuser. The flow goes on when all of them finish. In a hook, we use `Promise.all` instead.

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
- `limit` is the most requests that run at the same time. It must be a whole number of 1 or more.
- Each request of a group keeps its endpoint id, its limits and its row in the report.
- A request after the group can capture from a request in the group. A request in the group cannot capture from another request of the same group. The run stops with a `ScenarioError`, because the response can be missing.
- A group can sit in the `loop` of a `load.step`.

#### Group options and the merge order

`load.describe(name, options?, define)` and `load.it(name, requests, options?)` both take `headers`, `phases`, `thresholds`, `step` and `vitals`. `load.it` also takes the [hooks](#hooks), `tokenCheck` and `artillery`. `step` and `vitals` are for browser scenarios. A browser scenario takes no `headers` and no `thresholds` from `load.describe`. It uses `step` and `vitals`.

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
| `thresholds` | They merge by field. A browser scenario takes none of them. |
| `step`, `vitals` | They merge by field. See [Limits of a browser scenario](#limits-of-a-browser-scenario). |

In the example, the scenario gets the `authorization` and `X-Trace` headers. It gets its own `phases`, a `p95` of 800 and an `errorRate` of 2. The request limit `p95: 400` wins on `GET /order-items`.

### Set the load

The load is `phases`, a list of phases that run one after another. A phase uses the field names of Artillery. We set it in one of two places.

- `phases` in `config.ts` is the default of the package. Every scenario uses it.
- `phases` in the options of a scenario (or of a `load.describe`) replaces the default. The lists do not merge, so we name all the phases that we want. We use it for a flow that the app cannot take at the default rate.

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

`duration` and `pause` are seconds, or a text such as `1m`. The CLI checks the values before the load. These rules hold.

- A phase needs a `duration`, and one of two forms of load: `arrivalCount`, or `arrivalRate` with an optional `rampTo`. A pause needs a `pause` time.
- `duration`, `arrivalCount` and `pause` must be whole numbers above 0. `arrivalRate` and `rampTo` can be 0.
- A phase with `rampTo` also needs `arrivalRate`.
- A text value for `duration`, `pause` or `arrivalCount` must read as more than 0. The CLI reads it as Artillery reads a time: `"30"` and `"1m"` pass, and `"0"`, `"0m"`, `"-5"` and `"soon"` give the messages above. A text value for `arrivalRate` or `rampTo` is not read by the CLI. It only checks that the text is not empty. Artillery reads the text, and a text that it cannot read fails later.

The messages read like this.

- `phases[i] needs arrivalRate or arrivalCount`
- `phases[i] needs arrivalRate with rampTo`
- `phases[i].duration must be a whole number above 0, or a text such as "1m"`, and the same for `pause`
- `phases[i].arrivalCount must be a whole number above 0`
- `phases[i].arrivalRate must be 0 or more`, and the same for `rampTo`

The report shows every phase in its `Workload` line, for example `10 vusers/s for 60 s`. A ramp reads `ramp 1 to 5 vusers/s over 60 s`. A count reads `100 vusers over 30 s`. A pause reads `pause 10 s`. The phases join with `, then `. A phase with `maxVusers` ends with ` (at most N vusers at once)`. An example is `10 vusers/s for 60 s (at most 50 vusers at once)`. The `name` of a phase is not part of the text.

The baseline file keeps this text. A run with another workload does not compare its p95 with the old one. A change of `maxVusers` counts as a changed workload. See [Baseline](#baseline).

Every vuser of a scenario runs its steps once. A scenario that needs a longer load than the access token lives stops before the load starts. See [Log in](#log-in).

### Hooks

A scenario can have hooks. They create the data that it needs, and they remove it.

| Hook | Runs | Where |
| --- | --- | --- |
| `before(ctx, vars)` | once per run, before the load | the CLI |
| `after(ctx, vars)` | once per run, always | the CLI |
| `beforeEach({vars, vu})` | when a vuser starts | a worker of the engine |
| `afterEach({vars})` | when the flow of a vuser ends without an error | a worker of the engine |
| `beforeRequest(req, {vars})` | before each send of that request | a worker of the engine |
| `afterResponse(req, res, {vars})` | after each response of that request | a worker of the engine |

`before` and `after` run in the CLI. They use full TypeScript. They can import and call anything. `before` puts values in `vars`. `after` gets the same `vars`, also when `before` stopped half way. To run calls at the same time in a hook, we use `Promise.all`.

The hooks of `before` call the app with `ctx.api`. That client sends no token, so a call to a protected endpoint makes a client with the token first, as the example does. This needs a login. See [Log in](#log-in).

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

#### The ctx of before and after

| Member | Use |
| --- | --- |
| `ctx.token` | The access token of the login user. Undefined without a login. |
| `ctx.claims` | The claims of that token. `{}` without a login, or for a token that is not a JWT. |
| `ctx.api` | The HTTP client of the app under test (`LOAD_TESTS_BASE_URL`). It sends no token by itself. |
| `ctx.apis.<name>` | The HTTP client of another backend that `apis` in `config.ts` names. It works like `ctx.api`. See [Other backends](#other-backends). |
| `ctx.sql(db, text, params?)` | One SQL statement on a datasource of `config.ts`. |
| `ctx.defer(cleanup)` | Registers a cleanup for something that the hook made. |

`ctx.api` adds the base URL to each path. It sends no `Authorization` header and no other default header. For a call that needs the token, we make a client that has it with `ctx.api.with`.

#### Other backends

A hook sometimes needs a backend that is not the app under test, for example the auth service. We name each one in `apis` of `config.ts`. The value is the name of the environment variable that holds its URL.

```ts
// config.ts
const config: LoadTestConfig = {
  phases: [{duration: 10, arrivalRate: 1}],
  apis: {
    auth: 'LOAD_TESTS_AUTH_SERVICE_URL',
    core: 'CORE_SERVICE_URL',
  },
};

// a scenario file
before: async (ctx, vars) => {
  const {code} = await ctx.apis.auth.post<{code: string}>('/auth/login', {...});
  const customer = await ctx.api.post('/customers', {...});
  vars.code = code;
},
```

- `ctx.apis.<name>` is a client like `ctx.api`. It has the same methods, `.with`, errors, redirects and the timeout of 60 s. It sends no token. It adds its own base URL to each path.
- TypeScript does not know the names, because a scenario file does not import `config.ts`. A name that `apis` does not have throws a `ConfigError` when the hook reads it, for example `No API 'auht' in config.ts apis. Known: auth, core`.
- A run that needs the API stops before the first scenario when a variable of `apis` is not set, or is not an http or https URL. The message names the variable.
- These clients work in `before`, `after` and the cleanups. A worker hook, and the load itself, still go only to `LOAD_TESTS_BASE_URL`.
- A browser scenario with `before` or `after` still needs `LOAD_TESTS_BASE_URL`, also when its hooks use only `ctx.apis`.

A path must start with `/`. Otherwise the call throws a `RunError` that reads `<METHOD> <path>: the path must start with "/"`, and it sends nothing. A path such as `@host/x` would change the host and send the token there. A path such as `//host/x` starts with `/`, so it goes to the base host as a path.

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
- A `query` value goes through `String()`, never through JSON. The client skips a value of `undefined`. It adds `query` to a query that the path already has.
- `timeoutMs` is 60 s by default. The requests of the login have the same limit.
- The client sends the body of a request in this order. `undefined` sends no body and no content type. A `FormData`, `URLSearchParams`, `Blob`, `ArrayBuffer`, typed array or string goes as it is, and the client sets no content type. Anything else goes as JSON with `content-type: application/json`, unless we set a content type.
- A response with no body gives `undefined`. We ask for `<void>` in the type.
- A 2xx body that is not JSON throws a `RunError`. We use `raw()` for it.
- Any status that is not 2xx throws an `HttpError`, also from `raw()`.
- A network failure throws a `RunError` with the text `<METHOD> <path> failed: <cause>`. A call that takes longer than its timeout throws a `RunError` with `<METHOD> <path> timed out after <N> s`. This holds also when the body stalls while the client reads it.
- `ctx.api` follows redirects. The login does not. See [The flow](#the-flow).
- The package exports `ApiClient`. `new ApiClient(baseUrl, options)` makes a client for our own code. `options` can hold `token`, `headers`, `timeoutMs` and `signal`. `token` adds the bearer header. The type of `signal` is `() => AbortSignal | undefined`. The client adds `baseUrl` to the path as it is, so `new ApiClient('http://h/')` makes the URL `http://h//orders`. The CLI removes a slash at the end of its base URL, and this class does not.

#### Cleanups with ctx.defer

`ctx.defer(cleanup)` registers a cleanup for the data that a hook made. We call it right after the create, as the example above does.

- At the end of the run, the CLI calls the cleanups, the last one first. So a row goes before the rows that it depends on.
- This happens after `after`. It also happens when `before` stopped half way, when the load failed, and when a signal came.
- A cleanup can use `ctx.api`. It works after a signal too.
- A cleanup that throws does not stop the others, and the run fails. When the scenario ran to the end, the report shows each failure as a `FAIL: cleanup failed:` line. When `before` or the load failed, the CLI prints `<scenario>: cleanup failed: <message>` on stderr instead.
- A cleanup must accept that its row is gone already.
- Vusers run in workers, so they cannot register a cleanup. We give the rows of the vusers a name tag, and remove them in `after`.

Why not only `after`? `after` runs once, and it does not know how far `before` got. Say that `before` creates a customer and an order, and the order create fails. Then `after` must check each id to see what exists. A new create needs one more check in `after`, and a missed check leaves rows behind. With `ctx.defer`, the function that creates the data also registers its cleanup, right after the create works. So the list holds only what exists. A cleanup can even go before the create. That is safe when the cleanup runs with nothing to remove, because it finds the rows by the name of the run. It also covers a create that committed, but whose reply we lost.

We still use `after` for rows that no hook created, such as the rows that the vusers made. It runs before the deferred cleanups, so these rows go before the rows that they point to. One rule needs care. We register first the cleanup that must run last.

#### Worker hooks

The workers do not load our scenario file, with one exception. For a browser scenario, the processor loads the built flow file. The engine copies the source of `beforeEach`, `afterEach`, `beforeRequest` and `afterResponse` into a file for the workers (`.out/<slug>.processor.cjs`). So these rules hold.

- A worker hook can use only its arguments and JavaScript globals, such as `URL`, `Buffer`, `crypto`, `process` and `setTimeout`. It cannot use an `import` or a variable of its module.
- A worker hook must be synchronous. A worker does not wait for a promise. An `async` hook would run its work after the vuser went on, and nobody would see a rejection. The CLI fails the scenario before its load when one of the four hooks returns a promise. The next scenario still runs.
- `beforeEach` must give the same result for the same arguments, and it must have no side effects. It must return an object, the vars of the vuser.
- Before the load, the CLI runs each hook once, with made-up arguments, from the generated file. A hook that uses a name from outside fails at once, with a `ReferenceError` in the message. For `beforeRequest`, `afterResponse` and `afterEach`, only a `ReferenceError` fails the scenario, because the made-up arguments can cause other errors. A side effect of a hook runs once there. This test runs in the CLI process, so it sees all environment variables. A worker sees only the list that the next rule names.
- The file writes `vars` (what `before` sets) in plain text. We never put a secret or the token in `vars`. `token()` is safe. The CLI passes the token to Artillery in the environment and does not write it to disk. It does so only for a scenario that uses `token()`.
- A worker hook runs inside Artillery. So `process.env` there holds only the allowed names, plus `LOAD_TESTS_BASE_URL`, and `LOAD_TESTS_TOKEN` when the scenario sends `token()`. A browser flow gets `LOAD_TESTS_UI_URL` and not `LOAD_TESTS_BASE_URL`. See [The environment of Artillery](#the-environment-of-artillery).
- A `beforeEach` result with the refused text fails the vuser. See [Text that the engine refuses](#text-that-the-engine-refuses).
- `afterEach` does not run for a vuser whose flow stopped with an error.
- An error in a worker hook stops that vuser. The report counts these errors apart from app errors, in the `Hooks:` line, and the scenario fails.

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

`vu` counts the vusers that this worker started, from 0. Every worker counts from 0, so it is not unique in the run.

#### Ctrl-C and signals

On SIGINT (Ctrl-C), SIGTERM or SIGHUP the CLI does these steps.

1. Stop the `ctx.api` calls of `before`.
2. Stop Artillery, and wait until it has exited. It gets SIGKILL after 10 seconds. The wait makes sure that no late request of the load creates a row after the cleanup removes it.
3. Run `after` and the cleanups.
4. Run the reporters, with `stopped: true`. The console reporter prints no coverage or heavy API lines then.
5. Exit with 128 plus the signal number: 130 for SIGINT (Ctrl-C), 143 for SIGTERM and 129 for SIGHUP.

A second signal ends the process at once, with the exit code of the first. A second signal that comes less than 500 ms after the first is ignored, because npm can forward one Ctrl-C twice. A stopped run saves no baseline.

Ctrl-C also works during the login (step 6 of [How a run works](#how-a-run-works)) and the token refresh (step 8.1). The CLI prints `Cancelled.` and exits with the code of step 5 above (130, 143 or 129) at once. It does not wait for a request that is still open.

The CLI ignores write errors on the terminal, but only `EPIPE`, `EIO` and `ERR_STREAM_DESTROYED`. After SIGHUP the terminal can be gone, and a failed write cannot stop the cleanups. Any other write error, such as a full disk, is thrown.

When the CLI process exits for any reason, it kills every running Artillery process with SIGKILL. Examples are a second signal, `process.exit` and an uncaught error. A SIGKILL of the CLI itself cannot be caught, so the Artillery processes can survive that case.

### Test data

The scenarios make and delete data in the app under test. A good scenario leaves nothing behind, and it never depends on rows that someone made by hand.

#### Create and remove data

There are two ways to create data.

- Through the API, with `ctx.api` in `before`. This goes through the same code as a real client, so it makes audit rows, events and cache entries.
- With SQL, with `ctx.sql` in `before`. This goes around the app. It makes no audit rows or events, and it does not clear a cache that the app keeps. We use it for data that no endpoint can create, or to find rows by name in `after`.

We always register a cleanup with `ctx.defer` right after a create. See [Hooks](#hooks). A vuser can also create and delete its own data as steps of the flow. The first request creates a row, `captureFrom` takes its id, and the last request deletes it. Then no two vusers share a row.

This scenario needs data of its own for each run. The `before` hook makes the customer and the products, and `ctx.defer` removes them.

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

#### Give each vuser a unique value

We put a random part in a string with `template`. The engine makes a new value for each vuser, in every worker. We share nothing.

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

- With 1,000 vusers and the default length, the chance that two vusers get the same `randomString` is 2 in a billion. A part of a UUID is worse. Eight hex characters give 1 chance in 8,600. `uuid()` is unique, but it has 36 characters. A column with a size limit can need a shorter value. We use `randomString` there.
- `randomNumber` can give the same number to two vusers. We do not use it where each vuser needs a unique value.
- `uuid()` is the same in all requests of one vuser, so it also links them.
- Artillery has no unique index of a vuser. It does not split a CSV `payload` between the workers. In local mode, each worker gets the whole payload and starts at the first row. So we do not use a CSV to give each vuser its own row.
- `vu` in `beforeEach` is not unique in the run either.
- The Artillery engine renders these values as `{{ $randomString(8) }}`, `{{ $randomNumber(1, 9) }}` and `{{ $uuid }}`. If Artillery changes them, we change the engine only.

### Datasources

A datasource is a named database connection. We declare datasources in `config.ts`. The first argument of `ctx.sql` is one of the names. A facade can reach several services, and each service has its own database. So we declare one datasource for each database that a scenario touches, for example `orders`, `inventory`, `audit`, `suppliers`, `billing` and `users`.

A datasource has one of three forms.

- `{type: 'postgres', url, ...}` is Postgres. The package has the adapter, and the project installs the driver.
- `{type: 'custom', connector}` is any other database, with a connector that we write.
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

- The package reads no database variable. Our `config.ts` reads the environment, and we choose the name of the variable.
- `type: 'postgres'` needs the `pg` package in our project, with `npm install --save-dev pg`. The package loads `pg` from our project folder, never from its own, at the first `ctx.sql` call of the datasource. When `pg` is missing, the call fails with a `ConfigError`.
- The calls to one datasource share one connection and run one after another, also inside `Promise.all`. Calls to different datasources run at the same time.
- A Postgres datasource takes `url`, or `host`, `port`, `user` and `password`. It also takes `database`, `ssl`, `connectionTimeoutMs`, `statementTimeoutMs` and `applicationName`.
- We read the URL from an environment variable, never from a literal in `config.ts`. We keep the certificate checks of `ssl` on. We turn them off only for a local database.
- With `url`, `database` replaces the path of the URL. So one server URL serves many datasources. With `url`, the options `host`, `port`, `user` and `password` are ignored, with no message.
- `connectionTimeoutMs` is 10,000 ms by default, so a database that does not answer cannot hold the run for ever.
- `statementTimeoutMs` is a whole number of milliseconds from 0. Another value in a datasource is a `ConfigError` with the message `datasources.<name>.statementTimeoutMs must be a whole number of milliseconds from 0 (0 turns the limit off)`. `connectionTimeoutMs` follows the same rule.
  - By default the client waits at most 60 s for a statement (`query_timeout`). The server gets no `statement_timeout`, so it keeps running a statement after the client gave up. The CLI then drops that connection. The next `ctx.sql` call opens a new one.
  - A value above 0 sets both limits. It sends `statement_timeout` to the server as a startup parameter. A proxy such as PgBouncer can refuse that parameter.
  - Behind such a proxy we leave the option unset (client limit only), or we set `0` (no limit at all).
- With neither `url` nor `host`, the first call fails with a `ConfigError` that says what to set. A run whose scenarios use no SQL needs no URL.
- A name that `config.ts` does not declare gives a `ConfigError` that lists the declared names.
- The package opens one connection for each datasource, at the first call, and keeps it. It drops a connection that breaks, and the next call opens a new one. The connections close after the cleanups of each scenario.
- `params` fill `$1`, `$2` and so on in the text. A call with several statements and no `params` gives the rows of the last one.
- A connector has one method, `connect(onError)`. It opens one connection and returns `{query, end}`. It calls `onError` when an idle connection breaks, so that the package can open a new one. It opens nothing when we create the connector.

### Log in

The login is optional. The CLI logs in only when `LOAD_TESTS_USERNAME` is set. Then it also needs the password, the client id and the client secret. `LOAD_TESTS_BASE_URL` is required with a login, also in a run of only browser scenarios. The [Environment](#environment) table lists all six variables.

#### The flow

The login follows the two-step login of the ARC authentication service (`@sourceloop/authentication-service`).

1. `POST /auth/login` with `username`, `password`, `client_id` and `client_secret`. The answer holds a `code`.
2. `POST /auth/token` with the `code` and the `clientId`. The answer holds an `accessToken` and a `refreshToken`. Both must be non-empty texts. If not, the CLI throws a `LoginError`: `<call> gave no accessToken` or `<call> gave no refreshToken`.
3. Before each scenario, the CLI gets a new token with `POST /auth/token-refresh`. It sends the `refreshToken`, and the old access token as a bearer token. It skips the refresh when the access token is less than a minute old. The auth service revokes the access token that a refresh replaces. The signed payload has no random part (`jti`), so two refreshes in the same second give the same token string. The second refresh then revokes the token that it just gave. We refresh at most once a minute to avoid this. The age comes from the `iat` claim. A token that has no `iat`, such as an opaque token, counts from the time that the CLI got it.

All three calls go to `LOAD_TESTS_AUTH_SERVICE_URL`, or to the base URL when that variable is not set. A call that answers with a status other than 2xx throws a `LoginError` with the status and the first 200 characters of the body.

The login and the refresh do not follow redirects. A 307 or a 308 would send the password and the client secret again to the new host. A status from 300 to 399 stops with a `LoginError`. It names the status and the origin of the `location` header, when the header parses. It never shows the whole location. The message reads `POST <url> gave <status>, a redirect to <origin>. The login does not follow redirects, so the password goes only to the URL that we set. Set LOAD_TESTS_AUTH_SERVICE_URL to the final URL.` We set `LOAD_TESTS_AUTH_SERVICE_URL` to the final URL.

We use https for an auth URL that is not on this machine. The package does not enforce it, because it accepts http for any host.

A network failure names the URL and the cause. These are the messages.

- `POST <url> failed: <cause>`, for example with the cause `connect ECONNREFUSED 127.0.0.1:4010`. The cause is never empty. When `fetch` gives several errors, the text joins their messages with `; `.
- `POST <url> timed out after 60 s`. This holds also when the body stalls.
- `POST <url> gave <status> with a body that is not JSON`, for a 2xx answer whose body is not JSON.
- `POST <url> gave <status> with a body that is not a JSON object`, for a 2xx answer whose body is JSON but not an object (`null`, a list, a number or a text).

Ctrl-C stops a login or a refresh at once. See [Ctrl-C and signals](#ctrl-c-and-signals).

#### Send the token

The package does not add an `Authorization` header. A request asks for the token with `token()`. We set the header once, on the `load.describe` or on the `load.it`.

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

- Without a login, `ctx.token` is undefined and `ctx.claims` is `{}`. When a scenario that runs sends `token()`, the whole run stops with a `ConfigError` before any scenario or hook runs. The message names these scenarios.
- With a login, the engine sends one token for the whole load of a scenario. `after` and the cleanups use the same token as `ctx.token`.
- The CLI gives the token to Artillery only for a scenario that uses `token()`. Another scenario gets no token variable. `ctx.token` and `ctx.claims` in `before` and `after` do not change.
- `ctx.api` does not send the token. See [Hooks](#hooks).

#### The token check

The token check runs for a scenario that sends `token()`, when there is a login. It runs after `before` and before the load.

The default check stops the scenario when the load time plus 120 seconds is at least the time that the token has left. The 120 seconds are for the last requests of Artillery, `after` and the cleanups. The check reads the `exp` claim of the token. A token without `exp` passes.

The check also stops the scenario with a `RunError` when it cannot read the time of a phase. We write a time as a number of seconds, or as a text such as `20m`.

The token life comes from the login client of the auth service. A short life limits the length of a load.

`tokenCheck` replaces the default check. So a custom check must test the expiry itself, as the example does. We set it in `config.ts` for the package, or in the options of a `load.it`. The innermost wins. It gets `{token, claims, phases}`. It throws an error, or rejects when it is `async`, to stop the scenario before its load. The run waits for an `async` check. The report shows the message as a `FAIL:` line. `after` and the cleanups still run, and the next scenario starts.

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

#### Login errors and the rate limit

- A 401 from `/auth/login` means that the username, the password, the client id or the client secret is wrong. The message reads `POST <url>/auth/login gave 401: ...`.
- A 429 means that something in front of the auth route limits the rate of calls. The package does not retry. The first login happens once, at the start of the run. A 429 there stops the run with a `LoginError`. A 429 on a refresh fails that scenario, and the next scenario tries its own refresh. When it happens, we wait, or we raise the limit for the test environment.

#### The test user

The login needs a user that exists in each environment. This checklist tells what that user must be. We do not give SQL, because each project creates users in its own way.

- [ ] The user is only for load tests. It is never a real person, and nobody else uses it. A name such as `load-test@example.com` shows its purpose.
- [ ] The user has the smallest role that can call every endpoint under test. A load test needs no more power than that.
- [ ] A client exists for the login, with a client id (for example `load-test-client`) and a client secret. That client lets the user log in.
- [ ] The password and the client secret live only in environment variables or in CI secrets. They are never in git, in `config.ts` or in a script.
- [ ] Create the user with the user API or the seed script of the project. Then the project hashes the password in the way that it expects.
- [ ] Each environment has its own user, with its own password. We do not share one user over development, test and production-like systems.

### Browser scenarios

A browser scenario load tests the screens of a web app. Each vuser opens the app in Chromium and runs our flow. The package times the steps of the flow, reads the Web Vitals of each page, and judges them with the targets of the SourceFuse Developer Performance Standard. It uses the Playwright engine that comes with Artillery, so the project installs no other load tool.

The API calls of the page get no gate here. A `load.it` scenario gates them. A slow API still shows up, in the step that waits for its data.

#### Set up a web app

A web app keeps its load tests where an API keeps them, in `src/__tests__/load/`, next to a `config.ts`. The CLI loads the built files from `dist/`. Angular, Vite and webpack bundle the app and do not write `dist/__tests__`. So the load files get their own `tsc` build.

```text
my-web-app/
├── src/__tests__/load/
│   ├── config.ts          phases and limits of the project
│   ├── orders.load.ts     load.browser(...) calls
│   └── .out/              scripts, reports and baseline.json, not in git
└── tsconfig.load.json     builds src/__tests__/load into dist/__tests__/load
```

```jsonc
// tsconfig.load.json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "target": "es2022",
    "lib": ["es2022", "dom"],
    "types": ["node"],
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "skipLibCheck": true,
  },
  "include": ["src/__tests__/load/**/*.ts"],
}
```

```json
{
  "scripts": {
    "pretest:load": "tsc -p tsconfig.load.json",
    "test:load": "load-testing run ."
  }
}
```

- The build and the type check of the app must leave the load files out, for example with `exclude` in the tsconfig of the app.
- `nodenext` follows `"type"` in `package.json`. A package with `"type": "module"` builds ESM. The CLI loads it with `require()`, which works for ESM without a top-level `await`. We checked this config with TypeScript 5.9.3 and 7.0.2, with and without `"type": "module"`. TypeScript 7 removed `"moduleResolution": "node"`, so we do not use it.
- Git ignores `dist/` and `src/__tests__/load/.out/`.
- `npm install` downloads Chromium for Artillery. See [Install](#install) for the cases where it does not.
- `LOAD_TESTS_UI_URL` is the origin of the web app, for example `http://localhost:4200`. A run of only browser scenarios with no `before` and no `after` needs neither `LOAD_TESTS_BASE_URL` nor `src/openapi.json`. A browser scenario with `before` or `after` needs `LOAD_TESTS_BASE_URL`, because `ctx.api` of its hooks calls the API. A hook that logs in to another service uses `ctx.apis.<name>`. See [Other backends](#other-backends).
- We load a production build of the app. A dev server sends code that is not minified, so its numbers do not match production.

#### Write a browser scenario

`load.browser(name, options?, flow)` registers a browser scenario. It has `.only` and `.skip`, and it goes into a `load.describe` as `load.it` does. The flow gets the `page` of the vuser, a `step` function and `vars`. A relative URL in `page.goto` starts at `LOAD_TESTS_UI_URL`.

```ts
import {load, UI_TARGETS} from '@sourceloop/load-testing';

load.describe('orders', () => {
  load.browser(
    'save an order',
    {steps: {save: {p95: UI_TARGETS.feedback}}},
    async ({page, step}) => {
      await step('open', () => page.goto('/orders'), {
        endWhenVisible: 'button.save',
      });
      await step('save', () => page.click('button.save'), {
        endWhenVisible: '.toast',
      });
      await step('print', () => page.click('button.print'));
    },
  );
});
```

The first 2 steps end when their end element shows. The `print` step shows nothing that we can wait for. So it takes the time of its whole action, and the report marks it. `save` gets 1 s, and the other steps get the default of 1.5 s. See [The block of a browser scenario](#the-block-of-a-browser-scenario) for the output of this scenario.

A project can start small and add exact times later.

| Level | The flow | What the run gates |
| --- | --- | --- |
| 1. No steps | calls page objects, with no `step` | the Web Vitals, and the flow total when `flow` sets a limit |
| 2. Steps | `step(name, action)` | also each step, with the time of its whole action |
| 3. Steps with an end element | `step(name, action, {endWhenVisible})` | also each step, with an exact time |

At level 1, a page that paints fast but loads its data late can pass, because the Web Vitals do not wait for the data. So we give each screen one step with `endWhenVisible`, or we set a `flow` limit.

#### End a step at an element

`step(name, action, options)` records the time of the action as `browser.step.<name>`. With `endWhenVisible`, the step does these things, in this order.

1. It checks that the end element is not visible. If it is, the vuser fails with `'<selector>' is visible before the action`, because the step would end at once. We then pick an element that only the action shows.
2. It takes the start time, and starts a check that runs in the page on each animation frame.
3. It runs the action. The action can be a page object that ends with `expect`.
4. It waits for the check. The step time is the page time of the first frame where the element is visible, minus the start time.

So the waits of an `expect` in the action do not count. In one spike, on one machine, a step saw an element that showed at once 6 ms late, and an element on a new page 110 ms late. At 300 vusers, the step p95 was 433 ms with `endWhenVisible` and 889 ms with Playwright `expect`. The frame lag p95 was 16 ms or less. These are single measurements, not a promise. An element is visible by a rule close to the one of Playwright. Its box has a width and a height, and its `visibility` style is `visible`.

A step without `endWhenVisible` takes the time of the whole action, also the waits of its assertions. The counter `browser.step_wall_clock.<name>` marks it, and the report shows it as `(wall clock)`.

- `endWhenVisible` takes a CSS selector. A Playwright locator such as `getByRole` cannot run in the page. The check uses `document.querySelector`. It takes the first match only. It does not look into shadow DOM, and it does not look into iframes. Playwright locators look into open shadow roots.
- The check differs from the rule of Playwright in one case. Playwright treats `display: contents` as visible when a child is visible, and it calls `element.checkVisibility()`. Our check says "not visible" for an element with `display: contents`.
- When the action loads a new page, Playwright 1.62.1 starts the check again in that page after 100 ms. So the step can end up to about 100 ms late. A route change in a single-page app loads no new page.
- An end element that never shows fails the vuser after 30 s, the default timeout of the engine in Artillery 2.0.34. The message is `'<selector>' is not visible after the action of step <name>: <first line of the Playwright error>`, for example `'.row' is not visible after the action of step open: page.waitForFunction: Timeout 30000ms exceeded.`
- A strict Content Security Policy does not block the check. Playwright compiles the check through the DevTools protocol, which the policy does not cover.
- A failed step stops its vuser. The scenario fails when the share of failed vusers is above the `errorRate` of `thresholds.default`.

#### Limits of a browser scenario

The p95 of each step and of each Web Vital has a limit. The defaults come from the standard. A metric passes when its p95 is at or below its limit.

| Metric | Name in the report | Default p95 limit |
| --- | --- | --- |
| Step | `browser.step.<name>` | 1500 ms, `UI_TARGETS.criticalAction` |
| FCP | `browser.page.FCP.<label>` | 1800 ms |
| LCP | `browser.page.LCP.<label>` | 2500 ms |
| CLS | `browser.page.CLS.<label>` | 0.1, with no unit |
| TTFB | `browser.page.TTFB.<label>` | 800 ms |
| INP | `browser.page.INP.<label>` | 200 ms, only when a level names `INP` |
| Flow total | `browser.flow.<label>` | none, unless the scenario sets `flow` |

`<label>` is the name of the scenario with its groups and its browser, for example `orders › save an order › chromium`. `UI_TARGETS` holds the step targets of the standard: `criticalAction` (1500 ms), `standardPage` (2500 ms), `dataHeavyScreen` (5000 ms), `feedback` (1000 ms) and `routeChange` (1000 ms). `WEB_VITALS_TARGETS` holds the Web Vitals limits of the table.

Limits merge by field, from the library up to one metric, as the thresholds of `load.it` do.

| Level | Where | Keys |
| --- | --- | --- |
| 1. Library | built in | the table above |
| 2. Project | `thresholds` in `config.ts` | `step`, `vitals` |
| 3. Group | `load.describe` options | `step`, `vitals` |
| 4. Scenario | `load.browser` options | `step`, `vitals` |
| 5. One metric | `load.browser` options | `steps['<name>']`, `flow` |

The options of `load.browser` are only `phases`, `step`, `vitals`, `steps`, `flow`, `before` and `after`. Another key in a plain JavaScript file throws a `TypeError` at load time. `before` and `after` have the types and the rules of [Hooks](#hooks): they run once per run, in the CLI, and `after` runs also when `before` or the load failed. A browser scenario has no `beforeEach`, `afterEach`, `beforeRequest` or `afterResponse`, no `tokenCheck` and no `artillery` option. The `TypeError` names the key. A `load.describe` has no `before` or `after`.

Each key takes `p95`, `p95Regression` and `minDelta`, as a threshold does. `vitals` takes one entry for each Web Vital. An entry for `INP`, also an empty one, turns INP on. `steps` and `flow` start from the merged `step` limits. `thresholds.default` (`p95Regression`, `minDelta`) does not change the limits of browser metrics. They use `thresholds.step` and `thresholds.vitals`. An unknown Web Vital name, and `errorRate` in a step or Web Vital limit, are config errors. A limit that is not an object is a config error too. Examples are `step: 5` and `vitals: {LCP: 3000}`.

```ts
import {load, UI_TARGETS, WEB_VITALS_TARGETS} from '@sourceloop/load-testing';

load.describe('dashboard', {step: {p95: UI_TARGETS.standardPage}}, () => {
  load.browser(
    'open the dashboard',
    {
      steps: {load: {p95: UI_TARGETS.dataHeavyScreen}},
      vitals: {INP: {p95: WEB_VITALS_TARGETS.INP}},
      flow: {p95: 8000},
    },
    async ({page, step}) => {
      await step('load', () => page.goto('/dashboard'), {
        endWhenVisible: '.grid .row',
      });
      await step('filter', () => page.click('button.filter'), {
        endWhenVisible: '.filter-panel',
      });
    },
  );
});
```

Here `load` gets 5 s, `filter` gets the 2.5 s of the group, and the flow gets 8 s. The click in `filter` is on the last page of the flow, so it gives INP a value. A limit above its target is a deviation from the standard. As for an endpoint, the test gives the reason next to the limit, and the review approves it.

The run checks these rules on top of the limits.

- A metric that a limit names, or that the defaults expect, fails with `no samples` when the report has none. So a step name with a typo fails.
- A metric with a limit fails with `lost samples` when it has fewer samples than completed vusers. So every vuser must run every step, and its first page must report its Web Vitals.
- Regression works as for an endpoint. For CLS, `minDelta` is 0.1 by default.

#### Web Vitals

Artillery adds the `web-vitals` script to each page that a flow opens. It records a value only for a URL under `LOAD_TESTS_UI_URL`, and it names the metric after the scenario. So two scenarios that open the same page keep their own numbers.

- The script reports LCP after a click or a key press, or when the page closes. It reports CLS and INP when the page closes. The engine closes only the first page of the vuser, after the flow.
- A page that the flow opens with `context.newPage()`, and a popup, never report Web Vitals, also when the flow closes them. The engine attaches its console handler only to the first page, and the Web Vitals reach the report only through that handler.
- FCP and TTFB come from the first page of the flow, also after a full page load in it, and they go into one metric. A page from `context.newPage()` and a popup add nothing.
- A full page load inside a flow loses the LCP, CLS and INP of the page that it leaves. Those numbers then come from the last page only.
- INP needs a click or a key press on the last page of the flow. The engine reports INP when that page closes. A flow without such an interaction has no INP, so INP is off until a level turns it on.
- A route change in a single-page app gives no new FCP or LCP. We time it with a step that ends at an element of the new screen.
- Artillery rounds each p95 to 1 decimal. So the CLS p95 is 0, 0.1, 0.2 and so on. That is why the default `minDelta` of CLS is 0.1. A change from 0 to 0.1 is the smallest change that the report can show, and it is not a regression. Artillery 2.0.34 also makes its summaries from a DDSketch with a relative accuracy of 0.01. So every p95 has an error of about 1%. The table shows the limits and the baselines of CLS with up to 2 decimals.
- The TTFB of a single-page app measures the server of `index.html`, for example a proxy or a CDN.
- The standard gives no percentile for Web Vitals. We gate the p95 against the "good" limit of Google, which is the same number as the standard. This is stricter than the p75 rule of Google.

#### Browsers

A browser scenario runs once for each browser in `artillery.browsers` of `config.ts`. The default is `[chromium()]`. The label of each run ends with the browser, for example `orders › save an order › chromium`. So each browser has its own files, report rows and baseline history. A browser that is added later does not reset the history of the others.

`chromium()` runs the Playwright engine of Artillery. It takes two options. `launchOptions` are the Playwright `launchOptions`, for example `{channel: 'chrome'}` or `{channel: 'msedge'}` to run Chrome or Edge. `startTimeoutMs` is how long the check lets Chromium take to start. The default is 60 s. The `launchOptions` of `engines.playwright` in `artillery.config` work too. When `chromium({launchOptions})` is set, its `launchOptions` replace the whole object of `artillery.config`. They do not merge.

The Playwright engine of Artillery starts only Chromium (`chromium.launch`, Artillery issue 1885). To run Firefox, WebKit or another browser, we write an Artillery engine for it and list a `BrowserEngine` object. The engine is a package that is named `artillery-engine-<name>`. A copy of the Playwright engine of Artillery, with `chromium` changed to `firefox`, is enough to start. NODE_PATH or `npm install` must let Artillery find it.

```ts
import {chromium, type BrowserEngine} from '@sourceloop/load-testing';

const firefox: BrowserEngine = {
  name: 'firefox', // the end of the label: `... › firefox`
  engine: 'playwright-firefox', // runs as artillery-engine-playwright-firefox
  vitals: ['FCP'], // list only what the browser reports for each user
};

const config: LoadTestConfig = {
  phases: [{duration: 10, arrivalRate: 1}],
  artillery: {browsers: [chromium(), firefox]},
};
```

| Field | Use |
| --- | --- |
| `name` | The name of the browser. It ends the label of each run. It must be unique. |
| `engine` | The name of the Artillery engine that runs it, for example `playwright`. |
| `engineOptions` | Options for that engine. They go over `engines.<engine>` of `artillery.config`. They cannot hold `aggregateByName`. |
| `vitals` | The Web Vitals that the browser reports. A Web Vital that is not in the list has no limit and no row. Without this, a missing CLS would fail with `no samples`. |
| `check` | Optional. It runs before each scenario of the browser, and it throws a `ConfigError` when the browser cannot start. |

The engine must follow the contract of the Playwright engine of Artillery:

- It runs the `testFunction` of the script with `(page, context, events)`.
- It reads `aggregateByName`, which the library sets to `true`, so that the Web Vital metrics carry the label of the scenario.
- It emits `browser.page.<vital>.<label>` for each Web Vital in `vitals`.

Firefox and Safari report fewer Web Vitals than Chromium. CLS needs the Layout Instability API, which only Chromium has. In a smoke run with Playwright 1.63.0 and Firefox 155.0, the Playwright engine gave an FCP sample for each user, but no LCP, and a TTFB sample for only one of two users. A Web Vital that is in `vitals` and has fewer samples than users fails the run. So list only the Web Vitals that the browser reports for each user, and check them with a short run first.

#### Page objects of Playwright tests

A project with Playwright tests can call its page objects in a flow. Artillery runs one function for each vuser. It does not run the `test()` blocks or the fixtures of a spec file. So a load file imports the page objects, and not the specs.

- A page object that a load file imports must be under `src/`. The load build has `rootDir: src`, and an import from outside `src/` stops it.
- The `page` of a flow comes from the Playwright of Artillery, 1.62.1 today. A page object that imports `expect` from the project's own Playwright works with it. We tested this with Playwright 1.63.0.
- A page object that ends with `expect` gets an exact step time with `endWhenVisible`. The step ends at the frame of its element, and not when the `expect` returns.
- `expect` of `@playwright/test` outside its test runner waits 5000 ms by default, and not the 30 s of the engine. A page object that waits longer uses `const slowExpect = expect.configure({timeout: 30_000})` and calls `slowExpect(...)`.

#### Log in, and variables of a flow

A browser scenario has no login helper, and `token()` does not reach the page. To log in once for the whole run, we use `before` and `after`. They run once, in the CLI. `ctx.api` of these hooks calls `LOAD_TESTS_BASE_URL`, and the load goes to `LOAD_TESTS_UI_URL`. So a scenario with `before` or `after` needs both. A login on a service of its own goes through `ctx.apis.<name>`. See [Other backends](#other-backends).

The flow gets `vars`: a fresh copy for each vuser of what `before` set. Only JSON values pass, as for the vars of `load.it`. `before` logs in and puts the token in `vars`. The flow puts it in the page with `page.addInitScript`. `after` logs out. All vusers share this token, so it must stay valid for the whole run.

```ts
import {load} from '@sourceloop/load-testing';

load.browser(
  'open the dashboard',
  {
    before: async (ctx, vars) => {
      const res = await ctx.api.post<{token: string}>('/ui/login', {
        username: 'ui-user',
        password: process.env.UI_TEST_PASSWORD,
      });
      vars.uiToken = res.token;
    },
    after: async (ctx, vars) => {
      await ctx.api
        .with({headers: {authorization: `Bearer ${vars.uiToken}`}})
        .post('/ui/logout');
    },
  },
  async ({page, step, vars}) => {
    const token = String(vars.uiToken);
    await page.addInitScript((value: string) => {
      window.localStorage.setItem('token', value);
    }, token);
    await step('open', () => page.goto('/dashboard'), {
      endWhenVisible: '.grid .row',
    });
  },
);
```

The paths and the body of the login calls are an example. We use the login of our app. The pattern is a login in `before` that every vuser reuses, as in the [reuse-auth example of Artillery](https://github.com/artilleryio/artillery/tree/main/examples/browser-playwright-reuse-authentication), which reuses the session with `storageState`.

The other way is a login in the flow, for each vuser, for example with the page object of the login screen. Then the scenario needs no hooks and no `LOAD_TESTS_BASE_URL`. The flow runs inside Artillery, which gets only a short list of variables. See [The environment of Artillery](#the-environment-of-artillery). To give the flow a variable, for example the password of a test user, we list its name in `artillery.env` of `config.ts`. A name that starts with `LOAD_TESTS_` is not allowed there.

```ts
import type {LoadTestConfig} from '@sourceloop/load-testing';

const config: LoadTestConfig = {
  phases: [{duration: 60, arrivalRate: 1}],
  artillery: {env: ['UI_TEST_USER', 'UI_TEST_PASSWORD']},
};

export default config;
```
### Thresholds and the verdict

Thresholds are optional. We set them in `thresholds.default` of `config.ts`, in the options of a `load.describe` or a `load.it`, or in the options of one request. An example is `load.get('/orders', {p95: 800})`.

The order is the request, then `load.it`, then `load.describe`, then `thresholds.default` of `config.ts`, then the library default. Layers merge by field. A field that no layer sets takes the library default from the table. The package still checks each value that we give.

| Name | Unit | Default | An endpoint fails when |
| --- | --- | --- | --- |
| `errorRate` | percent | 1 | more than this percent of its requests get a network error or a 4xx or 5xx status |
| `p95` | milliseconds | 500 | its p95 is above this value. It needs no baseline, so the limit holds on the first run too |
| `p95Regression` | percent | 20 | its p95 is more than this percent above the baseline, and also more than `minDelta` above it |
| `minDelta` | milliseconds | 10 | its p95 is more than this many milliseconds above the baseline, and also above `p95Regression` |

The names have no unit. The table gives it. `errorRate` must be from 0 to 100. The other values must be 0 or more.

#### Targets for the p95 limit

`P95_TARGETS` holds common p95 targets for HTTP APIs, in milliseconds. We use one as the `p95` of an endpoint, so that a reader sees which kind of API the limit is for.

| Key | Value | Kind of API |
| --- | --- | --- |
| `userBlockingApi` | 500 | User-blocking APIs, which a user waits for. The target is 300 to 500 ms where practical. This is the default limit. |
| `supportingApi` | 1000 | Supporting APIs, such as reports and exports. The target is 700 ms to 1 s where practical. It is the highest target for an API. |
| `heavyOperation` | 5000 | Not a target for an API. Work of more than 5 s must be async, or must have an explicit approval. An endpoint with this `p95` is performance debt, and a heavy API. |

A limit above the target of its kind is a deviation. We write the reason next to it, and we let the review approve it. The package cannot judge "where practical", so it fails an endpoint that is over its limit. A limit with a reason is the way out.

```ts
import {load, P95_TARGETS} from '@sourceloop/load-testing';

// This endpoint builds a summary from many rows. It is a supporting API, not
// a user-blocking one, so it gets the higher target.
load.get('/orders/summary', {p95: P95_TARGETS.supportingApi});
```

The package has no number for how much slower than before is too slow, and none for an error rate. So `p95Regression` (20), `minDelta` (10) and `errorRate` (1) are values that the package chose.

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

#### Heavy APIs

A heavy API is an endpoint with a `p95` limit above 1000 ms. That is `P95_TARGETS.supportingApi`, the highest target for an API. A plain number such as `p95: 2000` also makes an endpoint heavy. A `p95` in `thresholds` of a `load.it`, a `load.describe` or `config.ts` counts too. So a default above 1000 ms makes every endpoint heavy.

Work of more than 5 s must be async. The endpoint that starts the work answers within its target, and a background job does the work. This package times the response of the endpoint, and it does not test the job.

`maxHeavyApis` in `config.ts` is the number of heavy APIs that the package can have. The default is 0, so no heavy API passes. Here is a package with two.

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

- The package counts the distinct endpoint ids (`METHOD path`) over all scenarios of the package. It counts the skipped scenarios and the ones that `.only` leaves out. The same id in two scenarios counts once, with its highest limit.
- The report lists the heavy APIs. See [Report](#report).
- A package with more heavy APIs than `maxHeavyApis` fails the run. The rows keep their own results, and the load still runs. A failed run saves no baseline, unless `LOAD_TESTS_FORCE_BASELINE=1`.
- We raise the number only for performance debt that the pull request lists, with an owner and a target date. We write the reason in a comment next to the limit.
- When a fix lands, we lower the number, and we lower the `p95` limit of the fixed endpoint too. An endpoint stays heavy until its limit goes down, also when it got faster. The `Note` line of the report tells when the number can go down.

The count does not say which endpoints are heavy. We chose a count because a new heavy API then needs one change, its `p95`, and not a second list of ids. The price is a gap. If a fix lands and the number stays, a new heavy API can take its place without a failure.

#### Every rule that fails a run

| What fails | Rule |
| --- | --- |
| An endpoint | It got no requests. |
| An endpoint | Its error rate is above `errorRate`. |
| An endpoint | Its p95 is above its `p95` limit. |
| An endpoint | Its p95 is above its baseline by more than `p95Regression` percent and more than `minDelta` ms. |
| A browser metric | A limit names it, or the defaults expect it, and the report has no samples of it. |
| A browser metric | It has a limit, and fewer samples than completed vusers. |
| A browser metric | Its p95 is above its limit, or above its baseline by more than `p95Regression` percent and more than `minDelta`. |
| A scenario | More than `errorRate` percent of its vusers failed. The limit is the one of `thresholds.default` or the library default. A vuser fails when its flow stops with an error, for example a network error, a capture that finds nothing, or a hook that throws. A 4xx or 5xx status does not stop a vuser, but it counts in the error rate of its endpoint. |
| A scenario | A worker hook threw an error. |
| A scenario | `after` or a cleanup threw. |
| A scenario | It stopped with an error, for example in `before`, in the token check, in a token refresh or in the engine. The report shows a `FAIL:` line with the message. The next scenario still runs. |
| The run | The package has more heavy APIs than `maxHeavyApis`. |
| The run | A reporter threw an error. |

An endpoint without a response has no p95. Then only the error rate and the "no requests" rule can fail it.

A failed run exits with 1. A problem in `config.ts`, in a scenario file, in the environment, or in the login stops the run before any load. The exit code is 1 then too.

#### The reasons in a FAIL line

The `Result` column of an endpoint or a browser metric shows `FAIL:` and one or more reasons, joined by `;`. These are the texts. We can search the output for them. CLS has no unit, so its texts have no `ms`, for example `p95 0.2 > limit 0.1`.

| Reason text | Meaning |
| --- | --- |
| `no requests` | The endpoint got no requests. |
| `error rate X% > Y%` | The error rate X is above `errorRate` Y. |
| `p95 X ms > limit Y ms` | The p95 X is above the `p95` limit Y. |
| `p95 +N% (+M ms) over baseline B ms` | The p95 is N percent and M ms above the baseline B. A baseline of 0 leaves out the `+N% ` part. |
| `no samples` | A browser metric has no samples. |
| `lost samples: N for M completed vusers` | A browser metric has N samples, fewer than the M vusers that completed. |
| `vuser failure rate X% > Y%` | The percent X of started vusers that failed is above `errorRate` Y. A browser scenario uses it. |

### Baseline

The file `src/__tests__/load/.out/baseline.json` keeps the p95 of the last 10 runs of each endpoint, by scenario. The baseline of an endpoint is the mean of these values. The sister package `@sourceloop/benchmarking` also averages its last ten runs. For a browser scenario, the file keeps each step, each Web Vital and the flow total, by their names in the report.

- `LOAD_TESTS_UPDATE_BASELINE=1` adds the run to the history. The run prints `Saved src/__tests__/load/.out/baseline.json`.
- A run that failed stays out, so that a regression does not become the normal value. This holds also when only `after` or a cleanup failed and every endpoint passed, because rows that stay behind can skew the next run. The run prints `Baseline not changed: the run failed. Set LOAD_TESTS_FORCE_BASELINE=1 to add it anyway.` on stderr. `LOAD_TESTS_FORCE_BASELINE=1` adds the run anyway.
- A reporter that throws also keeps the run out of the baseline. The CLI prints the same `Baseline not changed` line. `LOAD_TESTS_FORCE_BASELINE=1` with `LOAD_TESTS_UPDATE_BASELINE=1` still saves the run.
- A run that a signal stopped saves nothing.
- Without a baseline, the run checks only `errorRate` and `p95`. `p95Regression` and `minDelta` do nothing.
- The file also keeps the workload of each scenario. When a scenario now has another workload, the run does not compare its p95. The result is `pass (workload changed)`. With `LOAD_TESTS_UPDATE_BASELINE=1`, the scenario then starts a new history.
- The file keeps the base URL of the run that wrote it, and the URL of the web app as `uiUrl`. When the next run uses another URL, the CLI prints one of these lines. The p95 of another host does not describe this one. The run still compares with that baseline. With `LOAD_TESTS_UPDATE_BASELINE=1`, the file keeps the new URL. A run saves `baseUrl` only when it measured an HTTP scenario, and `uiUrl` only when it measured a browser scenario. Else the file keeps the stored value. A new `LOAD_TESTS_BASE_URL` resets the history of the HTTP scenarios only. A new `LOAD_TESTS_UI_URL` resets the history of the browser scenarios only. So the p95 of two hosts never blend into one mean. A run with only one kind of scenario keeps the URL of the other kind. A baseline with no URL loads.

  ```text
  The baseline is from <url>, not <url>.
  The baseline of the web app is from <url>, not <url>.
  ```
- The CLI writes the file to `baseline.json.<pid>.tmp` in the same folder and renames it, so a killed run leaves no half file. It removes the temp file when the write or the rename fails. A file that is not valid, for example a history that is not a list of numbers, stops the run with a `RunError`. We delete the file and record a new one.
- The history key is the label `group › name`. A rename of a `load.it` or of a `load.describe` starts an empty history, and the scenario passes as `pass (no baseline)`. The CLI never deletes the old key, so we delete it from the file by hand.
- A baseline is only good for the machine that made it. A laptop and a CI runner give other numbers.

#### Where the file lives, and how CI keeps it

The file is in `src/__tests__/load/.out/`. The `.gitignore` line from [Ignore the generated files](#ignore-the-generated-files) makes git ignore it. A fresh CI checkout has no baseline, so a CI job must bring it back. The job does this.

1. Restore `baseline.json` before the run, for example from the artifact of the last passing run on the main branch.
2. Run `npm run test:load`. On the main branch, set `LOAD_TESTS_UPDATE_BASELINE=1` for this run.
3. After a passing run on the main branch, save the file, for example as an artifact.

Pull request runs only restore the file. They do not save it. So the baseline holds the runs of the main branch, and the run judges a pull request against them.

### Run in CI

A CI job for the load tests does these steps.

1. Start the apps that the tests need, and their databases. The package starts nothing.
2. Run the migrations and the seed, so that the databases hold the data that the scenarios expect.
3. Create the test user, with its client. See [Log in](#log-in).
4. Set the environment variables. The password and the client secret come from the secrets of the CI system.
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

- Artillery does not get the secrets of the CI job. See [The environment of Artillery](#the-environment-of-artillery). A script that needs one more variable lists its name in `artillery.env`.
- GitHub Actions sets `CI=true`. So a `.only` that stays in a file fails the job, and so does a package where every scenario has `.skip`.
- A small CI runner gives other numbers than a laptop. We keep the baseline of CI runs apart from the baseline of laptop runs, and we do not copy one to the other.
- A run in CI takes the time of all phases of all scenarios, plus the time of the hooks. We keep the phases short, or we run the load tests in a separate job.

#### Browser scenarios in CI

The workflow of a web app installs Chromium, starts the app, and runs the load. This example is for GitHub Actions. The paths, the port and the start command depend on the project.

```yaml
name: Load tests
on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  load:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    env:
      BASELINE: src/__tests__/load/.out/baseline.json
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Install Chromium for Artillery
        run: npx playwright@1.62.1 install --with-deps chromium
      - name: Build and serve the web app
        run: |
          ! curl -sf http://localhost:4200 >/dev/null || { echo 'port 4200 is busy'; exit 1; }
          npm run build
          npx --yes serve@14 -s dist/my-web-app/browser -l 4200 > serve.log 2>&1 &
      - name: Wait for the web app
        run: |
          for i in $(seq 1 60); do
            curl -sf http://localhost:4200 > /dev/null && exit 0
            sleep 1
          done
          exit 1
      - name: Restore the baseline
        uses: actions/cache/restore@v6
        with:
          path: ${{ env.BASELINE }}
          key: load-baseline-${{ github.run_id }}
          restore-keys: load-baseline-
      - name: Load tests
        env:
          LOAD_TESTS_UI_URL: http://localhost:4200
          LOAD_TESTS_UPDATE_BASELINE: ${{ github.ref == 'refs/heads/main' && '1' || '' }}
        run: npm run test:load
      - name: Save the baseline
        if: github.ref == 'refs/heads/main'
        uses: actions/cache/save@v6
        with:
          path: ${{ env.BASELINE }}
          key: load-baseline-${{ github.run_id }}
```

- `npm ci` already downloads Chromium. The install step adds the OS libraries of the runner, and it covers a job that skips install scripts.
- The Playwright version in the install step must be the one of Artillery. The run names it when Chromium does not start.
- `serve@14` has a fixed version. It ignores `--no-port-switching` (see [serve issue 751](https://github.com/vercel/serve/issues/751)) and moves to a free port when port 4200 is busy. So a step before `serve` fails the job when port 4200 is busy. The app can use its own static server instead.
- The web server writes to `serve.log`, so its output stays out of the log of the load run.
- The web app calls its APIs. We start them in the job too, or we point the build at a test environment.
- A pull request restores the baseline of the main branch and does not save it. The save step runs only after a passing run on the main branch.
- GitHub removes a cache entry that no run reads for 7 days, and then the baseline is gone. A new run on the main branch starts a new baseline.
- A standard runner of GitHub Actions has 2 to 4 CPU cores. So it can run only a few browser vusers at a time. See [Size the load](#size-the-load).

### Report

At the end of the run, the console reporter prints one block for each scenario. This sample comes from a run that had a baseline. One endpoint is too slow, and one has errors.

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

- `Workload` is the load that the scenario ran. See [Set the load](#set-the-load).
- `Vusers` counts the virtual users. The limit in brackets is the highest percent of failed vusers that passes. When too many failed, the brackets read `(FAIL: vuser failure rate 8% > 1%)`.
- `Requests` is the count of responses plus network errors for the endpoint.
- `Req/s` is the requests divided by the seconds from the first to the last count of the run.
- `p95 ms (limit)` is the p95. The brackets hold the highest p95 that passes. That is the lower of `p95` and the baseline limit. The baseline limit is the baseline plus the larger of `minDelta` milliseconds and `p95Regression` percent of the baseline. With no baseline, the limit is `p95`.
- `Base ms` is the baseline p95 of the endpoint, or `-` when there is none.
- `Err % (limit)` is the error rate, with `errorRate` in brackets.
- `Result` is `pass`, or `FAIL:` with the reasons, joined by `;`. A passing endpoint can carry a note in brackets, `pass (no baseline)` or `pass (workload changed)`.
- `Hooks:` shows how many errors worker hooks threw. These are not app errors. The scenario fails.
- A line `FAIL: after failed: ...` or `FAIL: cleanup failed: ...` shows that `after` or a cleanup threw. The numbers in the table are still good, but the scenario fails, and so does the run.
- A scenario that stopped with an error has no table. It shows one line, `FAIL: <message>`. A failed `after` or cleanup of such a scenario goes to stderr as `<scenario>: after failed: <message>` or `<scenario>: cleanup failed: <message>`, and not into the report.
- A line `Baseline: recorded with <workload>, so p95 is not compared` shows that the workload changed since the baseline.
- `Skipped: <name>` lists a scenario that does not run: it has `.skip`, or a `.only` on another scenario leaves it out.
- `Coverage` counts the endpoints of `src/openapi.json` that the scenarios call. It does not count `/ping`, `/openapi.json` and the `/explorer` paths. A package with no `src/openapi.json` gets the line `Coverage: not calculated, because the application has no API specification.`
- When no baseline file exists, the reporter prints the line `No src/__tests__/load/.out/baseline.json. Run once with LOAD_TESTS_UPDATE_BASELINE=1 to record it.` after the coverage.
- The legend at the end says what a vuser is, because "users" can mean the rows of a users table.

#### The block of a browser scenario

A browser scenario prints a short block, with the vusers, the flow total and how many metrics pass. A table follows only when a metric fails, and it holds only the failed rows. This run of the scenario in [Write a browser scenario](#write-a-browser-scenario) passed.

```text
orders › save an order › chromium
Workload: 2 vusers/s for 10 s
Vusers:   20 started, 20 completed, 0 failed (limit 1%)
Flow:     p95 596 ms (no limit)
Metrics:  7 of 7 pass. Run load-testing report to see each one.
```

In the next run, the API behind the Save button took 1.2 s to answer. The `save` step went over its limit of 1 s, and the run failed with exit code 1.

```text
orders › save an order › chromium
Workload: 2 vusers/s for 10 s
Vusers:   20 started, 20 completed, 0 failed (limit 1%)
Flow:     p95 1465.9 ms (no limit)
Metrics:  6 of 7 pass. Run load-testing report to see each one.

Metric     Samples  p95 (limit)          Base  Result
step.save  20       1274.3 ms (1000 ms)  -     FAIL: p95 1274.3 ms > limit 1000 ms
```

- `Flow` is the p95 of the flow total. It shows its limit when the scenario sets `flow`.
- `Metrics` counts the steps and the Web Vitals that have a limit. It counts the flow total too, when `flow` sets a limit.
- A metric name leaves out `browser.` and the label of the scenario. So `step.save` is `browser.step.save`, and `page.LCP` is `browser.page.LCP.orders › save an order › chromium`.
- A failed step does not show its error here. Artillery prints it during the load, and the line `Vusers` counts the vusers that failed.

#### The detail of a run

`load-testing report <package-dir>` prints every metric of the last run. It starts no load. It loads `config.ts` and the built scenario files, so it needs a built package, as `run` does. It reads the report files that the last run left in `src/__tests__/load/.out/`, and judges them again with the current limits and baseline. It exits with 0 or 1, as the run did, in most cases. See the last rules below. This is the detail of the passing run above.

```text
Metric                   Samples  p95 (limit)         Base  Result
step.open                20       144 ms (1500 ms)    -     pass (no baseline)
step.save                20       383.8 ms (1000 ms)  -     pass (no baseline)
step.print (wall clock)  20       47 ms (1500 ms)     -     pass (no baseline)
page.FCP                 20       47.9 ms (1800 ms)   -     pass (no baseline)
page.LCP                 20       47.9 ms (2500 ms)   -     pass (no baseline)
page.CLS                 20       0 (0.1)             -     pass (no baseline)
page.TTFB                20       3 ms (800 ms)       -     pass (no baseline)
flow                     20       596 ms              -     no limit
```

- A `(wall clock)` step has no end element. Its time includes the waits of its assertions.
- `no limit` marks a metric that no limit gates, here the flow total.
- Each run deletes the report files of the last run before it starts. So the command judges only the last run.
- A selected scenario with no report file fails with `No report file: the last run of this scenario failed or did not start.`
- A run deletes the report file of a scenario when Artillery exits with a non-zero code, for example from the ensure plugin of `artillery.config` `plugins`. It does so also when the run is stopped. So `report` fails that scenario too.
- A broken report file fails only its own scenario in `report`. The file can hold invalid JSON, or it can have no aggregate. The other scenarios still print.
- It judges with the baseline file as it is now. After a run that saved the baseline (`LOAD_TESTS_UPDATE_BASELINE=1`, also with `LOAD_TESTS_FORCE_BASELINE=1`), that baseline already holds the run. Then `report` compares the run with itself, so its verdict can differ from the exit code of the run.
- It does not run `after` or the cleanups, so their failures are not in its verdict.
- Only the Artillery engine writes report files. With another engine, the command stops with `No report file in <dir>. Run load-testing run first.`

#### The block of heavy APIs

The block comes after the `Coverage` line. It shows when the package has a heavy API, or a `maxHeavyApis` above 0. It covers every scenario of the package, so it can name endpoints of scenarios that the report does not show. The reporter pads the ids to the longest id, and each line has its limit. See [Heavy APIs](#heavy-apis).

- When the package has more heavy APIs than the maximum, the block ends with a `FAIL` line, and the run exits with 1.
- When the maximum is higher than the count, the block ends with a `Note` line. With no heavy endpoint and a maximum above 0, only the `Note` line shows.

The `FAIL` and `Note` lines read like this:

```text
FAIL: 3 heavy APIs, but maxHeavyApis is 2. Lower the p95 limit of an endpoint to 1000 ms or less, or raise maxHeavyApis in config.ts.
Note: maxHeavyApis is 2, but 1 endpoint is heavy. Lower maxHeavyApis in config.ts.
Note: maxHeavyApis is 2, but no endpoint is heavy. Lower maxHeavyApis in config.ts.
```

#### Custom reporters

A reporter gets the result of the run once, at the end. `reporters` in `config.ts` is a list, and the default is `[consoleReporter()]`. An empty list prints no result. We write a reporter for our own tools, for example a file, a dashboard or a chat message.

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
- The reporters run one after another. A reporter that throws prints `reporter <name> failed: <message>`. The run exits with 1, and the baseline does not move. The other reporters still run. A reporter cannot make a failing run pass.
- The reporters run also after a signal, with `stopped: true`.

The fields of a `RunResult`:

| Field | Meaning |
| --- | --- |
| `scenarios` | A `ScenarioResult` for each scenario that ended: `name`, `workload`, `vusers`, `hookErrors`, `problems`, `error`, `baselineNote`, `endpoints` and `passed`. |
| `skipped` | The names of the scenarios that did not run: the ones with `.skip`, and the ones that `.only` left out. |
| `coverage` | `{covered, total, specFile}`. |
| `heavyApis` | `{max, endpoints: {id, p95}[]}`. |
| `hasBaseline` | False when there is no baseline file. |
| `passed` | True when every scenario passed and the heavy APIs are within `max`. |
| `stopped` | True when a signal ended the run. |

Each entry of `endpoints` is an `EndpointResult`. It holds `id`, `requests`, `perSecond`, `p95`, `p95Limit`, `baselineP95`, `errorRate`, `errorRateLimit`, `failures` and `note`. `vusers` has the type `ScenarioResult['vusers']`. It holds `started`, `completed`, `failed`, `failedLimit` and `failures`.

### Recipes

| How do I | Where |
| --- | --- |
| Run only one scenario while I write it | [Run only some scenarios](#run-only-some-scenarios) |
| Send the token | [Send the token](#send-the-token) |
| Use the id that an earlier response gave | [Values](#values) |
| Send requests at the same time | [Parallel requests](#parallel-requests) |
| Make data for a run, and remove it | [Test data](#test-data) |
| Give each vuser a unique value | [Give each vuser a unique value](#give-each-vuser-a-unique-value) |
| Raise the limit of one endpoint | [Thresholds and the verdict](#thresholds-and-the-verdict) |
| Time a screen that loads data late | [End a step at an element](#end-a-step-at-an-element) |
| Log in once for a browser run | [Log in, and variables of a flow](#log-in-and-variables-of-a-flow) |
| Record or reset the baseline | [Baseline](#baseline) |
| Use an Artillery plugin | [Use any Artillery feature](#use-any-artillery-feature) |

#### A browser flow with a form

Work between steps, such as `page.fill`, counts in the flow total and in no step. The `submit` step ends when the toast shows.

```ts
import {load, UI_TARGETS} from '@sourceloop/load-testing';

load.describe('customers', () => {
  load.browser(
    'create a customer',
    {steps: {open: {p95: UI_TARGETS.standardPage}}},
    async ({page, step}) => {
      await step('open', () => page.goto('/customers/new'), {
        endWhenVisible: 'form.customer',
      });
      await page.fill('input[name=name]', 'loadtest-customer');
      await step('submit', () => page.click('button[type=submit]'), {
        endWhenVisible: '.toast.success',
      });
    },
  );
});
```

#### A list and its detail screen

The first step loads a page. The second is a route change in a single-page app, so it gets the `routeChange` target.

```ts
import {load, UI_TARGETS} from '@sourceloop/load-testing';

load.browser(
  'open an order from the list',
  {
    steps: {
      list: {p95: UI_TARGETS.dataHeavyScreen},
      detail: {p95: UI_TARGETS.routeChange},
    },
  },
  async ({page, step}) => {
    await step('list', () => page.goto('/orders'), {
      endWhenVisible: 'table.orders tbody tr',
    });
    await step('detail', () => page.click('table.orders a.first'), {
      endWhenVisible: '.order-detail',
    });
  },
);
```

#### A slower endpoint with its reason

A report endpoint gets the supporting API target, and its group allows 2% of errors. We write the reason next to the limit.

```ts
import {load, P95_TARGETS} from '@sourceloop/load-testing';

load.describe('Reports', {thresholds: {errorRate: 2}}, () => {
  load.it(
    'download the monthly report',
    // A supporting API: it builds the report from many rows.
    [load.get('/reports/monthly', {p95: P95_TARGETS.supportingApi})],
    {phases: [{duration: 30, arrivalRate: 1}]},
  );
});
```

## Best practices

### One endWhenVisible step per screen

Web Vitals do not wait for the data of a screen. A page can paint fast and load its rows late, and still pass. A step with `endWhenVisible` times the wait that the user feels.

- Give each screen or route change one step with `endWhenVisible`. Name the step after the screen, for example `list` or `detail`.
- End the step at the last thing that the user waits for, such as the first data row. Do not end it at the frame of the page, which shows at once.
- Use a step with no end element only for an action that shows nothing to wait for. The report marks it `(wall clock)`.
- Run every step in every vuser. A step that only some vusers run fails with `lost samples`.

### Choose selectors for end elements

`endWhenVisible` takes a CSS selector. It uses `document.querySelector`, so it reads the first match only. See [End a step at an element](#end-a-step-at-an-element).

- Pick an element that only the finished screen shows. The step fails when the element is visible before the action.
- Do not pick an element that a loading placeholder also matches. The step would end at the placeholder.
- Prefer a stable attribute, such as `[data-testid="order-row"]`, to a class that the build can rename.
- An element needs a box with a width and a height. An element with `display: contents` counts as not visible.
- Do not use a Playwright locator such as `getByRole`. It cannot run in the page. The selector cannot reach into shadow DOM or iframes.

### Size the load

Each browser vuser runs a real Chromium page, so it needs much more CPU than an HTTP vuser. As a rule, each browser vuser that runs at the same time needs about one CPU core. A load machine that is too small makes the app look slow. In one measurement, on one 22-core machine, the step p95 of a small test app went from 0.7 s to 8 to 10 s at 40 new vusers each second. Its API p95 stayed flat, and no vuser failed. So we keep the phases small, and we run a `load.it` scenario on the same APIs to tell the two apart.

- Start with a low rate, for example 1 vuser a second, and ramp up with `rampTo`. Watch the CPU of the load machine.
- The vusers that run at the same time are about the rate times the length of the flow. A 5 s flow at 2 vusers a second keeps about 10 browsers open.
- If the step p95 rises and the API p95 stays flat, the load machine is the limit. Lower the rate, or use a bigger machine.
- A standard GitHub Actions runner has 2 to 4 CPU cores. See [Browser scenarios in CI](#browser-scenarios-in-ci).

### Keep a stable baseline

- Record the baseline on the main branch, on the same kind of machine that judges the pull requests. A laptop and a CI runner give other numbers.
- Keep the workload fixed. A new workload starts a new history, and the run does not compare p95 until it has one.
- Use `LOAD_TESTS_FORCE_BASELINE=1` rarely. It adds a failed run to the history, and that run becomes part of the mean.
- Keep the `p95` limit. The baseline is the mean of the last 10 runs, so a slow rise moves the mean with it. The `p95` limit stays fixed.
- On a noisy machine, raise `minDelta` before `p95Regression`. A regression must be above both, and `minDelta` guards fast endpoints, where a few milliseconds are a large percent.
- Use one machine size for the baseline. See [Where the file lives, and how CI keeps it](#where-the-file-lives-and-how-ci-keeps-it).

### Production build or dev server

Use a production build for browser scenarios. A dev server such as `ng serve` sends many separate, unbundled files. So the Web Vitals and the request counts differ from the ones of a production build.

- Build the app for production, and serve the files with a static server. The [CI example](#browser-scenarios-in-ci) does this.
- Use a dev server only to check that a scenario works while we write it.
- The baseline keeps the URL of the web app. A switch from a dev URL to a production URL resets the history of the browser scenarios.

### What the Artillery counters mean

Artillery prints counters when the load ends. The report files hold them under `aggregate.counters`. The counters add up over all vusers of the scenario. For a count per vuser, we divide by `vusers.completed`.

| Counter | What it counts |
| --- | --- |
| `vusers.created`, `vusers.completed`, `vusers.failed` | Vusers that started, finished their flow, and stopped on an error. The `Vusers` line reads them. |
| `browser.http_requests` | Every browser request that finished, from `page.on('requestfinished')` of the engine: HTML, JS, CSS, images, and API calls. |
| `browser.page.codes.<status>` | Responses by status code, from `page.on('response')` of the engine. |
| `browser.step.<name>` | The time of a step. A summary, not a counter. |
| `browser.step_wall_clock.<name>` | Steps that took the time of the whole action, because they have no end element. |
| `browser.flow.<label>`, `browser.page.<vital>.<label>` | The flow total and the Web Vitals of a scenario. These are summaries. |
| `errors.<message>` | Vusers that stopped on this error message. |

- `browser.http_requests` is not an API call count. A page that loads 80 files and calls 2 APIs adds 82. It counts 4xx and 5xx responses too. It does not count a request that failed with no response. Playwright sends `requestfailed` for it, not `requestfinished`.
- The engine attaches its handlers to the first page of each vuser. A page from `context.newPage()`, and a popup, add nothing to these counters.
- The counts are not gated. Only a metric with a limit can fail a run. To gate API calls, we write a `load.it` scenario on the same API.
- A dev server raises `browser.http_requests`, because it sends more files.

### HTTP scenarios

- Name a scenario after what a user does, for example "browse orders and customers".
- Make the data of a run in `before`, and register each cleanup with `ctx.defer` right after the create. See [Test data](#test-data).
- Put the token in the `headers` of a `load.describe`. Do not send it by hand.
- Set a `p95` that is above its target only with a reason in a comment. See [Targets for the p95 limit](#targets-for-the-p95-limit).
- Keep load files out of the unit tests, and keep `.out` out of git. See [Set up a package](#set-up-a-package-in-a-facade-and-service-monorepo).

## Reference

### config.ts

`src/__tests__/load/config.ts` holds the settings of the package. It exports a `LoadTestConfig` as its default. The CLI loads its built file, like a scenario file. Only `phases` is required.

The type checks the keys when we build. When the CLI starts, it also checks the values, before it logs in. A problem stops the run with a `ConfigError` that lists each problem on its own line.

| Key | Type | Default | Use |
| --- | --- | --- | --- |
| `phases` | `Phase[]` | none, required | The default load. A list with at least one phase. See [Set the load](#set-the-load). |
| `thresholds` | `{default?: Thresholds, step?, vitals?}` | `p95` 500, `p95Regression` 20, `minDelta` 10, `errorRate` 1 | `default` holds the limits for each endpoint. `step` and `vitals` hold the limits of browser metrics. See [Thresholds and the verdict](#thresholds-and-the-verdict) and [Limits of a browser scenario](#limits-of-a-browser-scenario). |
| `maxHeavyApis` | whole number, 0 or more | `0` | How many heavy APIs the package can have. |
| `datasources` | `Record<string, Datasource>` | none | The databases that `ctx.sql` can use. See [Datasources](#datasources). |
| `tokenCheck` | `TokenCheck` | the default token check | Replaces the default check of the token life. See [Log in](#log-in). |
| `reporters` | `Reporter[]` | `[consoleReporter()]` | Who gets the result. An empty list prints no result. See [Report](#report). |
| `engine` | `Engine` | `artillery()` | Who runs the load. See [Engines](#engines). |
| `apis` | `Record<string, string>` | none | Other backends for `ctx.apis.<name>`. Each value is the name of the variable that holds the URL. See [Other backends](#other-backends). |
| `artillery.browsers` | `BrowserEngine[]` | `[chromium()]` | The browsers that each browser scenario runs in. See [Browsers](#browsers). |
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

The library reads no database variable. `config.ts` reads the environment, and we choose the name of the variable. When `config.ts` loads, it opens nothing.

The check of `artillery.env` gives these problems.

- `artillery.env must be an array of variable names, for example ["MY_REGION"]`
- `artillery.env[<i>] must be a text that is not empty`
- `artillery.env[<i>] must not have "="`
- `artillery.env[<i>] "<name>" is not allowed: these variables are for the CLI only`, for a name that starts with `LOAD_TESTS_` in any letter case.

### Limits: levels and merge order

Layers merge by field. The strongest layer wins, and a field that no layer sets takes the library default.

| Layer | HTTP endpoint | Browser metric |
| --- | --- | --- |
| 1. Strongest | the request (`p95`, `errorRate`, `p95Regression`, `minDelta`) | one metric: `steps['<name>']`, `flow` |
| 2 | `load.it` `thresholds` | `load.browser` `step`, `vitals` |
| 3 | `load.describe` `thresholds` (inner first) | `load.describe` `step`, `vitals` |
| 4 | `thresholds.default` of `config.ts` | `thresholds.step`, `thresholds.vitals` of `config.ts` |
| 5. Weakest | the library default | the library default |

`headers` merge by name. `phases` do not merge: the strongest list replaces the others. See [Group options and the merge order](#group-options-and-the-merge-order), [Thresholds and the verdict](#thresholds-and-the-verdict) and [Limits of a browser scenario](#limits-of-a-browser-scenario).

### Defaults and limits at a glance

| What | Value |
| --- | --- |
| HTTP `p95`, `errorRate`, `p95Regression`, `minDelta` | 500 ms, 1%, 20%, 10 ms |
| `maxHeavyApis` | 0 |
| Browser step p95 | 1500 ms (`UI_TARGETS.criticalAction`) |
| FCP, LCP, CLS, TTFB, INP p95 | 1800 ms, 2500 ms, 0.1, 800 ms, 200 ms (INP only when a layer names it) |
| Baseline history | the last 10 runs of each endpoint or metric |
| Token refresh | at most once a minute |
| Token check margin | the load time plus 120 s must stay below the token life |
| `ctx.api`, `ctx.apis` and login timeout | 60 s |
| Browser start timeout of the check | 60 s, `chromium({startTimeoutMs})` |
| Postgres connection timeout | 10,000 ms |
| Postgres statement wait of the client | 60 s |
| End element that never shows | the vuser fails after 30 s |
| Chromium start check | 60 s |
| Artillery stop after a signal | SIGKILL after 10 s |
| A repeated signal | ignored when it comes less than 500 ms after the first |

### Command line and environment

```text
load-testing run <package-dir>
load-testing report <package-dir>
```

Each command takes one folder, the package that holds `src/__tests__/load`. The scripts of the quickstart use `.`. `run` runs the load. `report` prints the detail of the last run, and starts no load. See [The detail of a run](#the-detail-of-a-run). `load-testing --help` prints the usage and exits with 0. The usage lists the `LOAD_TESTS_` variables below. A wrong option, or an extra argument after the folder, prints its message and the usage, with exit code 1. A command other than `run` and `report`, or a missing folder, prints only the usage, with exit code 1.

#### Exit codes

| Code | Meaning |
| --- | --- |
| 0 | The run passed. |
| 1 | The run failed, a reporter failed, or the CLI stopped on an error before or during the run. |
| 129 | SIGHUP. |
| 130 | Ctrl-C (SIGINT). |
| 143 | SIGTERM. |

The CLI prints only the message of an error that it throws on purpose. For any other error it prints the stack, because that is a bug. See [Errors](#errors).

#### Environment

| Variable | Use |
| --- | --- |
| `LOAD_TESTS_BASE_URL` | The API under test. Required when a `load.it` scenario runs, when a browser scenario has `before` or `after`, and when `LOAD_TESTS_USERNAME` is set. |
| `LOAD_TESTS_UI_URL` | The web app under test, for example `http://localhost:4200`. Required when a browser scenario runs. |
| `LOAD_TESTS_AUTH_SERVICE_URL` | The app that serves `/auth/login` and `/auth/token`. Default is the base URL. |
| The variables that `apis` names | The URL of each other backend, for `ctx.apis.<name>`. Required when the run needs the API. |
| `LOAD_TESTS_USERNAME` | Set it to log in. Then the three variables below are required too. |
| `LOAD_TESTS_PASSWORD` | The password of the test user. |
| `LOAD_TESTS_CLIENT_ID` | The client id for the login. |
| `LOAD_TESTS_CLIENT_SECRET` | The client secret for the login. |
| `LOAD_TESTS_UPDATE_BASELINE` | `1` adds the run to the baseline history. |
| `LOAD_TESTS_FORCE_BASELINE` | `1` adds a failed run to the history too. It works only with `LOAD_TESTS_UPDATE_BASELINE=1`. |
| `CI` | Any value other than empty, `0` or `false` makes a `.only` and a run with every scenario skipped fail. The letter case does not matter. |
| `PLAYWRIGHT_BROWSERS_PATH` | The folder of the Playwright browsers, when it is not the default. The Chromium check and Artillery both read it. |
| `XDG_CACHE_HOME` | The cache folder of the user. On Linux, Playwright looks for its browsers there. The Chromium check and Artillery both read it. |

- An empty variable counts as not set, because a CI job can leave one empty.
- `LOAD_TESTS_AUTH_URL` is the old name of `LOAD_TESTS_AUTH_SERVICE_URL`. A run that finds only the old one stops with a `ConfigError`, also a run of only browser scenarios.
- `LOAD_TESTS_BASE_URL`, `LOAD_TESTS_UI_URL`, `LOAD_TESTS_AUTH_SERVICE_URL` and the variables of `apis` must be http or https URLs, with no user and no password. A bad value stops the run with a `ConfigError` that names the variable. It does not show the value, because a URL can hold a password. The CLI removes a slash at the end of the URL.
- The package reads no database variable. Our `config.ts` reads its own.
- Artillery and its plugins get only a short list of the variables of the CLI. Our secrets stay out of it. See [The environment of Artillery](#the-environment-of-artillery).

```sh
# Build, run, compare, and exit with 1 on a failure.
npm run test:load

# The same, and add the run to the baseline.
LOAD_TESTS_UPDATE_BASELINE=1 npm run test:load
```

#### The environment of Artillery

Artillery gets only the names below from the CLI. The match ignores the letter case. The CLI does not pass a name that it does not have.

| Group | Names |
| --- | --- |
| Paths | `PATH`, `HOME`, `USERPROFILE`, `TMPDIR`, `TMP`, `TEMP` |
| Terminal and locale | `LANG`, `TZ`, `TERM`, `COLORTERM`, `NO_COLOR`, `FORCE_COLOR`, and every name that starts with `LC_` |
| CI | `CI` |
| Proxy and certificates | `HTTP_PROXY`, `HTTPS_PROXY`, `SSL_CERT_FILE`, `SSL_CERT_DIR` |
| Node | `NODE_OPTIONS`, `NODE_EXTRA_CA_CERTS`, `NODE_PATH`, `NODE_ENV`, `NODE_NO_WARNINGS`, `NODE_TLS_REJECT_UNAUTHORIZED` |
| Browsers | `PLAYWRIGHT_BROWSERS_PATH`, `XDG_CACHE_HOME` |
| Windows | `SYSTEMROOT`, `WINDIR`, `COMSPEC`, `PATHEXT`, `APPDATA`, `LOCALAPPDATA` |

- The CLI does not pass these names, for example `NODE_AUTH_TOKEN`, `ARTILLERY_CLOUD_API_KEY`, `GITHUB_TOKEN`, every `AWS_*` name and every `LOAD_TESTS_*` name. `NODE_` and `ARTILLERY_` are not prefixes.
- This is not a sandbox. The Artillery process can still read files. The list keeps the secrets of a CI job out of `{{ $env.NAME }}` and out of the plugins of Artillery.
- To pass more variables, we list their exact names in `artillery.env` of `config.ts`, for example `artillery: {env: ['MY_REGION']}`. The CLI passes such a name only when it has the variable. A name that starts with `LOAD_TESTS_` is a config error.
- `NO_PROXY` and `ALL_PROXY` are not in the list. Artillery reads neither of them. A project that needs one lists its name in `artillery.env`.
- A proxy URL with a password (`HTTP_PROXY`, `HTTPS_PROXY`) and `NODE_OPTIONS` pass to Artillery as they are. So we use a proxy without a password, and we keep secrets out of `NODE_OPTIONS`.
- The package sets `LOAD_TESTS_BASE_URL` for a `load.it` scenario, and `LOAD_TESTS_UI_URL` for a browser scenario. It sets `LOAD_TESTS_TOKEN` only for a scenario that uses `token()`. The runner sets `ARTILLERY_DISABLE_TELEMETRY` to `true`.
- The worker hooks (`beforeEach`, `afterEach`, `beforeRequest`, `afterResponse`, `functions` and `processor`) run inside Artillery. They see only these names too. So does the flow of a browser scenario.

### Errors

Every error that the package throws on purpose extends `LoadTestError`. The CLI prints only the message of such an error. For any other error it prints the stack, because that is a bug.

| Class | When |
| --- | --- |
| `ConfigError` | `config.ts` (also `artillery.env`, `artillery.browsers` and `apis`), the folder layout, the environment, a datasource, `token()` with no login, or a name that `ctx.apis` does not have. |
| `ScenarioError` | A scenario file, a request, a worker hook, a scenario name, a `{{` string or a capture. |
| `HttpError` | A response of `ctx.api` or `ctx.apis.<name>` with a status that is not 2xx. |
| `LoginError` | The login or the refresh of the token failed, also on a redirect. |
| `RunError` | A fault of the engine, a report, the baseline file or a token check. Also a `ctx.api` or `ctx.apis.<name>` path with no leading `/`. Also refused text in the `vars` of `before` or in the token. Also a 2xx body that is not JSON. |

- `ConfigError` and `ScenarioError` have `problems`, one line for each problem. The message is the header, then one indented line for each problem.
- `HttpError` has `method`, `path` (with the query), `status`, `statusText`, `headers`, `body` (the text) and `data`. `data` is the parsed body when the response says it is JSON, else `undefined`. Its message holds the first 200 characters of the body.
- All classes accept `{cause}`.
- A network failure of `ctx.api` or `ctx.apis.<name>` is a `RunError` that keeps the cause. The message reads `<METHOD> <path> failed: <cause>`, for example with the cause `connect ECONNREFUSED 127.0.0.1:4010`. The cause is never empty. A timeout reads `<METHOD> <path> timed out after <N> s`. A stalled body gives the same text.
- A missing or unreadable Artillery report is a `RunError` with `Artillery wrote no valid report: <reportPath>`. It keeps the cause. A report file that is not a JSON object gives the same message.
- A report that parses but has no `aggregate` gives the `RunError` `<reportPath> has no aggregate: Artillery wrote no result`.
- A report with `aggregate` but no `counters` or `summaries` counts as no requests.

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

### Engines

An engine runs the load of one scenario and returns what it measured. The default is `artillery()`. The scenarios, the thresholds, the baseline and the reports do not depend on it. To write an engine, we return an object with a `name` and a `run` function, and set it as `engine` in `config.ts`.

This engine is a stub. It sends nothing and measures nothing. It returns fixed numbers for one endpoint, so any other endpoint of a scenario fails with `no requests`.

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

- `run` gets an `EngineRun`. It has `pkgDir`, `scenario`, `config`, `phases`, `runVars` (what `before` set), `endpointIds`, `baseUrl`, `token` (undefined without a login) and `signal`.
- `run` returns a `Measurement`. It has `endpoints` (a map of the endpoint id to `{count, failed, p95}`), `hookErrors`, `vusers` and `seconds`. It can also have `metrics`, a map of the name of a browser metric to its stats. An engine with no browser leaves it out.
- The package checks the `{{` strings of the scenario for every engine. It checks the run-time values only for the Artillery engine: `vars`, captured values and the token. A custom engine must refuse such text itself, if its tool reads templates. See [Text that the engine refuses](#text-that-the-engine-refuses).
- On `signal`, the engine stops its work and throws. It throws `ScenarioError` for a scenario that it cannot run, and `RunError` when the load fails.
- `load.step` and the `artillery` options work only with the Artillery engine. Nothing checks this yet.
- The baseline file does not record the engine.

### Use any Artillery feature

The Artillery engine owns the target, the token, the metrics and the phases. The `artillery` option reaches everything else in Artillery. Its types come from Artillery, so a typo is a compile error. The engine passes the strings under `artillery` on as they are, so the `{{` check does not read them.

| Option | Where | Use |
| --- | --- | --- |
| `artillery.config` | `config.ts` | Part of the Artillery `config` (`http`, `plugins` and so on), merged into every scenario. It cannot hold `phases`, `processor`, `target`, `engines.<engine>.aggregateByName` or the `metrics-by-endpoint` plugin, because the package owns them. We use `phases` and `artillery.processor` instead. The `launchOptions` of `engines.playwright` are allowed. The Chromium check uses them too. |
| `artillery.config` | `load.it` options | The same, merged over the one of `config.ts`. Plain objects merge. An array replaces the one before it. A browser scenario takes `artillery.config` only from `config.ts`. |
| `artillery.raw` | scenario options | `weight`, `onError`, `beforeScenario` and `afterScenario`. The package keeps its own `beforeScenario` and `afterScenario`, and adds the ones of `artillery.raw` after them. |
| `artillery.raw` | request options | Request fields that the package does not own, such as `expect`, `ifTrue`, `capture` by header and `form`. The package keeps its own `capture`, `beforeRequest` and `afterResponse`, and adds the ones of `artillery.raw` after them. `url`, `name`, `headers`, `json` and `qs` are not allowed: the request options set them, and `name` is the key of the metrics of the endpoint. |
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

- A name in `functions` or in the exports of `processor` must not repeat. It must not be one that the package generates (`loadTests...`, `beforeRequest_<n>` and `afterResponse_<n>`). The run stops on such a name.
- Requests with one endpoint id add up to one result.

#### The public types

The package exports these types. We import them with `import type`, and the values (`load`, `vars`, `token` and so on) with a normal import.

| Use | Types |
| --- | --- |
| Hooks and `ctx` | `RunContext`, `Vars`, `UserContext`, `BeforeEachContext`, `HookRequest`, `HookResponse`, `Hooks`, `Api`, `ApiOptions`, `ApiClientOptions`, `Sql`, `QueryResult` |
| Scenarios and requests | `ScenarioOptions`, `GroupOptions`, `RequestOptions`, `LoadRequest`, `Method`, `ParallelGroup`, `FlowItem`, `StepInput`, `RawStep`, `Scenario` (`HttpScenario` or `BrowserScenario`), `HttpScenario`, `Phase`, `Thresholds`, `HeaderMap` |
| Browser scenarios | `BrowserScenario`, `BrowserOptions`, `BrowserFlow`, `BrowserFlowContext`, `BrowserPage`, `BrowserStep`, `StepOptions`, `BrowserLimitOptions`, `MetricThresholds`, `WebVital` |
| Values | `Value`, `Var`, `Capture`, `Token`, `Template`, `Uuid`, `RandomNumber`, `RandomString` |
| `config.ts` | `LoadTestConfig`, `TokenCheck`, `ArtilleryConfig`, `Datasource`, `PostgresDatasource`, `PostgresOptions`, `CustomDatasource`, `SqlConnector`, `Connection` |
| Engines and reporters | `Engine`, `EngineRun`, `Measurement`, `Reporter`, `RunResult`, `ScenarioResult`, `EndpointResult`, `EndpointStats`, `MetricStats`, `VuserCounts`, `HeavyApis`, `HeavyEndpoint` |

## Help and internals

### Troubleshooting

| What we see | Why, and what to do |
| --- | --- |
| `Set LOAD_TESTS_BASE_URL` (or other `LOAD_TESTS_` names) | A required variable is missing or empty. Set it. With `LOAD_TESTS_USERNAME` set, the password, the client id and the client secret are required too. A browser scenario needs `LOAD_TESTS_UI_URL`. |
| ``Chromium does not start with Playwright 1.62.1, the version that Artillery uses. Install it with `npx playwright@1.62.1 install chromium`. On a new Linux machine, add --with-deps.`` | The check before a browser scenario fails with this line, and the next line gives the error of Playwright. When Chromium does not start in 60 s, a detail line `Chromium did not start in 60 s.` comes with it. Run the command. With browsers in another folder, set `PLAYWRIGHT_BROWSERS_PATH`. On Linux, Playwright also looks in `XDG_CACHE_HOME`. Playwright also reads `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE` and `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS`, and a Nix or an unusual CI image often needs `LD_LIBRARY_PATH`. These names are not in the default list of [The environment of Artillery](#the-environment-of-artillery). We pass them with `artillery.env` in `config.ts`. |
| `'<selector>' is not visible after the action of step <name>: ...` | The end element of a step never showed. The vuser failed after 30 s. The text after the colon is the first line of the Playwright error. Check the selector, and check that the action shows the element. |
| `No report file: the last run of this scenario failed or did not start.` | `load-testing report` found no report file for a selected scenario. The last run of this scenario failed or did not start. A run deletes the report file when Artillery exits with a non-zero code, or when the run is stopped. Run the load again. |
| ``artillery.config.engines.playwright.aggregateByName is not allowed: the library sets it`` or ``artillery.config.target is not allowed: the library sets it from LOAD_TESTS_BASE_URL or LOAD_TESTS_UI_URL`` | `artillery.config` sets an option that the package owns. Remove it. |
| `Error: '<selector>' is visible before the action`, in the output of Artillery | The end element of a step shows before its action. The step would end at once. Pick an element that only the action shows. |
| `FAIL: no samples` on a step | No vuser ran the step, or a name in `steps` has a typo. A step that fails its vusers also gives no samples. |
| `FAIL: lost samples: N for M completed vusers` | Some vusers did not run the step, or a page did not report a Web Vital. Every vuser must run every step. |
| `No report file in <dir>. Run load-testing run first.` | `load-testing report` found no report of a run. Run the load first. |
| `No src/__tests__/load/config.ts. Add one that exports the default config ...` | The package has no `config.ts` in the load folder. Add one with `phases`. See [config.ts](#configts). |
| `No *.load.ts file in <dir>` | The load folder has no scenario file. Add a file that ends in `.load.ts`. |
| `<file> registers no scenario. Add a load.it(...) or load.browser(...) call to it. If it has one, two copies of @sourceloop/load-testing are installed.` | The file has no `load.it` or `load.browser`, or it imports another copy of the package. In a workspace, install one copy, so that the CLI and the scenario file share it. |
| `No dist/__tests__/load/config.js. Run npm run build.` | The built file is missing. Build the package. The `pretest:load` script does it. The same message names a missing built scenario file. |
| `src/openapi.json has no GET /orders/{id}` | A request names an endpoint that the OpenAPI file does not have. Check the path and the method. If the route is new, build the app, run `node ./dist/openapi-spec src/openapi.json`, and commit the file. |
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
| `The URL in LOAD_TESTS_BASE_URL contains text that the engine reads as a template ...` | `LOAD_TESTS_BASE_URL`, or `LOAD_TESTS_UI_URL` in the message of a browser scenario, has the refused text. Use a URL without it. |
| `errors.load-testing hook ...  <count>` in the summary of Artillery | Artillery cuts a line at 79 columns. The full text is the key `errors.<message>` under `aggregate.counters` in `src/__tests__/load/.out/<slug>.report.json`. See [Text that the engine refuses](#text-that-the-engine-refuses). |
| `{{ $env.MY_REGION }}` is empty in a script | Artillery gets only an allowed list of variables. Add the exact name to `artillery.env` in `config.ts`. See [The environment of Artillery](#the-environment-of-artillery). |
| `artillery.env must be an array of variable names, for example ["MY_REGION"]` | `artillery.env` is not an array. Write a list of names. |
| `artillery.env[<i>] must be a text that is not empty`, `artillery.env[<i>] must not have "="`, or `artillery.env[<i>] "<name>" is not allowed: these variables are for the CLI only` | An entry of `artillery.env` is not a name, has `=`, or starts with `LOAD_TESTS_`. Use the exact name of a variable that is not for the CLI. |
| `POST <url> gave <status>, a redirect to <origin>. The login does not follow redirects, ...` | The auth URL redirects. Set `LOAD_TESTS_AUTH_SERVICE_URL` to the final URL. |
| `No API '<name>' in config.ts apis. Known: ...` | A hook reads `ctx.apis.<name>` with a name that `apis` in `config.ts` does not have. Fix the name, or add it to `apis`. |
| `apis.<name> must be the name of a variable, for example LOAD_TESTS_AUTH_SERVICE_URL`, or `apis must be an object ...` | `apis` is not an object of names and variable names. Write `{auth: 'LOAD_TESTS_AUTH_SERVICE_URL'}`. |
| `artillery.browsers[<i>] ...` | An entry of `artillery.browsers` is wrong: no name, an engine that is not a text, `vitals` that are not Web Vitals, a name that is used twice, or `aggregateByName` in `engineOptions`. See [Browsers](#browsers). |
| `artillery.browsers has no browser "<name>"` | A scenario names a browser that the list does not have. Use the same list for the whole run. |
| `<METHOD> <path>: the path must start with "/"` | A `ctx.api` call has a path with no leading `/`. The call sends nothing. Start the path with `/`. |
| `beforeEach returned a promise: worker hooks must be synchronous` | A worker hook is `async`, or returns a promise. Make it synchronous. Do async work in `before`. |
| `... can use only its arguments and the globals of a worker, such as URL and Buffer: x is not defined` | A worker hook uses an import or a variable of its module. Pass the value through `vars`, or use only globals. |
| `randomNumber: the minimum and the maximum must be whole numbers from 0 up` | A value is negative or has a fraction. Use whole numbers from 0 up, with `min` not above `max`. |
| `The scenario name "<name>" gives the file name "baseline", ...` | The file name `baseline` is for the baseline file. Rename the scenario. |
| `phases[i].duration must be a whole number above 0, or a text such as "1m"` | A phase has a bad time or count. Use a whole number above 0, or a text that reads as more than 0. The same holds for `pause` and `arrivalCount`. A phase with `rampTo` needs `arrivalRate`. |
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
| `capture source "GET /orders" runs in parallel with this request` | The source is in the same `load.parallel` group. Capture from a request before the group. A request of the group with the same id does not matter when an earlier request outside the group has it. |
| `Two scenarios have the same name: ...` | Two scenarios give the same generated file name. Rename one. |
| `token() needs a login: ...` | A scenario sends `token()`, but `LOAD_TESTS_USERNAME` is not set. Set the login variables. |
| `FAIL: 3 heavy APIs, but maxHeavyApis is 2. ...` | The package has more heavy APIs than it can have. Lower the `p95` limit of an endpoint to 1000 ms or less. Raise `maxHeavyApis` only for performance debt that the pull request lists. |
| `Artillery stopped with code 1: <script>` | Artillery failed. Its own output, above this line, tells why. |
| `artillery is missing from @sourceloop/load-testing: reinstall the package` | Artillery is not installed. Reinstall the package, and do not prune its dependencies. |
| `<baseline file> has a baseUrl or uiUrl that is not a text. Delete it, and record a new one.` or `src/__tests__/load/.out/baseline.json ... Delete it, and record a new one.` | The baseline file is not valid. It can be bad JSON, or it can miss the history or the workloads, or its `baseUrl` or `uiUrl` is not a text. Delete it, and run with `LOAD_TESTS_UPDATE_BASELINE=1`. |
| `GET /orders: artillery.raw.name is not allowed: the request options set it` | A request sets `url`, `name`, `headers`, `json` or `qs` in `artillery.raw`. Remove it, and use the request options. |
| Every row says `pass (workload changed)` | The phases changed since the baseline. Run once with `LOAD_TESTS_UPDATE_BASELINE=1` to start a new history. |

### Limits

- The package runs on one machine, with the local mode of Artillery. The workers are threads of the Artillery process. It does not spread the load over many machines.
- Artillery does not split a CSV `payload` between the workers. Each worker gets the whole payload. So we cannot use a CSV to give each vuser its own row.
- The scenarios of a package run one after another, never in parallel.
- The CLI kills the Artillery processes when it exits, but it cannot catch a SIGKILL of itself. After such a kill, Artillery processes can stay alive.
- The engine sends one access token for the whole load of a scenario. The token life limits the length of a load. See [Log in](#log-in).
- The count of heavy APIs leaves a gap. If a fix lands and `maxHeavyApis` stays the same, a new heavy API can take its place without a failure. See [Heavy APIs](#heavy-apis).
- The p95 is the time to the first byte of the response. It does not include the download of the body. Artillery reads this time from its HTTP engine.
- The p95 includes the whole network path. For a request to a facade, that is the client to the facade, the facade to a service, and the service to its database. The number also depends on the machine that runs the load. A pass on a CI runner does not prove the target in production.
- A baseline is good only for the machine that made it, and only for one workload.
- The package does not test a background job that an endpoint starts. It times only the response of the endpoint.
- A value that a request captures through `artillery.raw` on the request (its `capture` field) gets no check for the refused text. The package checks only `captureFrom`.
- A `beforeEach` result with the refused text is found in the worker, not before the load starts.
- The package does not check where the URLs point. We run it only against a local or a test environment.
- A browser scenario runs Chromium only, and it does not time the API calls of its page.
- `endWhenVisible` takes a CSS selector, not a Playwright locator. It does not look into shadow DOM or iframes. Its rule of visibility differs from the one of Playwright for `display: contents`, which it treats as not visible.
- A full page load inside a flow loses the LCP, CLS and INP of the page that it leaves. A page from `context.newPage()`, and a popup, never report Web Vitals. The engine reads them only on the first page.
- Artillery rounds each p95 to 1 decimal, so the CLS p95 moves in steps of 0.1. Its DDSketch also gives every p95 an error of about 1%.
- Each browser vuser that runs at the same time needs about one CPU core. A small load machine makes the app look slow.
- `load-testing report` shows only the last run, and only for the Artillery engine.

### How it works inside

1. `tsc` builds the `*.load.ts` files to `dist/__tests__/load`. The CLI requires the built files. The `load.it`, `load.describe` and `load.browser` calls register scenarios while a file loads.
2. For each scenario, the Artillery engine writes an Artillery script, and a processor file for the worker hooks, to `src/__tests__/load/.out/`.
3. It runs `artillery run --output <slug>.report.json <script>` as a child process. Artillery prints its own progress.
4. It reads the report file. Per-endpoint p95 and status counts come from the `metrics-by-endpoint` plugin of Artillery. Vusers come from the `vusers.*` counters.
5. The judge compares the measurement with the limits and the baseline. The reporters print the result.
6. A browser scenario uses the Playwright engine of Artillery. Each worker loads the built flow file at the first vuser. The `step` function records `browser.step.<name>`, and the flow records `browser.flow.<label>`. The end element check runs in the page on each animation frame.

See [Source layout](#source-layout) for the files, and [How a run works](#how-a-run-works) for the order of the steps.

### Source layout

This part is for people who change the package. Each folder is one step of a run.

| Path | What it holds |
| --- | --- |
| `types.ts` | The public types: scenario, request, hooks, config. |
| `errors.ts` | All error classes, `errorMessage`, `fetchFailure`, `guardedStep` and `MS_PER_SECOND`. |
| `output.ts` | `print`, `printError`, `output` and `ignoreOutputErrors` (stops a dead terminal from ending the process). No other file writes to the console. |
| `scenario/` | What a load file calls (`builder.ts`), the values (`values.ts`, `braces.ts`), headers (`headers.ts`), `token.ts`, the name of a scenario (`label.ts`), `.only` and `.skip` (`select.ts`), the load (`workload.ts`). `brand.ts`, `guards.ts` and `types.ts` mark and check the objects that the calls make, and hold the scenario types. |
| `context/` | What `before` and `after` get as `ctx`: `api.ts`, `sql.ts`, `postgres.ts`, `driver.ts` and `cleanup.ts`. `types.ts` holds the types of `ctx`. |
| `project/` | What the CLI reads from a package: where its files are, and the constants `BASE_URL_ENV` and `UI_URL_ENV` (`layout.ts`), `config.ts`, the scenario files (`loader.ts`), `spec.ts` and `heavy.ts`. `types.ts` holds the types of these files. |
| `report/` | Judges the measurement against the limits and the baseline (`compare.ts`, `report.ts`), the metric names (`names.ts`, which a worker loads), and the default reporter and the reporter of `load-testing report` (`console.ts`). |
| `engine/` | The `Engine` type, in `types.ts`. `engine/artillery/` is the Artillery adapter. `index.ts` there is the `artillery()` engine, and `types.ts` holds the Artillery types. It also holds the transpiler, the worker hooks (`processor.ts`), `requests.ts`, the check for the refused text (`templates.ts`), the environment of the process (`env.ts`), the process (`runner.ts`) and the report reader (`measure.ts`). For browser scenarios, it also holds the flow and its steps in the worker (`browser.ts`), and the Chromium check (`chromium.ts`). |
| `run/` | One run: the login (`target.ts`), `tokenCheck.ts`, Ctrl-C (`cancel.ts`), `prepare.ts`, `execute.ts`, the token refresh (`session.ts`), the baseline save (`baseline.ts`) and `load-testing report` (`rejudge.ts`). `types.ts` holds the types of a run. |

`cli.ts` is the command, and `index.ts` is what the package exports.

The tests are in `src/__tests__/`. See [Contributing](#contributing).

The import order is `types.ts`, `errors.ts`, `output.ts`, `scenario`, `context`, `project`, `report`, `engine`, `run`, `cli.ts`. At run time, a file imports only from the files and folders before it in this list. There is one exception, for types only. `types.ts` has `import type` lines for the `types.ts` files of later folders. They leave no trace in the built code, so they cannot make a cycle. A cycle of run-time imports is a bug. Only `cli.ts`, `index.ts` and `run/rejudge.ts` import the code of `engine/artillery/`. `rejudge.ts` reads the report files that Artillery wrote. The unit tests in `src/__tests__/unit/` use the same folders.

### Contributing

Build with `npm run build`. `npm test` rebuilds the package and runs the unit tests. It skips the browser tests. Only a `describe('browser: ...')` marks them (`--grep browser:`). `npm run test:browser` runs only those, and it needs Chromium.

The Playwright version 1.62.1 comes from Artillery 2.0.34. When we bump Artillery, we update the version in this README and in `src/__tests__/unit/cli.unit.ts`.

The README is not under Prettier. We edit it by hand.

## License

MIT, copyright SourceFuse. See the `LICENSE` file.

Artillery, which this package installs as a dependency, has the MPL-2.0 license. We use it unmodified.
