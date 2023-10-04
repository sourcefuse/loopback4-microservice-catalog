import {ApplicationConfig} from '@loopback/core';
import {TaskServiceUserApplication} from './application';

/**
 * Export the OpenAPI spec from the application
 */

const DEFAULT_PORT = 3000;
const ARGVI = 2;

async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? DEFAULT_PORT),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[ARGVI] ?? '';
  const app = new TaskServiceUserApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch(err => {
  console.error('Fail to export OpenAPI spec from the application.', err); //NOSONAR
  process.exit(1);
});
