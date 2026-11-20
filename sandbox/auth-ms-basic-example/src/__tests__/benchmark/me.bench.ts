import {bench} from '@sourceloop/benchmarking';
import {BenchApp, setupBenchApplication} from '../acceptance/test-helper';

bench.describe('Auth', function (this: Mocha.Suite) {
  this.timeout(30000);
  let bootedApp: BenchApp;

  before(async () => {
    bootedApp = await setupBenchApplication();
  });

  after(async () => {
    await bootedApp.app.stop();
  });

  bench.it('current user', async () => {
    await bootedApp.client
      .get('/auth/me')
      .set('authorization', `Bearer ${bootedApp.token}`)
      .expect(200);
  });
});
