import {TaskServiceApplication} from '../application';
import {Client, createRestAppClient} from '@loopback/testlab';

export async function setupApplication(): Promise<AppWithClient> {
  const app = new TaskServiceApplication({
    // Configure your application for testing
    rest: {
      port: 0, // Use an available port
    },
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: TaskServiceApplication;
  client: Client;
}
