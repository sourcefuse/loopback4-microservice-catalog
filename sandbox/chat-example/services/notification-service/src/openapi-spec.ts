import {ApplicationConfig} from '@loopback/core';
import {NotificationServiceApplication} from './application';

/**
 * Export the OpenAPI spec from the application
 */

const DEFAULT_PORT = 3003;
const TWO = 2;

async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? DEFAULT_PORT),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[TWO] ?? '';
  const app = new NotificationServiceApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch(err => {
  process.exit(1);
});
