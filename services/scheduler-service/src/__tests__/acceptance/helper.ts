import {
  Client,
  createRestAppClient,
  givenHttpServerConfig,
} from '@loopback/testlab';
import {SchedulerApplication} from '../application';

export async function setUpApplication(): Promise<AppWithClient> {
  const app = new SchedulerApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();

  app.bind('datasources.config.schedulerDb').to({
    name: 'pgdb',
    connector: 'memory',
  });
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: SchedulerApplication;
  client: Client;
}
