import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {AuthApplication} from '../..';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });
  setUpEnv();

  const app = new AuthApplication({
    rest: restConfig,
  });

  app.bind('datasources.config.auth').to({
    name: 'auth',
    connector: 'memory',
  });

  app.bind(`datasources.config.${process.env.REDIS_NAME}`).to({
    name: process.env.REDIS_NAME,
    connector: 'kv-memory',
  });

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
  process.env.HOST = '127.0.0.1';
}

export interface AppWithClient {
  app: AuthApplication;
  client: Client;
}
