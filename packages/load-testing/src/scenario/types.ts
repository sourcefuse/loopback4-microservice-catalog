// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
/**
 * A phase of the load: one step of the load shape. The names are the ones
 * that Artillery uses. A phase is a pause, or it has a `duration` and one of
 * `arrivalRate`, `rampTo` or `arrivalCount`.
 */
export type Phase = {
  /** Shown in the output of the engine. */
  name?: string;
  /** Seconds, or a text such as `20m`. */
  duration?: number | string;
  /** New virtual users each second. */
  arrivalRate?: number;
  /** Ramps the rate to this value (vusers each second) over `duration`. */
  rampTo?: number;
  /** Starts this many virtual users over `duration`. */
  arrivalCount?: number;
  /** Seconds, or a text such as `1m`: waits and starts nobody. */
  pause?: number | string;
  /** Stops starting vusers while this many virtual users run. */
  maxVusers?: number;
};

/** A value from the response of an earlier request in the same scenario. */
export type Capture = {
  kind: 'capture';
  /** Endpoint id of the source request, for example `GET /order-items`. */
  from: string;
  /** JSONPath into the source response body, for example `$[0].id`. */
  jsonPath: string;
};

/** A value from `vars`: what `before` and `beforeEach` put there. */
export type Var = {
  kind: 'var';
  name: string;
};

/** The access token of the login user. Make it with `token()`. */
export type Token = {kind: 'token'};

/** `length` random letters and digits. Make it with `randomString`. */
export type RandomString = {kind: 'randomString'; length: number};

/** A random whole number from `min` to `max`. Make it with `randomNumber`. */
export type RandomNumber = {kind: 'randomNumber'; min: number; max: number};

/** A UUID, the same in all the requests of one virtual user. Make it with `uuid`. */
export type Uuid = {kind: 'uuid'};

/**
 * Text made of strings and values. Make it with the tag `template`. The
 * engine renders each part and joins them.
 */
export type Template = {
  kind: 'template';
  /** Plain strings and values, in order. */
  parts: (string | Value)[];
};

/**
 * A value that the engine fills in when a virtual user sends a request. It
 * works in `json`, `pathParams`, `headers` and `query` of a request. Each
 * engine renders it in its own syntax, so the scenario holds no engine syntax.
 * Inside a string, put it in the tag `template`.
 */
export type Value =
  Capture | Var | Token | RandomString | RandomNumber | Uuid | Template;

/** The headers of a request or of a scenario. A value is filled in by the engine. */
export type HeaderMap = Record<string, string | Value>;
