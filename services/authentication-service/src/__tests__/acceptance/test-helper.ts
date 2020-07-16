import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {AuthenticationBindings} from 'loopback4-authentication';
import {TestingApplication} from '../fixtures/application';
import {AuthDbSourceName, AuthCacheSourceName} from '../../types';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({});

  const app = new TestingApplication({
    rest: restConfig,
  });

  await app.boot();

  app.bind(`datasources.config.${AuthDbSourceName}`).to({
    name: AuthDbSourceName,
    connector: 'memory',
  });

  app.bind(`datasources.config.${AuthCacheSourceName}`).to({
    name: 'redis',
    connector: 'kv-memory',
  });
  app.bind(AuthenticationBindings.CURRENT_USER).to({
    id: 100,
    username: 'test_user',
    password: 'test_password',
  });

  app.bind(AuthenticationBindings.CURRENT_USER).to({
    id: 1,
    username: 'test_user',
    password: 'temp123!@',
  });

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: TestingApplication;
  client: Client;
}
