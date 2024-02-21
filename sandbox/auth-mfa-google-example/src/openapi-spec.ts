import {ApplicationConfig} from '@loopback/core';
import {AuthenticationServiceApplication} from './application';

const ARGV_INDEX = 2;
/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
  const DEFAULT_PORT = 3000;
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? DEFAULT_PORT),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[ARGV_INDEX] ?? './src/openapi.json';
  const app = new AuthenticationServiceApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec()
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
