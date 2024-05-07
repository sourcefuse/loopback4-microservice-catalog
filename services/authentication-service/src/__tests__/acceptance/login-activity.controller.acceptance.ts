import {Client, expect} from '@loopback/testlab';
import path from 'path';
import {LoginType} from '../../enums';
import {LoginActivityRepository} from '../../repositories';
import {TestingApplication} from '../fixtures/application';
import {JwtToken} from '../fixtures/datasources/userCredsAndPermission';
import {setupApplication} from './test-helper';

describe('', () => {
  let app: TestingApplication;
  let client: Client;
  let loginActivityRepo: LoginActivityRepository;
  let token: string;
  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });
  after(async () => app.stop());
  before(givenLoginActivityRepository);
  before(setMockData);
  beforeEach(() => {
    process.env.JWT_PUBLIC_KEY = path.resolve(
      __dirname,
      '../../../src/__tests__/utils/publicKey.txt',
    );
    process.env.JWT_PRIVATE_KEY = path.resolve(
      __dirname,
      '../../../src/__tests__/utils/privateKey.txt',
    );
    process.env.JWT_ISSUER = 'test';
    token = JwtToken.createToken();
  });
  after(deleteMockData);
  afterEach(() => {
    delete process.env.JWT_ISSUER;
    delete process.env.JWT_SECRET;
    delete process.env.ENCRYPTION_KEY;
    delete process.env.JWT_PUBLIC_KEY;
    delete process.env.JWT_PRIVATE_KEY;
  });
  const basePath = '/login-activity';
  const range =
    'startDate=2024-03-01T00:00:00.596Z&endDate=2024-04-30T23:59:59.596Z';
  const rangeWithFilter =
    'startDate=2024-03-01T00:00:00.596Z&endDate=2024-04-30T23:59:59.596Z&filter={"userIdentity":"actorId","inclusion":true,"userIdentifier":["user1"]}';

  it('throws error when token is not passed', async () => {
    const response = await client.get(`/login-activity/count`).send();
    expect(response.error).to.have.property('status').to.be.equal(401);
  });

  it('returns the count with status code 200', async () => {
    await client
      .get(`${basePath}/count`)
      .set('authorization', `Bearer ${token}`)
      .send()
      .expect(200);
  });

  it('returns all the data when no filter passed', async () => {
    const response = await client
      .get(`${basePath}`)
      .set('authorization', `Bearer ${token}`)
      .send()
      .expect(200);
    expect(response.body.length).to.be.greaterThan(0);
  });

  it('returns single entry matching the id passed in filter', async () => {
    const response = await client
      .get(`${basePath}/1`)
      .set('authorization', `Bearer ${token}`)
      .send()
      .expect(200);
    expect(response.body).to.have.property('id').to.be.equal(`1`);
  });

  it('returns all the daily active users when no filter is passed ', async () => {
    await client
      .get(`/active-users/daily?${range}`)
      .set('authorization', `Bearer ${token}`)
      .send()
      .expect(200);
  });

  it('returns all the monthly active users when no filter is passed ', async () => {
    await client
      .get(`/active-users/monthly?${range}`)
      .set('authorization', `Bearer ${token}`)
      .send()
      .expect(200);
  });

  it('returns only those daily active users that satisfy the passed filter', async () => {
    await client
      .get(`/active-users/daily?${rangeWithFilter}`)
      .set('authorization', `Bearer ${token}`)
      .send()
      .expect(200);
  });

  it('returns only those monthly active users that satisfy the passed filter', async () => {
    await client
      .get(`/active-users/monthly?${rangeWithFilter}`)
      .set('authorization', `Bearer ${token}`)
      .send()
      .expect(200);
  });

  async function givenLoginActivityRepository() {
    loginActivityRepo = await app.getRepository(LoginActivityRepository);
  }

  async function deleteMockData() {
    await loginActivityRepo.deleteAll();
  }
  async function setMockData() {
    const tokenPayload = 'encrypted payload';
    await loginActivityRepo.createAll([
      {
        id: '1',
        actor: 'user1',
        tenantId: 'tenant1',
        loginTime: new Date('2024-03-22T13:28:51.596Z'),
        tokenPayload,
        loginType: LoginType.ACCESS,
        deviceInfo: 'chrome',
        ipAddress: 'ipaddress',
      },
      {
        id: '2',
        actor: 'user1',
        tenantId: 'tenant1',
        loginTime: new Date('2024-03-22T14:28:51.596Z'),
        tokenPayload,
        loginType: LoginType.RELOGIN,
        deviceInfo: 'chrome',
        ipAddress: 'ipaddress',
      },
      {
        id: '3',
        actor: 'user1',
        tenantId: 'tenant1',
        loginTime: new Date('2024-03-22T15:28:51.596Z'),
        tokenPayload,
        loginType: LoginType.LOGOUT,
        deviceInfo: 'chrome',
        ipAddress: 'ipaddress',
      },
      {
        id: '4',
        actor: 'user1',
        tenantId: 'tenant1',
        loginTime: new Date('2024-03-23T13:28:51.596Z'),
        tokenPayload,
        loginType: LoginType.ACCESS,
        deviceInfo: 'chrome',
        ipAddress: 'ipaddress',
      },
      {
        id: '5',
        actor: 'user1',
        tenantId: 'tenant1',
        loginTime: new Date('2024-04-22T13:28:51.596Z'),
        tokenPayload,
        loginType: LoginType.ACCESS,
        deviceInfo: 'chrome',
        ipAddress: 'ipaddress',
      },
    ]);
  }
});
