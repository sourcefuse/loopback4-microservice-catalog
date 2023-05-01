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
import {ChatApplication} from '../application';

export async function setUpApplication(): Promise<AppWithClient> {
  const app = new ChatApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();

  app.bind('datasources.config.Chat').to({
    name: 'chatDb',
    connector: 'memory',
  });
  await app.start();

  const client = createRestAppClient(app);
  app.bind(AuthenticationBindings.CURRENT_USER).to({
    id: 1,
    username: 'test_user',
    password: 'test_password',
  });
  return {app, client};
}

export interface AppWithClient {
  app: ChatApplication;
  client: Client;
}
