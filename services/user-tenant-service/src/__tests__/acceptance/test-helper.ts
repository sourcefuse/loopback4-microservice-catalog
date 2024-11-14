// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {UserTenantServiceApplication} from '../../application';
import {AuthenticationDbDataSource} from '../datasources';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });
  setUpEnv();

  const app = new UserTenantServiceApplication({
    rest: restConfig,
  });

  app.bind('datasources.AuthDB').to({
    name: 'AuthDB',
    connector: 'memory',
  });
  app.dataSource(AuthenticationDbDataSource);
  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

function setUpEnv() {
  process.env.NODE_ENV = 'test';
  process.env.ENABLE_TRACING = '0';
  process.env.ENABLE_OBF = '0';
  process.env.USER_CALLBACK_SECRET = 'sf-test';
  process.env.JWT_ISSUER = issuer;
  process.env.FIRST_USER_ROLE = 'SuperAdmin';
}

export interface AppWithClient {
  app: UserTenantServiceApplication;
  client: Client;
}

export const issuer = 'sf';
export const secret = 'test_secret';
