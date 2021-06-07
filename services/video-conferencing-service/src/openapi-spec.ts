import {ApplicationConfig} from '@loopback/core';
import {VideoConfServiceApplication} from './application';

/**
 * Export the OpenAPI spec from the application
 */
const PORT = 3000;
const FILEARGVI = 2;
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? PORT),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[FILEARGVI] ?? 'openapi.json';
  const app = new VideoConfServiceApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch(err => {
  console.error('Fail to export OpenAPI spec from the application.', err); //NOSONAR
  process.exit(1);
});
