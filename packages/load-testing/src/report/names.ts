// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
 * The names of the browser metrics. A worker of Artillery loads this module
 * for the names, so it must not import the judge of the report.
 */

/** The prefix of the time of each step in the report. */
export const STEP = 'browser.step.';

/** The counter of a step that has no end element: `browser.step_wall_clock.<name>`. */
export const WALL_CLOCK_STEP = 'browser.step_wall_clock.';

/** The report name of the flow total of a scenario. */
export function flowName(label: string): string {
  return `browser.flow.${label}`;
}

/** The report name of a Web Vital of a scenario. The Playwright engine sets it. */
export function pageName(vital: string, label: string): string {
  return `browser.page.${vital}.${label}`;
}
