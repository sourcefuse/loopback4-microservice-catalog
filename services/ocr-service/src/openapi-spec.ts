// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {ApplicationConfig} from '@loopback/core';
import {OcrServiceApplication} from './application';

const ARGV_INDEX = 2;
const port = 3000;
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
  const outFile = process.argv[ARGV_INDEX] ?? './src/openapi.json';
  const app = new OcrServiceApplication(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error('Fail to export OpenAPI spec from the application.', err); //NOSONAR
    process.exit(1);
  });
