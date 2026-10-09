// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect, sinon} from '@loopback/testlab';
import type {ChildProcess} from 'node:child_process';
import {spawn} from 'node:child_process';
import path from 'node:path';
import {Cancellation} from '../../../run/cancel';

const SIGINT_EXIT_CODE = 130;
const SIGTERM_EXIT_CODE = 143;
const AFTER_GRACE_MS = 600;

/**
 * A process that prints `ready`, and then `aborted <exit code>` when its
 * Cancellation aborts. It stays alive, like a run that is cleaning up.
 */
const SCRIPT = `
const {Cancellation} = require(${JSON.stringify(path.join(__dirname, '../../../run/cancel'))});
const cancel = new Cancellation();
cancel.signal.addEventListener('abort', () => console.log('aborted ' + cancel.exitCode));
console.log('ready');
setInterval(() => undefined, 1000);
`;

describe('Cancellation', () => {
  let child: ChildProcess;
  let output = '';
  let exited: Promise<number | null>;

  async function waitFor(text: string): Promise<void> {
    for (let i = 0; i < 200 && !output.includes(text); i++) {
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    expect(output).to.containEql(text);
  }

  beforeEach(async () => {
    output = '';
    child = spawn(process.execPath, ['-e', SCRIPT]);
    child.stdout?.on('data', chunk => (output += chunk));
    exited = new Promise(resolve => child.once('exit', code => resolve(code)));
    await waitFor('ready');
  });

  afterEach(() => child.kill('SIGKILL'));

  it('aborts on the first SIGINT, and keeps the process alive', async () => {
    child.kill('SIGINT');

    await waitFor('aborted 130');
    expect(child.exitCode).to.be.null();
  });

  it('asks for exit code 143 after a SIGTERM', async () => {
    child.kill('SIGTERM');

    await waitFor('aborted 143');
  });

  it('asks for exit code 129 after a SIGHUP', async () => {
    child.kill('SIGHUP');

    await waitFor('aborted 129');
    expect(child.exitCode).to.be.null();
  });

  it('ends the process at once on a second signal after the grace time', async () => {
    child.kill('SIGINT');
    await waitFor('aborted 130');
    await new Promise(resolve => setTimeout(resolve, AFTER_GRACE_MS));

    child.kill('SIGINT');

    expect(await exited).to.equal(130);
  });
});

describe('Cancellation, a repeated signal', () => {
  let clock: sinon.SinonFakeTimers;
  let exit: sinon.SinonStub;
  let cancel: Cancellation;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
    exit = sinon.stub(process, 'exit');
    cancel = new Cancellation();
  });
  afterEach(() => {
    cancel.dispose();
    exit.restore();
    clock.restore();
  });

  it('ignores a second signal in the same tick, and keeps the code of the first', () => {
    process.emit('SIGINT');
    process.emit('SIGTERM');

    sinon.assert.notCalled(exit);
    expect(cancel.signal.aborted).to.be.true();
    expect(cancel.exitCode).to.equal(SIGINT_EXIT_CODE);
  });

  it('ends the process with the code of the first signal when the second comes 600 ms later', () => {
    process.emit('SIGTERM');
    clock.tick(AFTER_GRACE_MS);

    process.emit('SIGINT');

    sinon.assert.calledOnceWithExactly(exit, SIGTERM_EXIT_CODE);
  });

  it('ignores a signal 499 ms after the first, and ends the process at 500 ms', () => {
    process.emit('SIGINT');
    clock.tick(499);
    process.emit('SIGINT');
    sinon.assert.notCalled(exit);

    clock.tick(1);
    process.emit('SIGINT');

    sinon.assert.calledOnceWithExactly(exit, SIGINT_EXIT_CODE);
  });
});
