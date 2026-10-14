// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {
  Config,
  HttpRequestWithBodySpec,
  Scenario as ArtilleryScenario,
} from 'artillery';

/** Where Artillery reads a captured value from. */
export type CaptureStep = {
  json: string;
  as: string;
};

/** An Artillery `config`. The library owns `phases` and `processor`. */
export type ArtilleryConfig = Partial<Config>;

/** The options of a scenario that only the Artillery engine reads. */
export type ArtilleryScenarioOptions = {
  /**
   * Artillery `config`, deep-merged over the one of `config.ts` into the
   * emitted one. An array replaces the one before it. It cannot hold
   * `phases` (use the `phases` option) or `processor` (use `processor`).
   */
  config?: ArtilleryConfig;
  /**
   * Escape hatch: scenario fields that the library does not own. Its
   * `beforeScenario` and `afterScenario` are added to the library's own.
   */
  raw?: Pick<
    ArtilleryScenario,
    'weight' | 'onError' | 'beforeScenario' | 'afterScenario'
  >;
  /**
   * Functions that Artillery steps call by name, for example
   * `{function: 'name'}` with `(ctx, ee, next) => void`. Same rules as
   * worker hooks: the transpiler copies their source, so they can use only
   * their arguments and JavaScript globals.
   */
  functions?: Record<string, (...args: never[]) => unknown>;
  /**
   * Absolute path of a built `.js` file. Its exports are Artillery processor
   * functions that steps call by name. Every worker loads the file, so it
   * can import anything, at the cost of the load time of its imports.
   */
  processor?: string;
};

/** The options of a request that only the Artillery engine reads. */
export type ArtilleryRequestOptions = {
  /**
   * Escape hatch: Artillery request fields that the library does not own
   * (`expect`, `ifTrue`, `capture` by header, `form`, ...). Its `capture`,
   * `beforeRequest` and `afterResponse` are added to the library's own.
   * It has no `json` and no `qs`: use the `json` and `query` options.
   */
  raw?: Omit<
    HttpRequestWithBodySpec,
    'url' | 'name' | 'headers' | 'json' | 'qs'
  >;
};
