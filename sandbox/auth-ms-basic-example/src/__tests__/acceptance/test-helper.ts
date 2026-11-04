// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {AuthMultitenantExampleApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {JwtKeysRepository} from '@sourceloop/core';
import {createSign, generateKeyPairSync} from 'node:crypto';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });

  const app = new AuthMultitenantExampleApplication({
    rest: restConfig,
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: AuthMultitenantExampleApplication;
  client: Client;
}

/**
 * Boots the app with its datasources on the memory connector and returns a
 * bearer token the verifier accepts, signed with a key saved on the memory
 * AuthDB.
 */
export async function setupBenchApplication(): Promise<BenchApp> {
  process.env.JWT_ISSUER = 'bench';
  const app = new AuthMultitenantExampleApplication({
    rest: givenHttpServerConfig({}),
  });
  app
    .bind('datasources.config.AuthDB')
    .to({name: 'AuthDB', connector: 'memory'});
  app
    .bind('datasources.config.AuthCache')
    .to({name: 'AuthCache', connector: 'kv-memory'});
  await app.boot();
  await app.start();

  const keyId = 'bench-key';
  const {publicKey, privateKey} = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {type: 'spki', format: 'pem'},
    privateKeyEncoding: {type: 'pkcs8', format: 'pem'},
  });
  const jwtKeysRepo = await app.getRepository(JwtKeysRepository);
  await jwtKeysRepo.create({keyId, publicKey, privateKey});

  const encode = (part: object) =>
    Buffer.from(JSON.stringify(part)).toString('base64url');
  const unsigned = `${encode({alg: 'RS256', typ: 'JWT', kid: keyId})}.${encode({
    iss: process.env.JWT_ISSUER,
    id: 'bench-user',
    userTenantId: 'bench-user',
    username: 'bench-user',
    tenantId: 'bench-tenant',
    permissions: [],
  })}`;
  const signature = createSign('RSA-SHA256')
    .update(unsigned)
    .sign(privateKey, 'base64url');

  return {
    app,
    client: createRestAppClient(app),
    token: `${unsigned}.${signature}`,
  };
}

export interface BenchApp extends AppWithClient {
  token: string;
}
