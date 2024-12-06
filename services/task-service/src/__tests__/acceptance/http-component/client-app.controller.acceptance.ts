import {Client, sinon} from '@loopback/testlab';
import {JwtKeysRepository} from '@sourceloop/core';
import {generateKeyPairSync} from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as jose from 'node-jose';
import {TaskPermssionKey} from '../../../enums/permission-key.enum';
import {ClientAppDTO} from '../../../models';
import {mockLogger, setupApplication} from '../../fixtures/test-helper';
import {TestTaskServiceApplication} from '../../fixtures/test.application';

describe(`ClientAppController: Acceptance`, () => {
  let app: TestTaskServiceApplication;
  let client: Client;
  let logger: ReturnType<typeof mockLogger>;
  let jwtKeyRepo: JwtKeysRepository;
  let sandbox: sinon.SinonSandbox;
  let stubCommand: sinon.SinonStub;
  const mockDto = new ClientAppDTO({
    clientName: 'test-app',
  });
  before('setupApplication', async () => {
    sandbox = sinon.createSandbox();
    logger = mockLogger(sandbox);
    ({app, client} = await setupApplication(logger));
    // stub a command for task workflow
    stubCommand = sandbox.stub();
    stubCommand.returns({});
    jwtKeyRepo = await app.getRepository(JwtKeysRepository);
  });

  before(async () => {
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
  });

  after(async () => {
    await jwtKeyRepo.deleteAll();
    await app.stop();
  });

  it('should create a client app key', async () => {
    const token = await generateToken([TaskPermssionKey.CreateApiKey]);
    await client
      .post('/client-app')
      .set('Authorization', `Bearer ${token}`)
      .send(mockDto)
      .expect(200);
  });

  async function generateToken(permissions: string[]): Promise<string> {
    const keys = await jwtKeyRepo.find();
    return jwt.sign(
      {
        id: 'test',
        userTenantId: 'test',
        permissions,
      },
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
