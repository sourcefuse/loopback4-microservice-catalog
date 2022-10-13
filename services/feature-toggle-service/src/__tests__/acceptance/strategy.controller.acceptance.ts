// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import {StrategyRepository} from '../../repositories';
import {TestingApplication} from '../fixtures/application';
import * as jwt from 'jsonwebtoken';
import {setupApplication} from '../fixtures/test-helper';
import {StrategyKey} from '../../enums';
import {Strategy} from '../../models';

describe('Strategy Contrtoller', () => {
  let app: TestingApplication;
  let client: Client;
  let strategyRepository: StrategyRepository;

  const testUser = {
    id: 1,
    username: 'test_user',
    password: 'test_password',
    tenantId: 'tenant_id',
    userTenantId: 'user_tenant_id',
    permissions: [
      'CreateStrategy',
      'ViewStrategy',
      'UpdateStrategy',
      'DeleteStrategy',
    ],
  };
  const basePath = '/strategies';

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

  it('it gives 200 and a added strategy as response', async () => {
    const response = await client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(
        new Strategy({
          id: '3',
          name: StrategyKey.User,
          key: StrategyKey.User,
          createdBy: 'user_tenant_id',
          modifiedBy: 'user_tenant_id',
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
      .to.have.property('name')
      .to.be.equal(StrategyKey.System);
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

  it('will update the strategy where id matches and return 204', async () => {
    const strategyToUpdate = {
      createdBy: 'update_by',
    };
    await client
      .patch(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send(strategyToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.createdBy).to.be.equal('update_by');
  });

  it('will update all the strategy and return 200', async () => {
    const strategyToUpdate = {
      createdBy: 'update_by',
      modifiedBy: 'update_by',
    };
    await client
      .patch(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send(strategyToUpdate)
      .expect(200);

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body[0]).to.have.properties(['createdBy']);
    expect(response.body[0].createdBy).to.be.equal('update_by');
  });

  it('delete the strategy by id and return 204', async () => {
    await client
      .del(`${basePath}/2`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  async function deleteMockData() {
    await strategyRepository.deleteAllHard();
  }

  async function givenRepositories() {
    strategyRepository = await app.getRepository(StrategyRepository);

    await strategyRepository.createAll([
      {
        id: '1',
        name: StrategyKey.System,
        key: StrategyKey.System,
        createdBy: 'user_tenant_id',
        modifiedBy: 'user_tenant_id',
      },
      {
        id: '2',
        name: StrategyKey.Tenant,
        key: StrategyKey.Tenant,
        createdBy: 'user_tenant_id',
        modifiedBy: 'user_tenant_id',
      },
    ]);
  }
});
