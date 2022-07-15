// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {Feature} from '../../models';
import {FeatureRepository} from '../../repositories';
import {TestingApplication} from '../fixtures/application';
import {setupApplication} from '../fixtures/test-helper';
import {Test} from '../fixtures/test.enum';

describe('Feature Contrtoller', () => {
  let app: TestingApplication;
  let client: Client;

  let featureRepo: FeatureRepository;

  const testUser = {
    id: 1,
    username: 'test_user',
    password: 'test_password',
    tenantId: 'tenant_id',
    userTenantId: 'user_tenant_id',
    permissions: [
      'CreateFeature',
      'ViewFeature',
      'UpdateFeature',
      'DeleteFeature',
    ],
  };
  const basePath = '/features';

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

  it('it gives 200 and a added feature as response', async () => {
    const response = await client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(
        new Feature({
          id: Test.Feature4,
          name: Test.Feature4,
          key: Test.Feature4,
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
      .to.be.equal(Test.Feature1);
  });

  it('will return where the id matches and status 200', async () => {
    const response = await client
      .get(`${basePath}/feature_1`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.property('name').to.be.equal(Test.Feature1);
  });

  it('will return 500 when the body is not send', async () => {
    await client
      .patch(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(500);
  });

  it('will update the feature where id matches and return 204', async () => {
    const featureToUpdate = {
      createdBy: 'update_by',
    };
    await client
      .patch(`${basePath}/feature_1`)
      .set('authorization', `Bearer ${token}`)
      .send(featureToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/feature_1`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body.createdBy).to.be.equal('update_by');
  });

  it('will update all the features and return 200', async () => {
    const featureToUpdate = {
      createdBy: 'update_by',
      modifiedBy: 'update_by',
    };
    await client
      .patch(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send(featureToUpdate)
      .expect(200);

    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body[0]).to.have.properties(['createdBy']);
    expect(response.body[0].createdBy).to.be.equal('update_by');
  });

  it('delete the feature by id and return 204', async () => {
    await client
      .del(`${basePath}/feature_2`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  async function deleteMockData() {
    await featureRepo.deleteAllHard();
  }

  async function givenRepositories() {
    featureRepo = await app.getRepository(FeatureRepository);

    await featureRepo.createAll([
      {
        id: Test.Feature1,
        name: Test.Feature1,
        key: Test.Feature1,
        createdBy: 'user_tenant_id',
        modifiedBy: 'user_tenant_id',
      },
      {
        id: Test.Feature2,
        name: Test.Feature2,
        key: Test.Feature2,
        createdBy: 'user_tenant_id',
        modifiedBy: 'user_tenant_id',
      },
      {
        id: Test.Feature3,
        name: Test.Feature3,
        key: Test.Feature3,
        createdBy: 'user_tenant_id',
        modifiedBy: 'user_tenant_id',
      },
    ]);
  }
});
