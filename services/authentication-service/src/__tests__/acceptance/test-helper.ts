import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {AuthenticationBindings, Strategies} from 'loopback4-authentication';
import {
  ClientPasswordVerifyProvider,
  LocalPasswordVerifyProvider,
  ResourceOwnerVerifyProvider,
} from '../../modules/auth';
import {AuthCacheSourceName, AuthDbSourceName} from '../../types';
import {TestingApplication} from '../fixtures/application';

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
    id: 1,
    username: 'test_user',
    password: 'temp123!@',
  });

  app
    .bind(Strategies.Passport.LOCAL_PASSWORD_VERIFIER)
    .toProvider(LocalPasswordVerifyProvider);

  app
    .bind(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER)
    .toProvider(ClientPasswordVerifyProvider);

  app
    .bind(Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER)
    .toProvider(ResourceOwnerVerifyProvider);

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: TestingApplication;
  client: Client;
}
