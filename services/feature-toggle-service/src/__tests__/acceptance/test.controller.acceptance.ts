import {Client} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {TestingApplication} from '../fixtures/application';
import {setupApplication} from '../fixtures/test-helper';

describe('Test Controller', async () => {
  let app: TestingApplication;
  let client: Client;
  const testUser = {
    id: '1',
    tenantId: 'tenant_id',
    userTenantId: 'user_tenant_id',
  };

  const token = jwt.sign(testUser, 'kdskssdkdfs', {
    expiresIn: 180000,
    issuer: 'sf',
  });

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  after(async () => app.stop());

  describe('All 3 strategies are passed in decorator', async () => {
    it('returns success(200) if all strategies are enabled', async () => {
      await client
        .get(`/all_strategies_enabled`)
        .set('authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('returns forbidder(403) if system strategy is disabled', async () => {
      await client
        .get(`/system_strategy_is_off`)
        .set('authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('returns forbidder(403) if tenant strategy is disabled', async () => {
      await client
        .get(`/tenant_strategy_is_off`)
        .set('authorization', `Bearer ${token}`)
        .expect(403);
    });

    it('returns forbidder(403) if user strategy is disabled', async () => {
      await client
        .get(`/user_strategy_is_off`)
        .set('authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  it('returns success(200) if no strategy is passed in decorator', async () => {
    await client
      .get(`/skip_all_strategy_checks`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });
});
