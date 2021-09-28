import {Client, expect} from '@loopback/testlab';
import * as jwt from 'jsonwebtoken';
import {AuthClientRepository} from '../../repositories';
import {TestingApplication} from '../fixtures/application';
import {setupApplication} from './test-helper';

describe('Auth Client Controller', () => {
  let app: TestingApplication;
  let client: Client;
  let authClientRepo: AuthClientRepository;
  const basePath = '/auth-clients';
  const pass = 'test_password';
  const testUser = {
    id: 1,
    username: 'test_user',
    password: pass,
    permissions: ['NotAllowed'],
  };

  const token = jwt.sign(testUser, 'test', {
    expiresIn: 180000,
    issuer: 'test',
  });

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  after(async () => app.stop());

  before(givenRepositories);
  afterEach(deleteMockData);

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);

    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed', async () => {
    await client
      .get(basePath)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 200 and client detail when client is added', async () => {
    const reqToAddEntity = await addEntity();
    expect(reqToAddEntity.status).to.be.equal(200);

    const response = await client
      .get(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.have.properties(['clientId', 'clientSecret']);
    expect(response.body.clientId).to.be.equal('test_client_id');
  });

  it('updates client successfully using PATCH request', async () => {
    const reqToAddEntity = await addEntity();

    const entityToUpdate = {
      clientId: 'test_client_id_updated',
      clientSecret: 'test_client_secret',
    };

    await client
      .patch(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(entityToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['clientId', 'clientSecret']);
    expect(response.body.clientId).to.be.equal('test_client_id_updated');
  });

  it('updates client using PUT request', async () => {
    const reqToAddEntity = await addEntity();

    const entityToUpdate = {
      clientId: 'test_client_id_updated',
      clientSecret: 'test_client_secret',
      secret: 'test_secret',
      accessTokenExpiration: 1800,
      refreshTokenExpiration: 1800,
      authCodeExpiration: 1800,
    };

    await client
      .put(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .send(entityToUpdate)
      .expect(204);

    const response = await client
      .get(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).to.have.properties(['clientId', 'clientSecret']);
    expect(response.body.clientId).to.be.equal('test_client_id_updated');
  });

  it('deletes a client successfully', async () => {
    const reqToAddEntity = await addEntity();
    await client
      .del(`${basePath}/${reqToAddEntity.body.id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(204);
  });

  it('should return count', async () => {
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  async function addEntity() {
    const enitityToAdd = {
      clientId: 'test_client_id',
      clientSecret: 'test_client_secret',
      secret: 'test_secret',
      accessTokenExpiration: 1800,
      refreshTokenExpiration: 1800,
      authCodeExpiration: 1800,
    };

    return client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(enitityToAdd);
  }

  async function deleteMockData() {
    await authClientRepo.deleteAllHard();
  }

  async function givenRepositories() {
    authClientRepo = await app.getRepository(AuthClientRepository);
  }
});
