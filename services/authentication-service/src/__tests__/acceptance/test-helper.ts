import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {TestingApplication} from '../fixtures/application';
import {AuthDbSourceName, AuthCacheSourceName} from '../../types';
import {AuthenticationBindings, Strategies} from 'loopback4-authentication';
import {TestOauthPasswordVerifyProvider} from '../fixtures/providers/oauth-password-verifier.provider';
import {TestPasswordVerifyProvider} from '../fixtures/providers/local-password.provider';
import {TestResourceOwnerVerifyProvider} from '../fixtures/providers/resource-owner.provider';

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
    .toProvider(TestPasswordVerifyProvider);

  app
    .bind(Strategies.Passport.OAUTH2_CLIENT_PASSWORD_VERIFIER)
    .toProvider(TestOauthPasswordVerifyProvider);

  app
    .bind(Strategies.Passport.RESOURCE_OWNER_PASSWORD_VERIFIER)
    .toProvider(TestResourceOwnerVerifyProvider);

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: TestingApplication;
  client: Client;
}
