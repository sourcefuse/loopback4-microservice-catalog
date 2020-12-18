import {AuthMultitenantExampleApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    host: process.env.HOST,
    port: +(process.env.PORT ?? 3000),
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
