import {AnyObject} from '@loopback/repository';
import {Client, expect} from '@loopback/testlab';
import {JwtKeysRepository} from '@sourceloop/core';
import {generateKeyPairSync} from 'crypto';
import * as jwt from 'jsonwebtoken';
import {AuthenticationBindings} from 'loopback4-authentication';
import {nanoid} from 'nanoid';
import * as jose from 'node-jose';
import {UserTenantServiceApplication} from '../../application';
import {PermissionKey} from '../../enums';
import {Role, Tenant, User, UserTenant} from '../../models';
import {
  RoleRepository,
  TenantRepository,
  UserRepository,
  UserTenantRepository,
} from '../../repositories';
import {setupApplication} from './test-helper';

interface USER {
  id: string | undefined;
  userTenantId: string | undefined;
  username: string;
  tenantId: string | undefined;
  password: string;
  permissions: PermissionKey[];
  defaultTenantId: string | undefined;
}

describe('UserTenantPrefs Controller', function (this: Mocha.Suite) {
  this.timeout(100000);
  let app: UserTenantServiceApplication;
  let userTenantRepo: UserTenantRepository;
  let roleRepo: RoleRepository;
  let tenantRepo: TenantRepository;
  let jwtKeyRepo: JwtKeysRepository;
  let userRepo: UserRepository;
  const basePath = '/user-tenant-prefs';
  let client: Client;
  let token: string;
  const pass = 'test_password';
  const tenantName = 'sample_tenant';
  let testUser: USER = {
    id: undefined,
    userTenantId: undefined,
    username: '',
    tenantId: undefined,
    defaultTenantId: undefined,
    password: pass,
    permissions: [
      PermissionKey.UpdateUserTenantPreference,
      PermissionKey.ViewUserTenantPreference,
      PermissionKey.ViewUserTenantPreferenceNum,
      PermissionKey.CreateUserTenantPreference,
    ],
  };
  const data = {
    configValue: {value: 'sample value'},
    configKey: 'last-accessd-url',
  };

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await jwtKeyRepo.deleteAll();
    await app.stop();
  });
  before(givenRepositories);
  before(setJwtKeysMockData);
  before(setCurrentUser);
  before(setupMockData);

  it('gives status 401 when no token is passed', async () => {
    const response = await client.get(basePath).expect(401);
    expect(response).to.have.property('error');
  });

  it('gives status 200 when token is passed ', async () => {
    await client
      .get(basePath)
      .set('authorization', `Bearer ${token}`)
      .expect(200);
  });

  it('gives status 422 when request body is invalid', async () => {
    const userTenantPrefs = {};
    await client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(userTenantPrefs)
      .expect(422);
  });

  it('gives status 200 when a new userTenantPref is created', async () => {
    await client
      .post(basePath)
      .set('authorization', `Bearer ${token}`)
      .send(data)
      .expect(200);
  });

  async function givenRepositories() {
    userTenantRepo = await app.getRepository(UserTenantRepository);
    userRepo = await app.getRepository(UserRepository);
    roleRepo = await app.getRepository(RoleRepository);
    tenantRepo = await app.getRepository(TenantRepository);
    jwtKeyRepo = await app.getRepository(JwtKeysRepository);
  }

  async function setupMockData() {
    const key = nanoid(10);
    const tenant = await tenantRepo.create(
      new Tenant({
        name: tenantName,
        key: key,
        status: 1,
      }),
    );

    const user = await userRepo.create(
      new User({
        firstName: 'tenant_pref_user',
        username: 'tenant_pref_test_user',
        email: 'abc@xyz',
        defaultTenantId: tenant.id,
      }),
    );

    const newRole = new Role();
    newRole.name = 'test_admin';
    newRole.roleType = 0;
    newRole.tenantId = tenant.id ?? '';
    testUser.tenantId = tenant.id;
    const role = await roleRepo.create(newRole);
    const userTenant = await userTenantRepo.create(
      new UserTenant({
        userId: user.id,
        tenantId: tenant.id,
        roleId: role.id,
      }),
    );
    testUser = {
      id: user.id,
      userTenantId: userTenant.id,
      username: user.username,
      tenantId: tenant.id,
      defaultTenantId: tenant.id,
      password: pass,
      permissions: [
        PermissionKey.UpdateUserTenantPreference,
        PermissionKey.ViewUserTenantPreference,
        PermissionKey.ViewUserTenantPreferenceNum,
        PermissionKey.CreateUserTenantPreference,
      ],
    };
    await setCurrentUser();
  }

  async function setJwtKeysMockData() {
    process.env.JWT_PRIVATE_KEY_PASSPHRASE = 'jwt_private_key_passphrase';
    const {publicKey, privateKey} = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE,
      },
    });

    // Create the JWKS object
    const keyStore = jose.JWK.createKeyStore();
    const key = await keyStore.add(publicKey, 'pem');
    await jwtKeyRepo.create({
      keyId: key.kid, // Unique identifier for the key
      publicKey: publicKey,
      privateKey: privateKey,
    });
  }

  async function setCurrentUser() {
    app.bind(AuthenticationBindings.CURRENT_USER).to(testUser);
    token = await generateToken(testUser);
  }

  async function generateToken(userData: AnyObject): Promise<string> {
    const keys = await jwtKeyRepo.find();
    return jwt.sign(
      userData,
      {
        key: keys[0].privateKey,
        passphrase: process.env.JWT_PRIVATE_KEY_PASSPHRASE,
      },
      {
        algorithm: 'RS256',
        issuer: process.env.JWT_ISSUER,
        keyid: keys[0].keyId,
      },
    );
  }
});
