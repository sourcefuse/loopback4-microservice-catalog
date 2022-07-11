// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {AuthenticationBindings} from 'loopback4-authentication';

import {FeatureToggleDbName} from '../../types';
import {TestingApplication} from './application';

export async function setupApplication(): Promise<AppWithClient> {
  const app = new TestingApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();

  app.bind(`datasources.config.${FeatureToggleDbName}`).to({
    name: FeatureToggleDbName,
    connector: 'memory',
  });

  app.bind(AuthenticationBindings.CURRENT_USER).to({
    id: 1,
    username: 'test_user',
    password: 'test_password',
  });
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}
export interface AppWithClient {
  app: TestingApplication;
  client: Client;
}
