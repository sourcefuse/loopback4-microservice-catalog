// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {FeatureToggleRepository} from '../../repositories';
import {TestingApplication} from '../fixtures/application';
import * as jwt from 'jsonwebtoken';
import {setupApplication} from '../fixtures/test-helper';
import {StrategyKey} from '../../enums';
import {Test} from '../fixtures/test.enum';
import {FeatureToggle} from '../../models';

describe('Feature Toggle Contrtoller', () => {
  let app: TestingApplication;
  let client: Client;
  let featureToggleRepo: FeatureToggleRepository;

  const testUser = {
    id: 1,
    username: 'test_user',
    password: 'test_password',
    tenantId: 'tenant_id',
    userTenantId: 'user_tenant_id',
    permissions: [
      'ViewFeatureToggle',
      'CreateFeatureToggle',
      'UpdateFeatureToggle',
      'DeleteFeatureToggle',
    ],
  };
  const basePath = '/featuretoggles';

  const token = jwt.sign(testUser, 'kdskssdkdfs', {
    expiresIn: 180000,
    issuer: 'sf',
  });
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  before(givenRepositories);
  after(deleteMockData);
  after(async () => app.stop());

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);
    expect(response).to.have.property('error');
  });

  it('it gives 200 and a added toggle as response', async () => {
    const response = await client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(
        new FeatureToggle({
          id: '4',
          featureKey: Test.Feature1,
          strategyKey: StrategyKey.User,
          strategyEntityId: 'user_tenant_id',
          createdBy: 'user_tenant_id',
          modifiedBy: 'user_tenant_id',
          status: false,
        }),
      );
    expect(response.status).to.be.equal(200);
  });

  it('should return the count with status 200', async () => {
    const response = await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response).to.have.property('body').to.have.property('count');
  });

  it('will return all the values with status 200', async () => {
    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body[0])
      .to.have.property('featureKey')
      .to.be.equal(Test.Feature4);
  });

  it('will return where the id matches and status 200', async () => {
    const response = await client
      .get(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.property('id').to.be.equal('1');
  });

  it('will return 500 when the body is not send', async () => {
    await client
      .patch(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(500);
  });

  it('will update the toggle where id matches and return 204', async () => {
    const toggleToUpdate = {
      createdBy: 'update_by',
    };
    await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(toggleToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.createdBy).to.be.equal('update_by');
  });

  it('will update all the toggle and return 200', async () => {
    const toggleToUpdate = {
      createdBy: 'update_by',
      modifiedBy: 'update_by',
    };
    await client
      .patch(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send(toggleToUpdate)
      .expect(200);

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body[0]).to.have.properties(['createdBy']);
    expect(response.body[0].createdBy).to.be.equal('update_by');
  });

  it('delete the toggle by id and return 204', async () => {
    await client
      .del(`${basePath}/2`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  async function deleteMockData() {
    await featureToggleRepo.deleteAllHard();
  }

  async function givenRepositories() {
    featureToggleRepo = await app.getRepository(FeatureToggleRepository);

    await featureToggleRepo.createAll([
      {
        id: '1',
        featureKey: Test.Feature4,
        strategyKey: StrategyKey.System,
        strategyEntityId: Test.Feature4,
        createdBy: 'user_tenant_id',
        modifiedBy: 'user_tenant_id',
        status: false,
      },
      {
        id: '2',
        featureKey: Test.Feature3,
        strategyKey: StrategyKey.Tenant,
        strategyEntityId: 'tenant_id',
        createdBy: 'user_tenant_id',
        modifiedBy: 'user_tenant_id',
        status: false,
      },
      {
        id: '3',
        featureKey: Test.Feature2,
        strategyKey: StrategyKey.User,
        strategyEntityId: 'user_tenant_id',
        createdBy: 'user_tenant_id',
        modifiedBy: 'user_tenant_id',
        status: false,
      },
    ]);
  }
});
