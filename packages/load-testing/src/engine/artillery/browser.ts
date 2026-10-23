// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import type {PlaywrightEngineScenarioTestFunction, VUEvents} from 'artillery';
import {errorMessage} from '../../errors';
import {flowName, STEP, WALL_CLOCK_STEP} from '../../report/names';
import {registeredIn} from '../../scenario/builder';
import {labelOf} from '../../scenario/label';
import type {BrowserFlow, BrowserPage, StepOptions, Vars} from '../../types';

/** A test function that the Playwright engine of Artillery calls. */
type TestFunction = Exclude<PlaywrightEngineScenarioTestFunction, string>;

/**
 * The function that the Playwright engine calls for each virtual user of the
 * browser scenario `label`. It loads `file` on its first call, so that the
 * worker loads the scenario only when the load starts. It records the time of
 * the whole flow as `browser.flow.<label>`. `runVars` gives a new copy of
 * the vars of the run for each virtual user.
 */
export function browserTestFunction(
  file: string,
  label: string,
  runVars: () => Vars,
): TestFunction {
  let flow: BrowserFlow | undefined;
  return async (page, _context, events) => {
    flow ??= flowIn(file, label);
    const start = Date.now();
    await flow({
      page,
      step: (name, action, options) =>
        timeStep(page, events, name, action, options),
      vars: runVars(),
    });
    events.emit('histogram', flowName(label), Date.now() - start);
  };
}

/**
 * Times one step of a flow as `browser.step.<name>`. With `endWhenVisible`,
 * the step ends at the first frame where that element is visible, so the
 * waits of an assertion in the action do not count. An element that is
 * visible before the action fails the user, because the step would end at
 * once. Without `endWhenVisible`, the step takes the time of its whole
 * action, and the counter `browser.step_wall_clock.<name>` marks it.
 */
async function timeStep(
  page: BrowserPage,
  events: VUEvents,
  name: string,
  action: () => unknown,
  options: StepOptions = {},
): Promise<void> {
  const selector = options.endWhenVisible;
  if (selector === undefined) {
    const start = Date.now();
    await action();
    events.emit('histogram', `${STEP}${name}`, Date.now() - start);
    events.emit('counter', `${WALL_CLOCK_STEP}${name}`, 1);
    return;
  }
  if ((await page.evaluate(visibleAt, selector)) > 0) {
    throw new Error(`'${selector}' is visible before the action`);
  }
  const start = Date.now();
  // Checks the element on each animation frame, from before the action.
  const shown = page.waitForFunction(visibleAt, selector);
  // When the action fails first, its error wins, and this one must not stay unhandled.
  shown.catch(() => undefined);
  await action();
  const handle = await shown.catch((err: unknown) => {
    const firstLine = errorMessage(err).split('\n')[0];
    throw new Error(
      `'${selector}' is not visible after the action of step ${name}: ${firstLine}`,
      {cause: err},
    );
  });
  // Playwright keeps a handle in the page until it is disposed.
  let end: number;
  try {
    end = await handle.jsonValue();
  } finally {
    await handle.dispose();
  }
  events.emit('histogram', `${STEP}${name}`, end - start);
}

/** The part of the DOM that `visibleAt` uses. */
type PageWindow = {
  document: {querySelector(selector: string): PageElement | null};
  getComputedStyle(element: PageElement): {visibility: string};
};
type PageElement = {getBoundingClientRect(): {width: number; height: number}};

/**
 * Runs in the page. Gives the time of the page when the element is visible
 * by the rule of Playwright, a box that is not empty and not hidden, and 0
 * when it is not.
 */
function visibleAt(selector: string): number {
  const win = globalThis as unknown as PageWindow;
  const element = win.document.querySelector(selector);
  if (element === null) return 0;
  const {width, height} = element.getBoundingClientRect();
  const visible =
    width > 0 &&
    height > 0 &&
    win.getComputedStyle(element).visibility === 'visible';
  return visible ? Date.now() : 0;
}

/** The flow of the browser scenario `label`, which `file` registers. */
function flowIn(file: string, label: string): BrowserFlow {
  const scenario = registeredIn(file).find(found => labelOf(found) === label);
  if (scenario?.browser === undefined) {
    throw new Error(`${file} registers no browser scenario "${label}"`);
  }
  return scenario.browser.flow;
}
