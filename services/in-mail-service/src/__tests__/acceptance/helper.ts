import {
  Client,
  createRestAppClient,
  givenHttpServerConfig
} from '@loopback/testlab';
import {InMailApplication} from '../application';

export async function setUpApplication(): Promise<AppWithClient> {
  const app = new InMailApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();

  app.bind('datasources.config.inmail').to({
    name: 'inmail',
    connector: 'memory',
  });
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: InMailApplication;
  client: Client;
}
