// Copyright (c) 2023 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {AuthenticationBindings} from 'loopback4-authentication';
import {SurveyDbSourceName} from '../../types';
import {SurveyServiceApplication} from '../application';

export async function setUpApplication(): Promise<AppWithClient> {
  const app = new SurveyServiceApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();

  app.bind(`datasources.config.${SurveyDbSourceName}`).to({
    name: SurveyDbSourceName,
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
  app: SurveyServiceApplication;
  client: Client;
}
