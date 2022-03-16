import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {StrategyBindings} from '../../keys';
import {TestingApplication} from './application';
import {TestSystemStrategyProvider} from './system-strategy.provider';
import {TestStrategyHelperService} from './test-strategy-helper.service';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({});

  const app = new TestingApplication({
    rest: restConfig,
  });

  await app.boot();

  app
    .bind(StrategyBindings.SYSTEM_STRATEGY)
    .toProvider(TestSystemStrategyProvider);
  app.bind('test.StrategyHelperService').toClass(TestStrategyHelperService);

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: TestingApplication;
  client: Client;
}
