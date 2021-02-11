import {ApplicationConfig} from '@loopback/core';
import {AuthMultitenantExampleApplication} from './application';

/**
 * Export the OpenAPI spec from the application
 */
const port = 3000;

async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? port),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[2] ?? './src/openapi.json';
  const app = new AuthMultitenantExampleApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch(err => {
  console.error('Fail to export OpenAPI spec from the application.', err);
  process.exit(1);
});
