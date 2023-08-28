import {ApplicationConfig} from '@loopback/core';
import {NotificationApplication} from './application';

const ARGV_INDEX = 2;
/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[ARGV_INDEX] ?? './src/openapi.json';
  const app = new NotificationApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('Fail to export OpenAPI spec from the application.', err);
    process.exit(1);
  });
