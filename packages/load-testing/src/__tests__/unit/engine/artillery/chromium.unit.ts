// Copyright (c) 2026 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {expect} from '@loopback/testlab';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {checkChromium} from '../../../../engine/artillery/chromium';
import {ConfigError} from '../../../../errors';

describe('checkChromium', () => {
  it('rejects with the reason of an aborted signal', async () => {
    const reason = new Error('stopped by the user');

    await expect(
      checkChromium(process.env, {}, AbortSignal.abort(reason)),
    ).to.be.rejectedWith(reason);
  });

  it('launches Chromium with the launch options, and names the path that fails', async () => {
    const executablePath = '/no/such/dir/chromium';

    const err = await checkChromium(process.env, {executablePath}).then(
      () => undefined,
      (error: unknown) => error,
    );

    expect(err).to.be.instanceOf(ConfigError);
    expect((err as ConfigError).message).to.containEql(executablePath);
  }).timeout(30_000);

  describe('with a child process that the test watches', () => {
    let dir: string;
    beforeEach(() => {
      dir = fs.mkdtempSync(path.join(os.tmpdir(), 'load-testing-chromium-'));
    });
    afterEach(() => fs.rmSync(dir, {recursive: true}));

    it('keeps the launch options out of the arguments of the child', async () => {
      const argvFile = path.join(dir, 'argv.json');
      const preload = path.join(dir, 'preload.js');
      fs.writeFileSync(
        preload,
        `require('fs').writeFileSync(${JSON.stringify(argvFile)}, JSON.stringify(process.execArgv));`,
      );
      const env = {...process.env, NODE_OPTIONS: `--require ${preload}`};
      const executablePath = '/no/such/dir/chromium';

      const err = await checkChromium(env, {
        executablePath,
        proxy: {server: 'http://proxy', password: 's3cret-password'},
      }).then(
        () => undefined,
        (error: unknown) => error,
      );

      expect(fs.readFileSync(argvFile, 'utf8')).not.containEql(
        's3cret-password',
      );
      // The child still got the options.
      expect((err as ConfigError).message).to.containEql(executablePath);
    }).timeout(30_000);

    it('keeps the launch options out of the environment of Chromium', async () => {
      const seenFile = path.join(dir, 'seen.txt');
      const executablePath = path.join(dir, 'chromium');
      fs.writeFileSync(
        executablePath,
        `#!/bin/sh\nif [ -z "$LOAD_TESTS_LAUNCH_OPTIONS" ]; then echo unset; else echo set; fi > ${seenFile}\nexit 1\n`,
        {mode: 0o755},
      );

      await checkChromium(process.env, {
        executablePath,
        proxy: {server: 'http://proxy', password: 's3cret-password'},
      }).catch(() => undefined);

      expect(fs.readFileSync(seenFile, 'utf8').trim()).to.equal('unset');
    }).timeout(30_000);

    it('says that Chromium did not start in time, when the timeout kills the child', async () => {
      const executablePath = path.join(dir, 'chromium');
      fs.writeFileSync(executablePath, '#!/bin/sh\nexec sleep 30\n', {
        mode: 0o755,
      });

      const err = await checkChromium(
        process.env,
        {executablePath},
        undefined,
        1000,
      ).then(
        () => undefined,
        (error: unknown) => error,
      );

      expect(err).to.be.instanceOf(ConfigError);
      expect((err as ConfigError).problems).to.deepEqual([
        'Chromium did not start in 1 s.',
      ]);
    }).timeout(30_000);
  });
});
