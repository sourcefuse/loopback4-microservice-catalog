// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {HttpFlowStep, LoopOptions} from 'artillery';
import type {HeaderMap, Phase, Value} from './scenario/types';
import type {
  ArtilleryConfig,
  ArtilleryRequestOptions,
  ArtilleryScenarioOptions,
} from './engine/artillery/types';
import type {Engine} from './engine/types';
import type {Reporter} from './report/types';
import type {Api, Datasource, Sql} from './context/types';

/**
 * Latency and error limits for one endpoint. A missing field takes the value
 * from `thresholds.default`, then from the library default. So the order is
 * endpoint, then package, then library.
 *
 * The names have no unit. Each field says its unit first.
 */
export type Thresholds = {
  /**
   * Percent, for example `20` for 20%. Fail when p95 is more than this
   * percent above the baseline p95. The endpoint fails only when the increase
   * is also above `minDelta`.
   */
  p95Regression?: number;
  /**
   * Milliseconds. Fail when p95 is more than this many milliseconds above the
   * baseline p95. The endpoint fails only when the increase is also above
   * `p95Regression`.
   */
  minDelta?: number;
  /**
   * Milliseconds. Fail when p95 is above this. It needs no baseline, so an
   * endpoint has a limit on the first run too. The default is 500: the
   * target for user-blocking APIs. `P95_TARGETS` has the other targets. A
   * higher limit is a deviation: explain it in a comment, and let the review
   * approve it.
   */
  p95?: number;
  /**
   * Percent, from 0 to 100. Fail when more than this percent of the requests
   * get an error or a 4xx/5xx status.
   */
  errorRate?: number;
};

/**
 * What `src/__tests__/load/config.ts` exports: the default load and the
 * optional default thresholds of a package.
 */
export type LoadTestConfig = {
  /**
   * Get the result of the run, one after another, once, when the last
   * scenario ended. The default is `[consoleReporter()]`. An empty list
   * prints no results. A project can write its own reporter: an object with
   * a `name` and an `onRunEnd` function.
   */
  reporters?: Reporter[];
  /**
   * Runs the load. The default is `artillery()`. A project can write its own
   * engine: an object with a `name` and a `run` function.
   */
  engine?: Engine;
  /**
   * The default load of the package: a list of phases, run one after
   * another. A flat load is one phase, for example
   * `[{duration: 60, arrivalRate: 10}]` (10 new vusers a second for 60
   * seconds). A ramp is `{duration: 60, arrivalRate: 1, rampTo: 10}`, and
   * `{pause: 10}` waits. A scenario can set its own `phases`, which replace
   * this list.
   */
  phases: Phase[];
  /**
   * Replaces the default token check (the token must outlive the phases
   * plus 120 seconds) for the scenarios of the package. The `tokenCheck` of
   * a scenario wins over this one.
   */
  tokenCheck?: TokenCheck;
  /**
   * Artillery `config` options that are merged into every scenario, for
   * example `{config: {http: {timeout: 30}}}`. Only the Artillery engine
   * reads this.
   */
  artillery?: {
    config?: ArtilleryConfig;
    /**
     * The names of more environment variables to pass to Artillery. By
     * default, Artillery gets only a short list (`PATH`, `HOME`, `HTTPS_PROXY`
     * and so on), so the secrets of a CI job stay out of `{{ $env.NAME }}`
     * and out of the plugins. A name that starts with `LOAD_TESTS_` is not
     * allowed. For example: `{env: ['MY_REGION']}`.
     */
    env?: string[];
  };
  /**
   * Optional. When omitted, the library default applies (`p95Regression` 20,
   * `minDelta` 10, `errorRate` 1, `p95` 500). The order is endpoint, then
   * package, then library.
   */
  thresholds?: {
    /** Limits for each endpoint that does not set its own. */
    default?: Thresholds;
  };
  /**
   * The databases that `ctx.sql` can use, by name. The first argument of
   * `ctx.sql` is one of these names, for example
   * `{orders: {type: 'postgres', url: process.env.DB_URL, database: 'orders'}}`.
   * `type: 'postgres'` needs `pg` in your project (`npm install --save-dev
   * pg`). For another database use `{type: 'custom', connector}`, or the
   * connector itself.
   */
  datasources?: Record<string, Datasource>;
  /**
   * How many heavy APIs the package may have. The default is 0. A heavy API
   * is an endpoint with a `p95` limit above `P95_TARGETS.supportingApi`. The
   * count is the distinct ids over all scenarios, the skipped ones too, and
   * the same id counts once. The run fails when the count is above this
   * number. Raise it only for performance debt that the PR lists, with an
   * owner and a target date.
   */
  maxHeavyApis?: number;
};

/**
 * Runs before the load of a scenario that sends `token()`, and only when
 * there is a login. Throw to stop the run before the load starts.
 */
export type TokenCheck = (info: {
  /** The access token. */
  token: string;
  /** The claims of the token. Empty when the token is not a JWT. */
  claims: Record<string, unknown>;
  /** The load of the scenario. */
  phases: Phase[];
}) => void;

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Values that hooks share. They must survive `JSON.stringify`. */
export type Vars = Record<string, unknown>;

/** What `before` and `after` get. They run once per run, in the CLI. */
export type RunContext = {
  /**
   * Access token for the login user. Undefined when no login is set
   * (`LOAD_TESTS_USERNAME` is not set). `ctx.api` does not send it: for a
   * call that needs it, write
   * `ctx.api.with({headers: {authorization: `Bearer ${ctx.token}`}})`.
   */
  token?: string;
  /**
   * The claims of the access token, for example `tenantId`. Empty when the
   * token is not a JWT, and when there is no token.
   */
  claims: Record<string, unknown>;
  /** HTTP client for the application under test. */
  api: Api;
  /** SQL on a datasource that `datasources` in `config.ts` declares. */
  sql: Sql;
  /**
   * Registers a cleanup for something that the hook made. Call it right
   * after the create, for example:
   *
   *     const customer = await ctx.api.post('/customers', {...});
   *     ctx.defer(() => ctx.api.delete(`/customers/${customer.id}`));
   *
   * The cleanups run at the end of the run, after `after`, the last one
   * first, so that a row goes before the rows it depends on. They run also
   * when `before` stopped half way, when the load failed, and after a
   * signal. A cleanup can use `ctx.api`: after a signal the client works
   * again for it, although the signal stops the requests of `before`. A
   * cleanup that fails does not stop the others, but it fails the run.
   */
  defer(cleanup: () => unknown): void;
};

/** What `afterEach` gets. It runs in an Artillery worker. */
export type UserContext = {
  /** Copy of the run's `vars`, with what earlier hooks of this user added. */
  vars: Vars;
};

/** What `beforeEach` gets. It runs in an Artillery worker. */
export type BeforeEachContext = UserContext & {
  /**
   * Count of virtual users this worker has started, from 0. It is not unique
   * in the run: every worker counts from 0. For a unique value, write
   * `randomString()` in a request.
   */
  vu: number;
};

export type HookRequest = {
  url: string;
  headers: Record<string, string>;
  json?: unknown;
};

export type HookResponse = {
  statusCode: number;
  body?: unknown;
};

export type RequestOptions = Thresholds & {
  /** Options that only the Artillery engine reads. */
  artillery?: ArtilleryRequestOptions;
  /** Fills the `{name}` parts of the path. */
  pathParams?: Record<string, string | number | Value>;
  /**
   * The query string. A number or a boolean becomes its text. For a text
   * with a value inside, use `template`.
   */
  query?: Record<string, string | number | boolean | Value>;
  /**
   * The JSON body. A value works at any depth, through plain objects and
   * arrays. A Date or a class instance is sent as it is.
   */
  json?: unknown;
  headers?: HeaderMap;
  /**
   * Runs in a worker before each send. Only its arguments and JavaScript
   * globals can be used, because the transpiler copies its source.
   */
  beforeRequest?: (req: HookRequest, ctx: {vars: Vars}) => void;
  /** Runs in a worker after each response. Same rules as `beforeRequest`. */
  afterResponse?: (
    req: HookRequest,
    res: HookResponse,
    ctx: {vars: Vars},
  ) => void;
};

export type LoadRequest = {
  kind: 'request';
  /** `METHOD /path/{param}`. Results and baselines use this id. */
  id: string;
  method: Method;
  path: string;
  options: RequestOptions;
};

/** A flow step that holds flow items. They are built with `load.get(...)`. */
type NestedStep = {loop: FlowItem[]} & LoopOptions;

/** An Artillery flow step: a typed Artillery step, or a nested one. */
export type StepInput = Exclude<HttpFlowStep, {loop: unknown}> | NestedStep;

/** An Artillery flow step that the library passes on. */
export type RawStep = {
  kind: 'raw';
  /** The requests in `loop` get transpiled like any request. */
  step: StepInput;
};

/**
 * Requests that run at the same time in one virtual user. Build it with
 * `load.parallel`. It holds requests only: no raw steps, no other group.
 */
export type ParallelGroup = {
  kind: 'parallel';
  requests: LoadRequest[];
  /** The largest number of requests that run at the same time. */
  limit?: number;
};

/** One entry of the flow of a scenario. */
export type FlowItem = LoadRequest | RawStep | ParallelGroup;

export type Hooks = {
  /**
   * Runs once per run, before the load. Puts what the scenario needs in
   * `vars`, for example the id of an order. When it throws, no load starts.
   * A text in `vars` must not hold `{{`: the run stops before the load.
   */
  before?: (ctx: RunContext, vars: Vars) => Promise<void>;
  /**
   * Runs once per run, always: after the load, and after a failed `before`
   * or a failed run. `vars` holds what `before` set before it stopped.
   */
  after?: (ctx: RunContext, vars: Vars) => Promise<void>;
  /**
   * Runs in a worker, when a virtual user starts. Returns the vars for this
   * user. It must be pure and can use only its argument and JavaScript
   * globals, because the transpiler copies its source into the worker. A
   * text in the result must not hold `{{`: the user fails.
   */
  beforeEach?: (ctx: BeforeEachContext) => Vars;
  /** Runs in a worker, when the flow of a user ends without an error. */
  afterEach?: (ctx: UserContext) => void;
};

/**
 * The options of `load.describe`, and of `load.it` too. The scenario gets
 * the merged values: `it` beats the inner `describe`, which beats the outer
 * one.
 */
export type GroupOptions = {
  /**
   * Headers for every request of the scenario. A request header with the
   * same name (any case) wins. A value works as in a request header, for
   * example `{authorization: template`Bearer ${token()}`}`. Headers of
   * different layers merge by name.
   */
  headers?: HeaderMap;
  /**
   * The load. It replaces the `phases` of config.ts and of the layers
   * around: there is no merge.
   */
  phases?: Phase[];
  /**
   * Limits for every endpoint of the scenario. They beat `thresholds.default`
   * of config.ts, and a request option beats them. Layers merge by field.
   */
  thresholds?: Thresholds;
};

export type ScenarioOptions = Hooks &
  GroupOptions & {
    /**
     * Replaces the token check of config.ts and the default one for this
     * scenario. Throw to stop the run.
     */
    tokenCheck?: TokenCheck;
    /** Options that only the Artillery engine reads. */
    artillery?: ArtilleryScenarioOptions;
  };

export type Scenario = ScenarioOptions & {
  name: string;
  /** The names of the `load.describe` blocks around the scenario, outermost first. */
  group?: string[];
  /** Set by `.only` on the scenario, or on a `load.describe` around it. */
  only?: boolean;
  /** Set by `.skip` on the scenario, or on a `load.describe` around it. It wins over `only`. */
  skip?: boolean;
  requests: FlowItem[];
};

/** What an `HttpError` carries from the response. */
export type HttpErrorDetails = {
  method: string;
  /** The path with the query. */
  path: string;
  status: number;
  statusText: string;
  headers: Headers;
  /** The body as text. It is always set. */
  body: string;
  /** The body parsed, when the response said it is JSON. */
  data: unknown;
};
