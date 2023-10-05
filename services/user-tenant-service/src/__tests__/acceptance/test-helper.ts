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
  process.env.JWT_SECRET = 'test_secret';
  process.env.JWT_ISSUER = 'sf';
}

export interface AppWithClient {
  app: UserTenantServiceApplication;
  client: Client;
}
