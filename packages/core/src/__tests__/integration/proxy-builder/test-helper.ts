import {juggler} from '@loopback/repository';
import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {TestApp} from './fixtures/test.application';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    host: '127.0.0.1',
    port: 3000,
  });
  setUpEnv();
  const app = new TestApp({
    rest: restConfig,
  });

  app.bind('datasources.db').to(
    new juggler.DataSource({
      name: 'db',
      connector: 'memory',
    }),
  );

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

function setUpEnv() {
  process.env.NODE_ENV = 'test';
  process.env.ENABLE_TRACING = '0';
  process.env.ENABLE_OBF = '0';
  process.env.REDIS_NAME = 'redis';
}

export interface AppWithClient {
  app: TestApp;
  client: Client;
}
