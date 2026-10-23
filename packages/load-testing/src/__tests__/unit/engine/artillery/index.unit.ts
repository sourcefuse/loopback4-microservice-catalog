// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {artillery} from '../../../../engine/artillery';
import {ConfigError} from '../../../../errors';

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
