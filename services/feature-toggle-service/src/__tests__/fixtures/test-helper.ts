import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {FeatureToggleDbName} from '../..';
import {StrategyKey} from '../../enums';
import {
  FeatureRepository,
  FeatureToggleRepository,
  StrategyRepository,
} from '../../repositories';
import {TestingApplication} from './application';
import {TestController} from './controllers/test.controller';
import {Test} from './test.enum';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({});

  const app = new TestingApplication({
    rest: restConfig,
  });

  await app.boot();

  app.bind(`datasources.config.${FeatureToggleDbName}`).to({
    name: FeatureToggleDbName,
    connector: 'memory',
  });

  app.controller(TestController);

  //Seed data
  await seed(app);

  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

async function seed(app: TestingApplication) {
  const featureToggleRepo = await app.getRepository(FeatureToggleRepository);
  const strategyRepository = await app.getRepository(StrategyRepository);
  const featureRepo = await app.getRepository(FeatureRepository);

  await featureRepo.createAll([
    {
      id: Test.Feature1,
      name: Test.Feature1,
      key: Test.Feature1,
    },
    {
      id: Test.Feature2,
      name: Test.Feature2,
      key: Test.Feature2,
    },
    {
      id: Test.Feature3,
      name: Test.Feature3,
      key: Test.Feature3,
    },
    {
      id: Test.Feature4,
      name: Test.Feature4,
      key: Test.Feature4,
    },
  ]);

  await strategyRepository.createAll([
    {
      name: StrategyKey.System,
      key: StrategyKey.System,
    },
    {
      name: StrategyKey.Tenant,
      key: StrategyKey.Tenant,
    },
    {
      name: StrategyKey.User,
      key: StrategyKey.User,
    },
  ]);

  await featureToggleRepo.createAll([
    {
      featureKey: Test.Feature4,
      strategyKey: StrategyKey.System,
      strategyEntityId: Test.Feature4,
      status: false,
    },
    {
      featureKey: Test.Feature3,
      strategyKey: StrategyKey.Tenant,
      strategyEntityId: 'tenant_id',
      status: false,
    },
    {
      featureKey: Test.Feature2,
      strategyKey: StrategyKey.User,
      strategyEntityId: 'user_tenant_id',
      status: false,
    },
  ]);
}

export interface AppWithClient {
  app: TestingApplication;
  client: Client;
}
