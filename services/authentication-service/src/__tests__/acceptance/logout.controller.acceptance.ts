import {Client, createRestAppClient, expect} from '@loopback/testlab';
import {AuthenticationServiceApplication} from '../../application';
import {
  RevokedTokenRepository,
  RefreshTokenRepository,
} from '../../repositories';
import {randomBytes} from 'crypto';
import * as jwt from 'jsonwebtoken';
import {setupApplication} from './test-helper';
const refreshToken: string = randomBytes(32).toString('hex');
const testUser = {
  deleted: false,
  id: '1',
  firstName: 'Test',
  lastName: 'User',
  username: 'test_user',
  authClientIds: [1],
  defaultTenantId: undefined,
  permissions: ['canLoginToIPS', 'ViewOwnUser'],
  role: '1',
  authClientId: 1,
  deviceInfo: {deviceId: undefined, userAgent: 'node-superagent/3.8.3'},
  userPreferences: {locale: 'en'},
  userTenantId: '1',
  tenantId: 'web',
  status: 1,
};
const accessToken = jwt.sign(testUser, 'jwt-secret', {
  expiresIn: 180000,
  issuer: 'jwt',
});
describe('Logout Controller', () => {
  let app: AuthenticationServiceApplication;
  let client: Client;
  let revokedTokenRepository: RevokedTokenRepository;
  let refreshTokenRepository: RefreshTokenRepository;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  after(() => app.stop());
  before(givenRefreshTokenRepository);
  before(givenRevokedTokenRepository);
  before(() => {
    client = createRestAppClient(app);
  });
  beforeEach(setMockData);
  afterEach(deleteMockData);
  it('Should return 401 and token invalid on requesting with invalid auth token', async () => {
    testUser.username = 'spam_user';
    const invalidAccessToken = jwt.sign(testUser, 'sourav-secret', {
      expiresIn: 180000,
      issuer: 'sourav',
    });
    const logoutRequest = {
      refreshToken: refreshToken,
    };
    const response = await client
      .post(`/logout`)
      .send(logoutRequest)
      .set('Authorization', `Bearer ${invalidAccessToken}`)
      .expect(401);
    expect(response.body).is.have.property('error');
  });
  async function givenRefreshTokenRepository() {
    refreshTokenRepository = await app.getRepository(RefreshTokenRepository);
  }
  async function givenRevokedTokenRepository() {
    revokedTokenRepository = await app.getRepository(RevokedTokenRepository);
  }
  async function deleteMockData() {
    await refreshTokenRepository.deleteAll();
    await revokedTokenRepository.deleteAll();
  }
  async function setMockData() {
    await refreshTokenRepository.set(
      refreshToken,
      {
        clientId: 'cto_web',
        userId: '1',
        username: 'test_user',
        accessToken,
      },
      {ttl: 900},
    );
  }
});
