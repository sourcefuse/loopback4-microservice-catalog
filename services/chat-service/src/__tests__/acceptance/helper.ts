import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
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

  return {app, client};
}

export interface AppWithClient {
  app: ChatApplication;
  client: Client;
}
