// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {NotificationBindings} from 'loopback4-notifications';
import {NotifServiceBindings} from '../../keys';
import {NotificationApplication} from '../application';
import {
  ChannelManagerMockProvider,
  PubNubMockProvider,
  SnsMockProvider,
} from '../fixture';

export async function setUpApplication(): Promise<AppWithClient> {
  const app = new NotificationApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();

  app.bind('datasources.config.notificationDb').to({
    name: 'pgdb',
    connector: 'memory',
  });

  app
    .bind(NotificationBindings.NotificationProvider)
    .toProvider(SnsMockProvider);

  app.bind(NotificationBindings.PushProvider).toProvider(PubNubMockProvider);

  app
    .bind(NotifServiceBindings.ChannelManager)
    .toProvider(ChannelManagerMockProvider);

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: NotificationApplication;
  client: Client;
}
