import {VideoConferencingApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';

export async function setupApplication(): Promise<AppWithClient> {
  const restConfig = givenHttpServerConfig({
    // Customize the server configuration here.
    // Empty values (undefined, '') will be ignored by the helper.
    //
    // host: process.env.HOST,
    // port: +process.env.PORT,
  });
  setUpEnv();

  const app = new VideoConferencingApplication({
    rest: restConfig,
  });

  app.bind('datasources.config.videoConf').to({
    name: 'videoConf',
    connector: 'memory',
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
}

export interface AppWithClient {
  app: VideoConferencingApplication;
  client: Client;
}
