// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ApplicationConfig} from '@loopback/core';
import {AuthServiceApplication} from './application';

const port = 3000;
const two = 2;
/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      port: +(process.env.PORT ?? port),
      host: process.env.HOST ?? 'localhost',
    },
  };
  const outFile = process.argv[two] ?? '';
  const app = new AuthServiceApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch(err => {
  console.error('Fail to export OpenAPI spec from the application.', err); //NOSONAR
  process.exit(1);
});
