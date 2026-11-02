// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {isPlainObject} from '../../scenario/guards';
import type {LoadTestConfig, WebVital} from '../../types';
import {checkChromium} from './chromium';
import type {ArtilleryConfig} from './types';

/** What `BrowserEngine.check` gets. */
export type BrowserCheckInput = {
  /** The environment of Artillery. */
  env: NodeJS.ProcessEnv;
  /**
   * The options of the Artillery engine of the browser: `engines.<engine>`
   * of `artillery.config`, with `engineOptions` of the browser over it.
   */
  options: Record<string, unknown>;
  /** Stops the check. */
  signal?: AbortSignal;
};

/**
 * A browser that browser scenarios run in. The default list has `chromium()`.
 * To run another browser, write an Artillery engine for it (a package named
 * `artillery-engine-<name>`, as the Playwright engine of Artillery, which
 * starts only Chromium), and list an object of this type in
 * `artillery.browsers` of config.ts.
 *
 * The engine must run the `testFunction` of the script with
 * `(page, context, events)`, must read `aggregateByName` as Artillery does,
 * and must emit the metrics `browser.page.<vital>.<scenario>` of the Web
 * Vitals that `vitals` lists.
 */
export type BrowserEngine = {
  /** Gives the end of the label of each scenario: `<scenario> › <name>`. */
  name: string;
  /** The Artillery engine that runs the browser, for example `playwright`. */
  engine: string;
  /** Options for that engine, over `engines.<engine>` of `artillery.config`. */
  engineOptions?: Record<string, unknown>;
  /**
   * The Web Vitals that the browser reports. A Web Vital that is not here
   * has no limit and no row.
   */
  vitals: readonly WebVital[];
  /**
   * Runs before each scenario of the browser. Throw a `ConfigError` when the
   * browser cannot start.
   */
  check?(input: BrowserCheckInput): Promise<void>;
};

/** The options of `chromium()`. */
export type ChromiumOptions = {
  /** Playwright `launchOptions`, for example `{channel: 'chrome'}`. */
  launchOptions?: Record<string, unknown>;
  /** How long Chromium may take to start in the check. Default 60 s. */
  startTimeoutMs?: number;
};

/**
 * Chromium, through the Playwright engine of Artillery. It is the default,
 * and the only browser that Artillery supports. `launchOptions` with a
 * `channel` of `chrome` or `msedge` runs Chrome or Edge.
 */
export function chromium({
  launchOptions,
  startTimeoutMs,
}: ChromiumOptions = {}): BrowserEngine {
  return {
    name: 'chromium',
    engine: 'playwright',
    ...(launchOptions && {engineOptions: {launchOptions}}),
    vitals: ['FCP', 'LCP', 'CLS', 'TTFB', 'INP'],
    check: ({env, options, signal}) =>
      checkChromium(
        env,
        isPlainObject(options.launchOptions) ? options.launchOptions : {},
        signal,
        startTimeoutMs,
      ),
  };
}

/** The browsers of the package. Default: Chromium only. */
export function browsersOf(config: LoadTestConfig): BrowserEngine[] {
  return config.artillery?.browsers ?? [chromium()];
}

/** The options of the Artillery engine of `browser`, as its script and its check use them. */
export function engineOptionsOf(
  browser: BrowserEngine,
  defaults: ArtilleryConfig | undefined,
): Record<string, unknown> {
  const own: unknown = (
    defaults?.engines as Record<string, unknown> | undefined
  )?.[browser.engine];
  return {...(isPlainObject(own) ? own : {}), ...browser.engineOptions};
}
