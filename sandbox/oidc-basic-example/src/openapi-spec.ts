import {ApplicationConfig} from '@loopback/core';
import {OidcApplication} from './application';

/**
 * Export the OpenAPI spec from the application
 */
const port = 3000;
const two = 2;
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? port),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[two] ?? '';
  const app = new OidcApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch(err => {
  console.error('Fail to export OpenAPI spec from the application.', err); //NOSONAR
  process.exit(1);
});
