// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ChildProcess, spawn} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {expect, sinon} from '@loopback/testlab';
import {
  artilleryBin,
  runCommand,
  runArtillery,
} from '../../../../engine/artillery/runner';
import report from '../../../fixtures/report.json';

describe('runArtillery', () => {
  // Artillery takes about 2 s to start and stop.
  it('fails when Artillery fails, and does not read the report of an earlier run', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-'));
    const script = path.join(dir, 's.json');
    const oldReport = path.join(dir, 's.report.json');
    fs.writeFileSync(script, '{}');
    fs.writeFileSync(oldReport, JSON.stringify(report));

    try {
      await expect(runArtillery(script, [], process.env)).to.be.rejectedWith(
        /Artillery stopped with code 1/,
      );
      expect(fs.existsSync(oldReport)).to.be.false();
    } finally {
      fs.rmSync(dir, {recursive: true});
    }
  }).timeout(30_000);
});

describe('artilleryBin', () => {
  it('resolves the Artillery of the library', () => {
    const root = path.dirname(
      path.dirname(path.dirname(require.resolve('artillery'))),
    );

    expect(artilleryBin()).to.equal(path.join(root, 'bin', 'run'));
    expect(fs.existsSync(artilleryBin())).to.be.true();
  });
});

describe('runCommand', () => {
  const node = process.execPath;
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-'));
  });
  afterEach(() => fs.rmSync(dir, {recursive: true}));

  /** Arguments for a command that writes its pid to a file, and then waits. */
  const waiting = (ignoreSigterm = false) => [
    '-e',
    `require('fs').writeFileSync(process.argv[1], String(process.pid));
${ignoreSigterm ? "process.on('SIGTERM', () => {});" : ''}
setInterval(() => {}, 1000);`,
    path.join(dir, 'pid'),
  ];

  async function startedPid(): Promise<number> {
    const file = path.join(dir, 'pid');
    for (let i = 0; i < 200; i++) {
      const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
      if (text) return Number(text);
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    throw new Error('the command did not start');
  }

  /**
   * True when the process runs. A zombie is gone: in a container whose PID 1
   * does not reap, a killed orphan stays a zombie, and `kill(pid, 0)` still
   * works for it. Where there is no `/proc`, the `kill` check is the answer.
   */
  function isRunning(pid: number): boolean {
    try {
      process.kill(pid, 0);
    } catch {
      return false;
    }
    try {
      const stat = fs.readFileSync(`/proc/${pid}/stat`, 'utf8');
      // The state is the first field after the last ")" (the name can hold one).
      return (
        stat.slice(stat.lastIndexOf(')') + 2, stat.lastIndexOf(')') + 3) !== 'Z'
      );
    } catch {
      return true;
    }
  }

  it('gives the exit code of the command', async () => {
    const exit = await runCommand(node, ['-e', 'process.exit(3)'], {
      env: process.env,
    });

    expect(exit).to.deepEqual({code: 3, signal: null});
  });

  it('rejects only after the command has exited, when the signal aborts', async () => {
    const controller = new AbortController();
    const done = runCommand(node, waiting(), {
      env: process.env,
      signal: controller.signal,
    }).then(
      () => 'resolved',
      (err: unknown) => err,
    );
    const pid = await startedPid();

    controller.abort(new Error('stop'));
    const outcome = await done;

    expect((outcome as Error).message).to.equal('stop');
    expect(isRunning(pid)).to.be.false();
  });

  it('kills a command that ignores SIGTERM, after the grace time', async () => {
    const controller = new AbortController();
    const done = runCommand(node, waiting(true), {
      env: process.env,
      signal: controller.signal,
      graceMs: 200,
    }).catch((err: unknown) => err);
    const pid = await startedPid();

    controller.abort(new Error('stop'));
    await done;

    expect(isRunning(pid)).to.be.false();
  }).timeout(10_000);

  it('stops a command at once when the signal has aborted already', async () => {
    const signal = AbortSignal.abort(new Error('early'));

    await expect(
      runCommand(node, waiting(), {env: process.env, signal}),
    ).to.be.rejectedWith('early');
  });

  it('does not keep a command that failed to start, for the kill on exit', async () => {
    await expect(
      runCommand(path.join(dir, 'no-such-command'), [], {env: process.env}),
    ).to.be.rejectedWith(/ENOENT/);
    const kill = sinon.stub(ChildProcess.prototype, 'kill');
    try {
      const listener = process
        .listeners('exit')
        .find(candidate => candidate.name === 'killRunningOnExit');
      expect(listener).to.be.a.Function();
      (listener as (code: number) => void)(0);

      expect(kill.called).to.be.false();
    } finally {
      kill.restore();
    }
  });

  describe('when the parent process ends', () => {
    const POLL_MS = 25;
    const GONE_LIMIT_MS = 5_000;
    /** Starts a long command with runCommand, and then ends in `ending`. */
    const parentScript = (ending: string) => `
const {runCommand} = require(${JSON.stringify(path.join(__dirname, '../../../../engine/artillery/runner'))});
const fs = require('fs');
const pidFile = process.argv[1];
runCommand(process.execPath, ['-e', 'require("fs").writeFileSync(process.argv[1], String(process.pid)); setInterval(() => {}, 1000);', pidFile], {env: process.env}).catch(() => {});
const wait = setInterval(() => {
  if (fs.existsSync(pidFile) && fs.readFileSync(pidFile, 'utf8')) {
    clearInterval(wait);
    ${ending}
  }
}, ${POLL_MS});
`;

    async function endsWithoutLeak(ending: string): Promise<void> {
      const pidFile = path.join(dir, 'pid');
      const parent = spawn(node, ['-e', parentScript(ending), pidFile], {
        stdio: 'ignore',
      });
      const exited = new Promise(resolve => parent.once('exit', resolve));
      let pid = 0;
      try {
        pid = await startedPid();
        await exited;
        for (
          let waited = 0;
          waited < GONE_LIMIT_MS && isRunning(pid);
          waited += POLL_MS
        ) {
          await new Promise(resolve => setTimeout(resolve, POLL_MS));
        }
        expect(isRunning(pid)).to.be.false();
      } finally {
        parent.kill('SIGKILL');
        if (pid && isRunning(pid)) process.kill(pid, 'SIGKILL');
      }
    }

    it('kills the command on process.exit', async () => {
      await endsWithoutLeak('process.exit(0);');
    }).timeout(15_000);

    it('kills the command on an uncaught exception', async () => {
      await endsWithoutLeak("throw new Error('boom');");
    }).timeout(15_000);
  });
});
