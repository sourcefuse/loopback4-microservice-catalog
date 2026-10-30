// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type {VUEvents} from 'artillery';
import {browserTestFunction} from '../../../../engine/artillery/browser';
import type {BrowserPage, Vars} from '../../../../types';

const builder = JSON.stringify(require.resolve('../../../../scenario/builder'));

/** What the fake events emitter got, in order. */
type Emitted = [type: string, name: string, value: number][];

describe('browserTestFunction', () => {
  const dirs: string[] = [];
  after(() => dirs.forEach(dir => fs.rmSync(dir, {recursive: true})));

  /** A load file that registers the browser scenario `flow` with this body. */
  function flowFile(body: string): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'browser-flow-'));
    dirs.push(dir);
    const file = path.join(dir, 'flow.js');
    fs.writeFileSync(
      file,
      `const {load} = require(${builder});
load.browser('flow', async ({step, vars}) => {${body}});`,
    );
    return file;
  }

  /** A page whose only methods are the two that a step with `endWhenVisible` calls. */
  const fakePage = (
    waitForFunction: () => Promise<unknown> = () => new Promise(() => {}),
  ) =>
    ({
      evaluate: async () => 0,
      waitForFunction,
    }) as unknown as BrowserPage;

  const fakeEvents = () => {
    const emitted: Emitted = [];
    const events = {
      emit: (type: string, name: string, value: number) => {
        emitted.push([type, name, value]);
      },
    } as unknown as VUEvents;
    return {events, emitted};
  };

  /** Runs the flow of `file` once, as the engine does for a virtual user. */
  const runOnce = (
    file: string,
    page: BrowserPage,
    events: VUEvents,
    label = 'flow',
    runVars: () => Vars = () => ({}),
  ) =>
    browserTestFunction(file, label, runVars)(
      page,
      {} as never,
      events,
      {} as never,
    );

  it('fails the step with the error of the action, and leaves no unhandled rejection', async () => {
    const file = flowFile(
      `await step('go', async () => { throw new Error('action failed'); }, {endWhenVisible: '#done'});`,
    );
    const lateRejection = () =>
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('late')), 5),
      );
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => unhandled.push(reason);
    process.on('unhandledRejection', onUnhandled);

    try {
      await expect(
        runOnce(file, fakePage(lateRejection), fakeEvents().events),
      ).to.be.rejectedWith('action failed');
      await new Promise(resolve => setTimeout(resolve, 50));
    } finally {
      process.off('unhandledRejection', onUnhandled);
    }

    expect(unhandled).to.deepEqual([]);
  });

  it('names the selector and the step when the end element never shows', async () => {
    const file = flowFile(
      `await step('go', async () => {}, {endWhenVisible: '#done'});`,
    );
    const timeout = () =>
      Promise.reject(
        new Error(
          'page.waitForFunction: Timeout 30000ms exceeded.\nCall log:\n  - waiting',
        ),
      );

    await expect(
      runOnce(file, fakePage(timeout), fakeEvents().events),
    ).to.be.rejectedWith(
      "'#done' is not visible after the action of step go: page.waitForFunction: Timeout 30000ms exceeded.",
    );
  });

  it('fails the user, and runs nothing, when the end element is visible before the action', async () => {
    const file = flowFile(
      `await step('go', async () => { globalThis.actionRan = true; }, {endWhenVisible: '#done'});`,
    );
    let waited = false;
    const page = {
      evaluate: async () => Date.now(),
      waitForFunction: async () => {
        waited = true;
      },
    } as unknown as BrowserPage;
    delete (globalThis as {actionRan?: boolean}).actionRan;

    await expect(runOnce(file, page, fakeEvents().events)).to.be.rejectedWith(
      "'#done' is visible before the action",
    );

    expect(waited).to.be.false();
    expect((globalThis as {actionRan?: boolean}).actionRan).to.be.undefined();
  });

  it('times the step from before the action to the frame that shows the element', async () => {
    const file = flowFile(
      `await step('go', async () => {}, {endWhenVisible: '#done'});`,
    );
    const before = Date.now();
    const handle = {
      jsonValue: async () => before + 250,
      dispose: async () => undefined,
    };
    const {events, emitted} = fakeEvents();
    const clock = sinon.useFakeTimers(before);

    try {
      await runOnce(
        file,
        fakePage(async () => handle),
        events,
      );
    } finally {
      clock.restore();
    }

    expect(emitted[0]).to.deepEqual(['histogram', 'browser.step.go', 250]);
  });

  it('disposes the handle of the wait once, and still emits the metric', async () => {
    const file = flowFile(
      `await step('go', async () => {}, {endWhenVisible: '#done'});`,
    );
    let disposed = 0;
    const handle = {
      jsonValue: async () => Date.now(),
      dispose: async () => {
        disposed += 1;
      },
    };
    const {events, emitted} = fakeEvents();

    await runOnce(
      file,
      fakePage(async () => handle),
      events,
    );

    expect(disposed).to.equal(1);
    expect(emitted[0].slice(0, 2)).to.deepEqual([
      'histogram',
      'browser.step.go',
    ]);
  });

  it('emits the wall-clock counter for a step without endWhenVisible', async () => {
    const file = flowFile(`await step('save', async () => {});`);
    const {events, emitted} = fakeEvents();

    await runOnce(file, fakePage(), events);

    expect(emitted.map(([type, name]) => [type, name])).to.deepEqual([
      ['histogram', 'browser.step.save'],
      ['counter', 'browser.step_wall_clock.save'],
      ['histogram', 'browser.flow.flow'],
    ]);
  });

  it('gives each flow a fresh copy of the vars of the run', async () => {
    const file = flowFile(
      `globalThis.seen = [...(globalThis.seen ?? []), vars.accessToken]; vars.accessToken = 'changed';`,
    );
    const runVars = () => ({accessToken: 'abc'});
    const run = browserTestFunction(file, 'flow', runVars);
    delete (globalThis as {seen?: unknown}).seen;

    await run(fakePage(), {} as never, fakeEvents().events, {} as never);
    await run(fakePage(), {} as never, fakeEvents().events, {} as never);

    expect((globalThis as {seen?: unknown}).seen).to.deepEqual(['abc', 'abc']);
  });

  it('throws when the file registers no browser scenario with the label', async () => {
    const file = flowFile('');

    await expect(
      runOnce(file, fakePage(), fakeEvents().events, 'other'),
    ).to.be.rejectedWith(`${file} registers no browser scenario "other"`);
  });
});
