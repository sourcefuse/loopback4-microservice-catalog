import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {StrategyBindings} from '../../keys';
import {TestingApplication} from './application';
import {SystemFeatureTestProvider} from './system-feature-test.provider';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({});

  const app = new TestingApplication({
    rest: restConfig,
  });

  await app.boot();

  app.bind(StrategyBindings.METADATA).to({
    features: [StrategyBindings.SYSTEM_FEATURE],
  });
  app
    .bind(StrategyBindings.SYSTEM_FEATURE)
    .toProvider(SystemFeatureTestProvider);

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: TestingApplication;
  client: Client;
}
