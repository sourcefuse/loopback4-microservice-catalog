import {ApplicationConfig} from '@loopback/core';
import {AuthBasicLoginSignupExampleApplication} from './application';
const PORT_NUMBER = 3000;
const ARGV_INDEX = 2;
/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? PORT_NUMBER),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[ARGV_INDEX] ?? './src/openapi.json';
  const app = new AuthBasicLoginSignupExampleApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    process.exit(1);
  });
