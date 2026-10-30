// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {artillery} from '../../../../engine/artillery';
import {ConfigError, ScenarioError} from '../../../../errors';
import {
  chromium,
  type BrowserEngine,
} from '../../../../engine/artillery/browsers';

describe('artillery engine', () => {
  let pkgDir: string;
  beforeEach(() => {
    pkgDir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-engine-'));
  });
  afterEach(() => fs.rmSync(pkgDir, {recursive: true}));

  it('checks Chromium with the launchOptions of the artillery config', async () => {
    const executablePath = '/no/such/dir/chromium';

    const err = await artillery()
      .run({
        pkgDir,
        scenario: {
          name: 'open',
          browser: {
            flow: async () => undefined,
            file: path.join(pkgDir, 'b.js'),
          },
        },
        config: {
          phases: [],
          artillery: {
            config: {engines: {playwright: {launchOptions: {executablePath}}}},
          },
        },
        phases: [{duration: 1, arrivalRate: 1}],
        runVars: {},
        endpointIds: [],
        baseUrl: 'http://localhost:4200',
        signal: new AbortController().signal,
      })
      .then(
        () => undefined,
        (error: unknown) => error,
      );

    expect(err).to.be.instanceOf(ConfigError);
    expect((err as ConfigError).message).to.containEql(executablePath);
  }).timeout(30_000);

  describe('the check of the browser of a scenario', () => {
    const run = (browserName: string | undefined, browsers: BrowserEngine[]) =>
      artillery().run({
        pkgDir,
        scenario: {
          name: 'open',
          browser: {
            flow: async () => undefined,
            file: path.join(pkgDir, 'b.js'),
            browserName,
          },
        },
        config: {
          phases: [],
          artillery: {
            config: {engines: {other: {launchOptions: {slowMo: 5}}}},
            browsers,
          },
        },
        phases: [{duration: 1, arrivalRate: 1}],
        runVars: {},
        endpointIds: [],
        baseUrl: 'http://localhost:4200',
        signal: new AbortController().signal,
      });
    const stops = new Error('stop here');

    it('runs the check of the browser that the scenario names, with the engine options of the package and of the browser', async () => {
      let seen: unknown;
      const other: BrowserEngine = {
        name: 'other',
        engine: 'other',
        engineOptions: {headless: false},
        vitals: [],
        check: async ({options}) => {
          seen = options;
          throw stops;
        },
      };
      const mine: BrowserEngine = {...other, name: 'mine', check: undefined};

      const err = await run('other', [mine, other]).catch(e => e);

      expect(err).to.equal(stops);
      expect(seen).to.eql({launchOptions: {slowMo: 5}, headless: false});
    });

    it('uses the first browser when the scenario names none', async () => {
      const first: BrowserEngine = {
        name: 'first',
        engine: 'other',
        vitals: [],
        check: async () => {
          throw stops;
        },
      };

      expect(await run(undefined, [first]).catch(e => e)).to.equal(stops);
    });

    it('stops with a ScenarioError when the scenario names a browser that the config does not list', async () => {
      const err = await run('safari', [chromium()]).catch(e => e);

      expect(err).to.be.instanceOf(ScenarioError);
      expect(err.message).to.containEql('has no browser "safari"');
    });
  });

  it('lets browser vars hold text that looks like a template', async () => {
    const err = await artillery()
      .run({
        pkgDir,
        scenario: {
          name: 'open',
          browser: {
            flow: async () => undefined,
            file: path.join(pkgDir, 'b.js'),
          },
        },
        config: {
          phases: [],
          artillery: {
            config: {
              engines: {
                playwright: {
                  launchOptions: {executablePath: '/no/such/dir/chromium'},
                },
              },
            },
          },
        },
        phases: [{duration: 1, arrivalRate: 1}],
        runVars: {password: 'pa$$word', t: '{{x}}'},
        endpointIds: [],
        baseUrl: 'http://localhost:4200',
        signal: new AbortController().signal,
      })
      .then(
        () => undefined,
        (error: unknown) => error,
      );

    expect(err).to.be.instanceOf(ConfigError);
  }).timeout(30_000);
});
