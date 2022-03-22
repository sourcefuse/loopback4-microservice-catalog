import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {FeatureToggleDbName} from '../..';
import {
  FeatureRepository,
  FeatureToggleRepository,
  StrategyRepository,
} from '../../repositories';
import {TestingApplication} from './application';
import {TestController} from './controllers/test.controller';

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
      id: 'feature_1',
      name: 'feature_1',
      key: 'feature_1',
    },
    {
      id: 'feature_2',
      name: 'feature_2',
      key: 'feature_2',
    },
    {
      id: 'feature_3',
      name: 'feature_3',
      key: 'feature_3',
    },
    {
      id: 'feature_4',
      name: 'feature_4',
      key: 'feature_4',
    },
  ]);

  await strategyRepository.createAll([
    {
      name: 'System',
      key: 'System',
    },
    {
      name: 'Tenant',
      key: 'Tenant',
    },
    {
      name: 'User',
      key: 'User',
    },
  ]);

  await featureToggleRepo.createAll([
    {
      featureKey: 'feature_4',
      strategyKey: 'System',
      strategyEntityId: 'feature_4',
      status: false,
    },
    {
      featureKey: 'feature_3',
      strategyKey: 'Tenant',
      strategyEntityId: 'tenant_id',
      status: false,
    },
    {
      featureKey: 'feature_2',
      strategyKey: 'User',
      strategyEntityId: 'user_tenant_id',
      status: false,
    },
  ]);
}

export interface AppWithClient {
  app: TestingApplication;
  client: Client;
}
