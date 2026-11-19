// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {USER, usersFileOf, runMain} from '../helpers';

type Env = Record<string, string | undefined>;

/** A `config.ts` option `engine` that does not start Artillery. */
const FAKE_ENGINE = `engine: {
  name: 'fake',
  run: async ({endpointIds}) => ({
    endpoints: new Map(endpointIds.map(id => [id, {count: 100, failed: 0, p95: 50}])),
    hookErrors: 0,
    vusers: {started: 3, completed: 3, failed: 0},
    seconds: 1,
  }),
}`;

describe('main --since', () => {
  const usersFile = usersFileOf([USER]);
  const builder = JSON.stringify(require.resolve('../../scenario/builder'));
  /** A login that cannot work: a run that logs in fails. */
  const ENV: Env = {
    LOAD_TESTS_BASE_URL: 'http://127.0.0.1:1',
    LOAD_TESTS_USERS_FILE: usersFile,
    LOAD_TESTS_CLIENT_ID: 'c',
    LOAD_TESTS_CLIENT_SECRET: 's',
    CI: undefined,
  };
  /** An environment of a run that does not log in. */
  const NO_LOGIN: Env = {...ENV, LOAD_TESTS_USERS_FILE: undefined};
  const PKG = 'facades/a';
  const LOAD = `${PKG}/src/__tests__/load`;
  let repo: string;

  const git = (...args: string[]) =>
    execFileSync('git', args, {cwd: repo, stdio: 'pipe'});
  const write = (file: string, content = 'x') => {
    fs.mkdirSync(path.dirname(path.join(repo, file)), {recursive: true});
    fs.writeFileSync(path.join(repo, file), content);
  };
  const commit = () => {
    git('add', '-A');
    git('commit', '-q', '-m', 'm');
  };
  const selection = () =>
    JSON.parse(
      fs.readFileSync(path.join(repo, LOAD, '.out/selection.json'), 'utf8'),
    );
  /** Runs the package of the repo against the commit before the last one. */
  const since = (env: Env = NO_LOGIN) =>
    runMain(['run', path.join(repo, PKG), '--since', 'HEAD~1'], env);

  /** Writes a scenario file as source and as built file. */
  const scenarioFile = (name: string, body: string) => {
    write(`${LOAD}/${name}.load.ts`, body);
    write(
      `${PKG}/dist/__tests__/load/${name}.load.js`,
      `const {load} = require(${builder});\n${body}`,
    );
  };

  beforeEach(() => {
    repo = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'since-')));
    git('init', '-q', '-b', 'main');
    git('config', 'user.email', 't@t');
    git('config', 'user.name', 't');
    git('config', 'commit.gpgsign', 'false');
    write('package.json', '{"workspaces":["facades/*"]}');
    write(`${PKG}/package.json`, '{}');
    write(`${LOAD}/config.ts`);
    write(
      `${PKG}/dist/__tests__/load/config.js`,
      `exports.default = {phases: [{arrivalRate: 3, duration: 1}], thresholds: {default: {}}, runAllWhen: ['packages/core/**'], ${FAKE_ENGINE}};`,
    );
    write('services/deal/src/deal.ts');
    write('services/other/src/other.ts');
    write('packages/core/src/core.ts');
    write('docs/readme.md');
    scenarioFile(
      's',
      `load.it('lists deals', [load.get('/a')], {covers: ['services/deal/src/**']});
load.it('lists others', [load.get('/b')], {covers: ['services/other/src/**']});`,
    );
    scenarioFile(
      't',
      `load.it('third', [load.get('/c')], {covers: ['services/other/src/**']});`,
    );
    commit();
  });

  afterEach(() => fs.rmSync(repo, {recursive: true, force: true}));

  it('runs only the scenarios that cover a changed file, and says why', async () => {
    write('services/deal/src/deal.ts', 'y');
    commit();

    const {code, out} = await since();

    expect(code).to.equal(0);
    expect(out).to.match(
      /selected: lists deals \(covers: services\/deal\/src\/deal\.ts matched services\/deal\/src\/\*\*\)/,
    );
    expect(out).to.match(/not selected: lists others/);
    expect(out).to.match(/^lists deals$/m);
    expect(out).not.to.match(/^lists others$/m);
  });

  it('writes selection.json with the state of each scenario', async () => {
    write('services/deal/src/deal.ts', 'y');
    commit();

    await since();

    const saved = selection();
    expect(saved.ref).to.equal('HEAD~1');
    expect(saved.changedFiles).to.deepEqual(['services/deal/src/deal.ts']);
    expect(saved.nothingSelected).to.be.false();
    expect(
      saved.scenarios.map((s: {scenario: string; state: string}) => [
        s.scenario,
        s.state,
      ]),
    ).to.deepEqual([
      ['lists deals', 'selected'],
      ['lists others', 'not selected'],
      ['third', 'not selected'],
    ]);
  });

  it('gives 0 and does not log in or run when no scenario is selected', async () => {
    write('docs/readme.md', 'y');
    commit();

    const {code, out} = await since(ENV);

    expect(code).to.equal(0);
    expect(out).to.match(/No scenario is selected, so nothing runs\./);
    expect(out).not.to.match(/Results/);
    expect(selection().nothingSelected).to.be.true();
  });

  it('selects every scenario when a runAllWhen pattern matches', async () => {
    write('packages/core/src/core.ts', 'y');
    commit();

    await since();

    expect(
      selection().scenarios.map((s: {state: string}) => s.state),
    ).to.deepEqual(['selected', 'selected', 'selected']);
  });

  it('selects every scenario when a file of the load folder that is not a scenario file changes', async () => {
    write(`${LOAD}/config.ts`, 'y');
    commit();

    await since();

    expect(
      selection().scenarios.map((s: {state: string}) => s.state),
    ).to.deepEqual(['selected', 'selected', 'selected']);
  });

  it('selects every scenario when the package.json of the root changes', async () => {
    write('package.json', '{"workspaces":["facades/*"],"x":1}');
    commit();

    await since();

    expect(selection().nothingSelected).to.be.false();
    expect(selection().scenarios[0].reason).to.match(/^run all: package\.json/);
  });

  it('selects the scenarios of a scenario file that changed, and no others', async () => {
    scenarioFile(
      't',
      `load.it('third', [load.get('/c')], {covers: ['services/other/src/**']});\n`,
    );
    commit();

    await since();

    expect(
      selection().scenarios.map((s: {state: string}) => s.state),
    ).to.deepEqual(['not selected', 'not selected', 'selected']);
  });

  it('lets .skip win over a match', async () => {
    scenarioFile(
      't',
      `load.it.skip('third', [load.get('/c')], {covers: ['services/other/src/**']});`,
    );
    commit();
    write('services/other/src/other.ts', 'y');
    commit();

    await since();

    const states = selection().scenarios.map(
      (s: {scenario: string; state: string}) => [s.scenario, s.state],
    );
    expect(states).to.containEql(['third', 'skipped']);
    expect(states).to.containEql(['lists others', 'selected']);
  });

  it('warns about a changed file of the package that no scenario covers', async () => {
    write(`${PKG}/src/new.controller.ts`);
    commit();

    const {code, out} = await since();

    expect(code).to.equal(0);
    expect(out).to.match(
      /no scenario covers them[^]*facades\/a\/src\/new\.controller\.ts/,
    );
    expect(selection().uncoveredFiles).to.deepEqual([
      'facades/a/src/new.controller.ts',
    ]);
  });

  it('stops with 1 for a scenario without covers', async () => {
    scenarioFile('t', `load.it('third', [load.get('/c')]);`);
    commit();

    const {code, out} = await since();

    expect(code).to.equal(1);
    expect(out).to.match(/third: has no covers/);
  });

  it('stops with 1 for a covers pattern that matches no file', async () => {
    scenarioFile(
      't',
      `load.it('third', [load.get('/c')], {covers: ['services/gone/**']});`,
    );
    commit();

    const {code, out} = await since();

    expect(code).to.equal(1);
    expect(out).to.match(
      /third: covers "services\/gone\/\*\*" matches no file/,
    );
  });

  // One test for each file: a built scenario file is cached by `require`.
  for (const file of ['facades/a/package.json', 'package-lock.json']) {
    it(`selects every scenario when ${file} changes`, async () => {
      write(file, '{"v":2}');
      commit();

      await since();

      expect(
        selection().scenarios.map((s: {state: string}) => s.state),
      ).to.deepEqual(['selected', 'selected', 'selected']);
    });
  }

  it('does not warn about a changed file when two files trigger a full run', async () => {
    write('packages/core/src/core.ts', 'y');
    write(`${PKG}/package.json`, '{"v":2}');
    commit();

    await since();

    expect(selection().uncoveredFiles).to.deepEqual([]);
  });

  it('does not select for a file under .out', async () => {
    write(`${LOAD}/.out/selection.json`, 'y');
    commit();

    await since();

    expect(selection().nothingSelected).to.be.true();
  });

  it('writes the merge-base and the head in selection.json', async () => {
    write('docs/readme.md', 'y');
    commit();

    await since();

    const rev = (ref: string) => git('rev-parse', ref).toString().trim();
    expect(selection().mergeBase).to.equal(rev('HEAD~1'));
    expect(selection().head).to.equal(rev('HEAD'));
  });

  it('removes the selection.json of an earlier run when a run has no --since', async () => {
    write('docs/readme.md', 'y');
    commit();
    await since();
    expect(
      fs.existsSync(path.join(repo, LOAD, '.out/selection.json')),
    ).to.be.true();

    await runMain(['run', path.join(repo, PKG)], NO_LOGIN);

    expect(
      fs.existsSync(path.join(repo, LOAD, '.out/selection.json')),
    ).to.be.false();
  });

  it('still stops for an only when CI is set', async () => {
    scenarioFile(
      't',
      `load.it('third', [load.get('/c')], {only: true, covers: ['services/other/src/**']});`,
    );
    commit();

    const {code, out} = await since({...NO_LOGIN, CI: 'true'});

    expect(code).to.equal(1);
    expect(out).to.match(/only/);
  });

  it('takes covers of a browser scenario', async () => {
    scenarioFile(
      'b',
      `load.browser('opens a page', {covers: ['services/deal/src/**']}, async () => undefined);`,
    );
    write('services/deal/src/deal.ts', 'y');
    commit();

    await since();

    const entry = selection().scenarios.find((s: {scenario: string}) =>
      s.scenario.includes('opens a page'),
    );
    expect(entry.state).to.equal('selected');
  });

  it('does not let a wildcard match a dotfile', async () => {
    write('services/deal/src/.hidden', 'y');
    commit();

    await since();

    expect(selection().nothingSelected).to.be.true();
  });

  it('refuses a ref that starts with a dash', async () => {
    const {code, out} = await runMain(
      ['run', path.join(repo, PKG), '--since=--all'],
      NO_LOGIN,
    );

    expect(code).to.equal(1);
    expect(out).to.match(/must not start with "-"/);
  });

  it('stops with 1 for a ref that git does not know', async () => {
    const {code, out} = await runMain(
      ['run', path.join(repo, PKG), '--since', 'no-such-ref'],
      NO_LOGIN,
    );

    expect(code).to.equal(1);
    expect(out).to.match(/--since no-such-ref/);
  });

  it('runs every scenario, with no covers needed, without --since', async () => {
    scenarioFile('t', `load.it('third', [load.get('/c')]);`);

    const {code, out} = await runMain(['run', path.join(repo, PKG)], NO_LOGIN);

    expect(code).to.equal(0);
    expect(out).to.match(/^third$/m);
  });

  it('selects a scenario that covers a path with glob characters', async () => {
    write('routes/[id]/page.ts');
    scenarioFile(
      'u',
      `load.it('by id', [load.get('/d')], {covers: ['routes/[id]/page.ts']});`,
    );
    commit();
    write('routes/[id]/page.ts', 'y');
    commit();

    await since();

    expect(
      selection().scenarios.find(
        (s: {scenario: string}) => s.scenario === 'by id',
      ).state,
    ).to.equal('selected');
  });

  it('does not warn about the file of a scenario that is skipped', async () => {
    scenarioFile('t', `load.it.skip('third', [load.get('/c')]);`);
    commit();
    write(`${LOAD}/t.load.ts`, 'y');
    commit();

    await since();

    expect(selection().uncoveredFiles).to.deepEqual([]);
  });

  it('refuses --since for a command other than run', async () => {
    const {code, out} = await runMain(
      ['report', path.join(repo, PKG), '--since', 'HEAD'],
      NO_LOGIN,
    );

    expect(code).to.equal(1);
    expect(out).to.match(/--since works only with the run command/);
  });
});
